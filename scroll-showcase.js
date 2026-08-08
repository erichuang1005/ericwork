(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showcases = document.querySelectorAll('[data-scroll-showcase]');
  if (!showcases.length) return;

  const state = [];
  showcases.forEach((showcase) => {
    const viewport = showcase.querySelector('.cs-scroll-showcase__viewport');
    const track = showcase.querySelector('.cs-scroll-showcase__track');
    const direction = showcase.getAttribute('data-scroll-showcase-direction') === 'ltr' ? 'ltr' : 'rtl';
    if (viewport && track) state.push({ showcase, viewport, track, direction });
  });
  if (!state.length) return;

  let ticking = false;
  function update() {
    const vh = window.innerHeight;
    state.forEach(({ showcase, viewport, track, direction }) => {
      const rect = showcase.getBoundingClientRect();
      const scrollRange = rect.height + vh;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / scrollRange));
      const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const travel = direction === 'ltr' ? (1 - progress) * maxOffset : progress * maxOffset;
      if (!reduceMotion) {
        track.style.transform = 'translate3d(' + (-travel) + 'px, 0, 0)';
      }
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  showcases.forEach((showcase) => {
    showcase.querySelectorAll('img').forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', onScroll, { once: true });
    });
  });
  update();
})();
