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
