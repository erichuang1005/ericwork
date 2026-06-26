/* Google tag (gtag.js) — GA4 Measurement ID for this site */
(function () {
  var GA_MEASUREMENT_ID = 'G-CHJ49HRXE9';

  if (!GA_MEASUREMENT_ID) {
    return;
  }

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();
