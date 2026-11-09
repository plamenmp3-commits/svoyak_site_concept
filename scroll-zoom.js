(() => {
  const motion = matchMedia('(max-width: 600px) and (prefers-reduced-motion: no-preference)');
  const selector = '.trip-image-button > img';
  const observer = new MutationObserver(schedule);
  let frame = 0;
  let observedRoot;

  function draw() {
    frame = 0;
    const trips = document.getElementById('trips');
    const root = trips || document.body;
    if (root !== observedRoot) {
      observer.disconnect();
      observer.observe(root, { childList: true, subtree: true });
      observedRoot = root;
    }
    if (!trips) return;

    const viewport = window.innerHeight;
    const start = viewport * 0.92;
    const end = viewport * 0.22;
    const photos = Array.from(trips.querySelectorAll(selector), image => {
      const top = image.parentElement.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
      return { image, scale: 1 + 0.15 * progress };
    });
    for (const { image, scale } of photos) {
      image.style.transition = 'none';
      image.style.transform = `scale(${scale.toFixed(4)})`;
    }
  }

  function schedule() {
    if (motion.matches && !frame) frame = requestAnimationFrame(draw);
  }

  function syncMotion() {
    if (motion.matches) {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      schedule();
    } else {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
      observedRoot = undefined;
      cancelAnimationFrame(frame);
      frame = 0;
      document.querySelectorAll(`#trips ${selector}`).forEach(image => {
        image.style.removeProperty('transition');
        image.style.removeProperty('transform');
      });
    }
  }

  motion.addEventListener('change', syncMotion);
  syncMotion();
})();

