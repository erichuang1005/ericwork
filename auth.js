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
      '<div class="pw-backdrop" aria-hidden="true">' +
        '<div class="pw-backdrop-bloom pw-backdrop-bloom--a"></div>' +
        '<div class="pw-backdrop-bloom pw-backdrop-bloom--b"></div>' +
        '<div class="pw-backdrop-bloom pw-backdrop-bloom--c"></div>' +
      '</div>' +
      '<div class="pw-panel">' +
        '<div class="pw-panel-inner">' +
          '<header class="pw-hero">' +
            '<h1 id="pw-title" class="pw-name">Eric Huang</h1>' +
            '<p class="pw-subtitle">Portfolio · Password protected</p>' +
          '</header>' +
          '<form id="pw-form" class="pw-form">' +
            '<input id="pw-input" class="pw-input" type="password" placeholder="Password" aria-label="Password" autocomplete="current-password" autofocus />' +
            '<button id="pw-btn" class="pw-btn" type="submit">Continue →</button>' +
          '</form>' +
        '</div>' +
        '<p id="pw-err" class="pw-err" hidden aria-live="polite">Incorrect password — try again.</p>' +
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
