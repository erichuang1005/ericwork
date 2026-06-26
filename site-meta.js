/* Injects "Month YYYY" into [data-site-updated] from this page's last-modified date. */
(function () {
  function monthYearLabel() {
    var d = new Date(document.lastModified);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  function apply() {
    var label = monthYearLabel();
    if (!label) return;
    document.querySelectorAll('[data-site-updated]').forEach(function (el) {
      el.textContent = label;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();

/* Sticky case-study subnav — highlight current section on scroll */
(function () {
  var subnavScrollHandler = null;

  function initSubnav() {
    var links = document.querySelectorAll(
      '.cs-subnav a, .article-tab-list .tab, .tabbed-navigation-inner--tabs .tab'
    );
    if (!links.length) return;
    var sections = Array.prototype.map.call(links, function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);
    if (!sections.length) return;

    if (subnavScrollHandler) {
      window.removeEventListener('scroll', subnavScrollHandler);
    }

    var ticking = false;
    function update() {
      var offset = 140;
      var current = sections[0];
      sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= offset) current = sec;
      });
      links.forEach(function (a) {
        var isActive = a.getAttribute('href') === '#' + current.id;
        a.classList.toggle('active', isActive);
        a.setAttribute('aria-selected', isActive ? 'true' : 'false');
        a.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      ticking = false;
    }

    subnavScrollHandler = function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', subnavScrollHandler, { passive: true });
    update();
  }

  window.refreshArticleTabScrollSpy = initSubnav;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubnav);
  } else {
    initSubnav();
  }
})();
