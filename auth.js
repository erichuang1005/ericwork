/* Portfolio password protection — password: corgi */
(function () {
  var PASSWORD = 'corgi';
  var KEY = 'portfolio_auth';

  if (sessionStorage.getItem(KEY) === '1') return;

  var css = [
    '#pw-overlay{position:fixed;inset:0;background:#18181B;z-index:99999;display:flex;',
    'align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Inter",sans-serif;}',
    '#pw-card{text-align:center;width:100%;max-width:340px;padding:0 28px;}',
    '#pw-logo{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:32px;',
    'font-weight:300;color:#fff;margin-bottom:6px;letter-spacing:-.02em;}',
    '#pw-eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;',
    'color:rgba(255,255,255,.3);margin-bottom:40px;}',
    '#pw-form{display:flex;flex-direction:column;gap:10px;}',
    '#pw-input{width:100%;padding:14px 18px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.13);',
    'border-radius:10px;color:#fff;font-size:16px;outline:none;font-family:inherit;',
    'transition:border-color .2s;text-align:center;letter-spacing:.06em;}',
    '#pw-input::placeholder{color:rgba(255,255,255,.25);letter-spacing:0;}',
    '#pw-input:focus{border-color:rgba(255,255,255,.32);background:rgba(255,255,255,.09);}',
    '#pw-btn{width:100%;padding:14px 18px;background:#1A56DB;border:none;border-radius:10px;',
    'color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;',
    'transition:opacity .2s,transform .15s;}',
    '#pw-btn:hover{opacity:.85;transform:translateY(-1px);}',
    '#pw-err{color:#F87171;font-size:13px;margin-top:14px;display:none;}'
  ].join('');

  var s = document.createElement('style');
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
  document.documentElement.style.overflow = 'hidden';

  function mount() {
    var el = document.createElement('div');
    el.id = 'pw-overlay';
    el.innerHTML =
      '<div id="pw-card">' +
        '<div id="pw-logo">Eric Huang</div>' +
        '<div id="pw-eyebrow">Portfolio · Password Protected</div>' +
        '<form id="pw-form">' +
          '<input id="pw-input" type="password" placeholder="Enter password" autocomplete="current-password"/>' +
          '<button id="pw-btn" type="submit">Continue →</button>' +
        '</form>' +
        '<p id="pw-err">Incorrect password — try again.</p>' +
      '</div>';
    document.body.appendChild(el);
    setTimeout(function () { el.querySelector('#pw-input').focus(); }, 80);

    el.querySelector('#pw-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (el.querySelector('#pw-input').value === PASSWORD) {
        sessionStorage.setItem(KEY, '1');
        el.style.opacity = '0';
        el.style.transition = 'opacity .35s ease';
        setTimeout(function () {
          el.remove();
          document.documentElement.style.overflow = '';
        }, 350);
      } else {
        el.querySelector('#pw-err').style.display = 'block';
        el.querySelector('#pw-input').value = '';
        el.querySelector('#pw-input').focus();
      }
    });
  }

  if (document.body) { mount(); }
  else { document.addEventListener('DOMContentLoaded', mount); }
})();
