const smallScreen = matchMedia('(max-width: 700px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;

document.addEventListener('pointerdown', () => { root.dataset.dialogInput = 'pointer'; }, true);
document.addEventListener('keydown', event => {
  if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') root.dataset.dialogInput = 'keyboard';
}, true);

function enhance(dialog) {
  const header = dialog.querySelector('.dialog-top');
  let frame = 0, height = 1, y = 0, finger = null, leaving = false;
  function paint(value) {
    y = value;
    dialog.style.transform = 'translateY(' + value + 'px)';
    const progress = Math.min(1, Math.max(0, value) / (smallScreen.matches ? height : 24));
    dialog.style.setProperty('--sheet-dim', String(.64 * (1 - progress)));
    if (!smallScreen.matches) dialog.style.opacity = String(1 - progress);
  }
  function slide(to, duration, done, speed = 0) {
    cancelAnimationFrame(frame);
    const start = performance.now(), from = y;
    if (reducedMotion.matches || Math.abs(to - from) < .5) {
      paint(to);
      done?.();
      return;
    }
    // Cubic Hermite interpolation preserves the release velocity and lands at rest.
    const slope = Math.max(0, Math.min(3, speed * duration / (to - from))) || 2.5;
    function tick(time) {
      const t = Math.min(1, (time - start) / duration), u = 1-t;
      paint(from + (to-from) * (1 - u*u*(1+2*t) + slope*t*u*u));
      if (t < 1) frame = requestAnimationFrame(tick);
      else done?.();
    }
    frame = requestAnimationFrame(tick);
  }
  function close(speed = 0) {
    if (leaving || !dialog.open) return;
    leaving = true;
    const distance = smallScreen.matches ? dialog.offsetHeight : 24;
    const duration = Math.max(140, Math.min(300, (distance-y) / Math.max(1.6, speed)));
    slide(distance, duration, () => dialog.close(), speed);
  }
  dialog.addEventListener('click', event => {
    if (event.target !== dialog && !event.target.closest('.dialog-top .icon-button,.form-success .button')) return;
    event.stopPropagation();
    close();
  }, true);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  new MutationObserver(() => {
    cancelAnimationFrame(frame);
    finger = null;
    leaving = false;
    if (!dialog.open) {
      dialog.style.removeProperty('opacity');
      dialog.style.removeProperty('transform');
      dialog.style.removeProperty('--sheet-dim');
      return;
    }
    height = dialog.offsetHeight;
    dialog.scrollTop = 0;
    paint(reducedMotion.matches ? 0 : smallScreen.matches ? 44 : 14);
    slide(0, 260);
  }).observe(dialog, {attributes:true, attributeFilter:['open']});

  header.addEventListener('pointerdown', event => {
    if (!smallScreen.matches || leaving || !event.isPrimary || event.button !== 0 || event.target.closest('button,a,input')) return;
    cancelAnimationFrame(frame);
    finger = {id:event.pointerId, start:event.clientY, offset:y, last:event.clientY, time:event.timeStamp, speed:0};
    header.setPointerCapture(event.pointerId);
  });
  header.addEventListener('pointermove', event => {
    if (finger?.id !== event.pointerId) return;
    const delta = event.clientY - finger.start + finger.offset;
    paint(delta >= 0 ? delta : Math.max(-12, delta * .12));
    const dt = event.timeStamp - finger.time;
    if (dt > 0) {
      const speed = (event.clientY - finger.last) / dt;
      finger.speed = dt > 90 ? speed : (speed * .75 + finger.speed * .25);
      finger.last = event.clientY;
      finger.time = event.timeStamp;
    }
  });
  function release(event) {
    if (finger?.id !== event.pointerId) return;
    const speed = event.timeStamp - finger.time < 100 ? finger.speed : 0;
    finger = null;
    if (event.type === 'pointerup' && (y > Math.min(160, dialog.offsetHeight * .24) || (y > 12 && speed > .65))) close(speed);
    else slide(0, 230);
  }
  for (const type of ['pointerup','pointercancel','lostpointercapture']) header.addEventListener(type,release);
}

function attach() {
  const dialogs = document.querySelectorAll('.trip-dialog,.menu-dialog,.form-dialog');
  if (dialogs.length !== 3) return false;
  dialogs.forEach(enhance);
  return true;
}
if (!attach()) {
  const observer = new MutationObserver(() => { if (attach()) observer.disconnect(); });
  observer.observe(document.getElementById('root'), {childList:true,subtree:true});
}
