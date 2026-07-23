/* Portfolio password protection — password: corgi (any casing, e.g. Corgi) */
(function () {
  var PASSWORD = 'corgi';
  var KEY = 'portfolio_auth';
  var lockedScrollY = 0;
  var overlay = null;
  var pendingHref = null;
  var pendingNewTab = false;
  var touchBlocker = null;
  var gatePageFlag = false;

  function isAuthed() {
    return sessionStorage.getItem(KEY) === '1';
  }

  function isHomePage() {
    if (document.body && document.body.classList.contains('page-home')) return true;
    var path = window.location.pathname || '';
    return path === '/' || path.endsWith('/') || /\/index\.html$/i.test(path);
  }

  function focusPwInput() {
    var input = document.getElementById('pw-input');
    if (!input) return;
    try {
      input.focus({ preventScroll: true });
    } catch (e) {
      input.focus();
    }
  }

  function passwordMatches(raw) {
    var entered = String(raw || '').trim();
    if (!entered) return false;
    return entered.localeCompare(PASSWORD, 'en', { sensitivity: 'base' }) === 0;
  }

  function lockScroll(gatePage) {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('portfolio-locked');
    if (gatePage) {
      document.documentElement.classList.add('portfolio-gated');
    }
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + lockedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.classList.remove('portfolio-locked', 'portfolio-gated');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, lockedScrollY);
  }

  function blockTouchScroll(e) {
    var target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    e.preventDefault();
  }

  function ensureFonts() {
    if (document.querySelector('link[data-pw-fonts]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400' +
      '&family=Roboto:wght@300;400;500;700&display=swap';
    link.setAttribute('data-pw-fonts', '1');
    document.head.appendChild(link);
  }

  function cardHTML() {
    return (
      '<div class="pw-intro">' +
        '<p id="pw-title" class="pw-brand">Glad you&#8217;re here</p>' +
      '</div>' +
      '<p class="pw-lead">You&#8217;ll find the password in the top-right corner of my resume.</p>' +
      '<div class="pw-hint" aria-hidden="true">' +
        '<div class="pw-sticker pw-sticker--hint">' +
          '<div class="pw-hint-stage">' +
            '<svg class="pw-hint-icon" viewBox="0 0 124 150" width="124" height="150" focusable="false">' +
              '<defs>' +
                '<linearGradient id="pwDocFill" x1="0" y1="0" x2="0" y2="1">' +
                  '<stop offset="0%" stop-color="#ffffff"/>' +
                  '<stop offset="100%" stop-color="#f4f4f5"/>' +
                '</linearGradient>' +
              '</defs>' +
              '<rect class="pw-hint-doc" x="24" y="26" width="76" height="100" rx="11" />' +
              '<path class="pw-hint-fold-fill" d="M80 26l20 20H86c-3.3 0-6-2.7-6-6V26z" />' +
              '<path class="pw-hint-fold" d="M80 26v14c0 3.3 2.7 6 6 6h20" />' +
              '<rect class="pw-hint-bar" x="36" y="48" width="32" height="6" rx="3" />' +
              '<line class="pw-hint-line" x1="36" y1="66" x2="86" y2="66" />' +
              '<line class="pw-hint-line" x1="36" y1="76" x2="80" y2="76" />' +
              '<line class="pw-hint-line" x1="36" y1="86" x2="84" y2="86" />' +
              '<line class="pw-hint-line" x1="36" y1="96" x2="70" y2="96" />' +
              '<rect class="pw-hint-mark" x="70" y="40" width="22" height="13" rx="4" />' +
            '</svg>' +
            '<div class="pw-mag">' +
              '<div class="pw-mag-lens">' +
                '<span class="pw-mag-dots"></span>' +
                '<span class="pw-mag-shine"></span>' +
                '<span class="pw-mag-shine-arc"></span>' +
              '</div>' +
              '<div class="pw-mag-rim" aria-hidden="true"></div>' +
              '<span class="pw-mag-handle"></span>' +
              '<span class="pw-mag-cap"></span>' +
            '</div>' +
            '<span class="pw-cursor pw-cursor--eric" aria-hidden="true">' +
              '<span class="pw-cursor__pointer">' +
                '<svg class="pw-cursor__arrow" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1.5 1 1.5 14.5 4.8 11.2 7.2 16.8 9.2 15.6 7 10 14 10 1.5 1z"/></svg>' +
              '</span>' +
              '<span class="pw-cursor__pill">Eric</span>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<form id="pw-form" class="pw-form">' +
        '<input id="pw-input" class="pw-input" type="password" placeholder="Password" aria-label="Password" autocomplete="current-password" autofocus />' +
        '<button id="pw-btn" class="pw-btn" type="submit">Continue</button>' +
      '</form>' +
      '<p id="pw-err" class="pw-err" hidden aria-live="polite">Incorrect password — try again.</p>'
    );
  }

  function overlayHTML() {
    return (
      '<button type="button" class="pw-close" id="pw-close" aria-label="Close dialog">×</button>' +
      '<div class="pw-backdrop" id="pw-glass-backdrop-mount" aria-hidden="true"></div>' +
      '<div class="pw-panel">' +
        '<div class="pw-panel-inner">' +
          '<div class="pw-floaters" aria-hidden="true">' +
            '<div class="pw-sticker pw-sticker--music">' +
              '<img src="images/pw-stickers/music.svg" alt="" width="64" height="64" decoding="async" />' +
            '</div>' +
            '<div class="pw-sticker pw-sticker--globe">' +
              '<img src="images/pw-stickers/globe.svg" alt="" width="64" height="64" decoding="async" />' +
            '</div>' +
            '<div class="pw-sticker pw-sticker--shades">' +
              '<img src="images/pw-stickers/shades.svg" alt="" width="76" height="20" decoding="async" />' +
            '</div>' +
            '<div class="pw-sticker pw-sticker--corgi">' +
              '<img src="images/pw-stickers/corgi.png?v=2" alt="" width="72" height="72" decoding="async" />' +
            '</div>' +
          '</div>' +
          '<div id="pw-glass-mount">' +
            '<div id="pw-panel-content" class="pw-glass-card">' +
              cardHTML() +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function closeOverlay(options) {
    options = options || {};
    if (!overlay) return;

    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';

    if (overlay._keyDownHandler) {
      document.removeEventListener('keydown', overlay._keyDownHandler);
      overlay._keyDownHandler = null;
    }

    if (touchBlocker) {
      document.removeEventListener('touchmove', touchBlocker);
      touchBlocker = null;
    }

    var href = options.navigate ? (options.href || pendingHref) : null;
    var openNewTab = !!(options.navigate && pendingNewTab);
    pendingHref = null;
    pendingNewTab = false;
    gatePageFlag = false;

    setTimeout(function () {
      if (overlay) overlay.remove();
      overlay = null;
      unlockScroll();
      if (href) {
        if (openNewTab) {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = href;
        }
      }
    }, 350);
  }

  function dismissOverlay() {
    if (gatePageFlag) {
      closeOverlay({ navigate: true, href: 'index.html' });
      return;
    }
    closeOverlay({ navigate: false });
  }

  function initLiquidGlass() {
    if (typeof window.initLiquidGlassPassword === 'function') {
      window.initLiquidGlassPassword();
    }
  }

  function mountModal(href, gatePage, newTab) {
    if (overlay) return;
    pendingHref = href || null;
    pendingNewTab = !!newTab;
    gatePageFlag = !!gatePage;
    ensureFonts();
    lockScroll(gatePage);

    touchBlocker = blockTouchScroll;
    document.addEventListener('touchmove', touchBlocker, { passive: false });

    overlay = document.createElement('div');
    overlay.id = 'pw-overlay';
    overlay.className = 'pw-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'pw-title');
    overlay.innerHTML = overlayHTML();
    document.body.appendChild(overlay);

    var input = overlay.querySelector('#pw-input');
    var err = overlay.querySelector('#pw-err');
    var backdrop = overlay.querySelector('#pw-glass-backdrop-mount');
    var panel = overlay.querySelector('.pw-panel');

    overlay.querySelector('#pw-close').addEventListener('click', dismissOverlay);
    backdrop.addEventListener('click', dismissOverlay);
    panel.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    overlay._keyDownHandler = function (e) {
      if (e.key === 'Escape') dismissOverlay();
    };
    document.addEventListener('keydown', overlay._keyDownHandler);

    overlay.querySelector('#pw-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (passwordMatches(input.value)) {
        sessionStorage.setItem(KEY, '1');
        if (gatePageFlag) {
          closeOverlay({ navigate: false });
        } else {
          closeOverlay({ navigate: true });
        }
      } else {
        err.hidden = false;
        input.value = '';
        focusPwInput();
      }
    });

    requestAnimationFrame(function () {
      initLiquidGlass();
      setTimeout(focusPwInput, 80);
      setTimeout(focusPwInput, 120);
    });
  }

  function isProtectedHref(href) {
    if (!href || href.charAt(0) === '#') return false;
    if (/resume\.pdf/i.test(href)) return true;
    return /\.html(?:[?#]|$)/i.test(href);
  }

  var PROTECTED_LINK_SELECTOR =
    'a.index-card[href], a.hero-nav-resume[href], a.nav-resume[href], a[href*="resume.pdf"]';

  function bindProtectedLinks() {
    document.querySelectorAll(PROTECTED_LINK_SELECTOR).forEach(function (link) {
      if (link.dataset.pwBound === '1') return;
      link.dataset.pwBound = '1';
      link.addEventListener('click', function (e) {
        if (isAuthed()) return;
        var href = link.getAttribute('href');
        if (!isProtectedHref(href)) return;
        e.preventDefault();
        mountModal(href, false, link.getAttribute('target') === '_blank');
      });
    });
  }

  function init() {
    if (isAuthed()) return;

    if (isHomePage()) {
      bindProtectedLinks();
      return;
    }

    mountModal(null, true);
  }

  window.focusPwInput = focusPwInput;

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
