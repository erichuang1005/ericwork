/* Portfolio password protection — password: corgi (any casing, e.g. Corgi) */
(function () {
  var PASSWORD = 'corgi';
  var KEY = 'portfolio_auth';

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

  if (sessionStorage.getItem(KEY) === '1') return;

  document.documentElement.classList.add('portfolio-locked');

  function ensureFonts() {
    if (document.querySelector('link[data-pw-fonts]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700' +
      '&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&display=swap';
    link.setAttribute('data-pw-fonts', '1');
    document.head.appendChild(link);
  }

  document.documentElement.style.overflow = 'hidden';

  function mount() {
    ensureFonts();

    var overlay = document.createElement('div');
    overlay.id = 'pw-overlay';
    overlay.className = 'pw-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'pw-title');
    overlay.innerHTML =
      '<div class="pw-backdrop" aria-hidden="true"></div>' +
      '<header class="pw-chrome">' +
        '<p id="pw-title" class="pw-brand">Eric Huang</p>' +
      '</header>' +
      '<div class="pw-panel">' +
        '<div class="pw-panel-inner">' +
          '<p class="pw-lead"><span class="pw-hello">Hi there,</span> Thanks for stopping by. You&#8217;ll find the password on the top right of my resume.</p>' +
          '<div class="pw-hint" aria-hidden="true">' +
            '<div class="pw-hint-stage">' +
              '<svg class="pw-hint-icon" viewBox="0 0 124 150" width="124" height="150" focusable="false">' +
                '<defs>' +
                  '<linearGradient id="pwDocFill" x1="0" y1="0" x2="0" y2="1">' +
                    '<stop offset="0%" stop-color="#ffffff"/>' +
                    '<stop offset="100%" stop-color="#f4f4f5"/>' +
                  '</linearGradient>' +
                  '<filter id="pwSoft" x="-30%" y="-30%" width="160%" height="160%">' +
                    '<feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#18181b" flood-opacity="0.14"/>' +
                  '</filter>' +
                '</defs>' +
                '<g filter="url(#pwSoft)">' +
                  '<rect class="pw-hint-doc" x="24" y="26" width="76" height="100" rx="11" />' +
                  '<path class="pw-hint-fold-fill" d="M80 26l20 20H86c-3.3 0-6-2.7-6-6V26z" />' +
                  '<path class="pw-hint-fold" d="M80 26v14c0 3.3 2.7 6 6 6h20" />' +
                '</g>' +
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
            '</div>' +
          '</div>' +
          '<form id="pw-form" class="pw-form">' +
            '<input id="pw-input" class="pw-input" type="password" placeholder="Password" aria-label="Password" autocomplete="current-password" autofocus />' +
            '<button id="pw-btn" class="pw-btn" type="submit">Continue →</button>' +
          '</form>' +
          '<p id="pw-err" class="pw-err" hidden aria-live="polite">Incorrect password — try again.</p>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var input = overlay.querySelector('#pw-input');
    var err = overlay.querySelector('#pw-err');

    setTimeout(focusPwInput, 80);
    setTimeout(focusPwInput, 120);

    overlay.querySelector('#pw-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (passwordMatches(input.value)) {
        sessionStorage.setItem(KEY, '1');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(function () {
          overlay.remove();
          document.documentElement.style.overflow = '';
          document.documentElement.classList.remove('portfolio-locked');
        }, 350);
      } else {
        err.hidden = false;
        input.value = '';
        focusPwInput();
      }
    });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
