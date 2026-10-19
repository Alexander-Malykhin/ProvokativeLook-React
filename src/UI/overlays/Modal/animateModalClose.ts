export const animateModalClose = (onClose: () => void, target?: HTMLElement | null) => {
  const overlays = document.querySelectorAll<HTMLElement>('[data-modal-overlay]');
  const overlay = target ?? overlays[overlays.length - 1];
  if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onClose();
    return;
  }
  if (overlay.dataset.closing === 'true') return;
  overlay.dataset.closing = 'true';
  const content = overlay.querySelector<HTMLElement>('[data-modal-content]');
  const mobile = !overlay.hasAttribute('data-modal-fullscreen') && window.matchMedia('(max-width: 767px)').matches;
  const options = { duration: 200, easing: 'ease-in', fill: 'forwards' as const };
  let closed = false;
  const finish = () => {
    if (closed) return;
    closed = true;
    window.clearTimeout(fallback);
    onClose();
  };

  const fallback = window.setTimeout(finish, options.duration + 100);
  try {
    content?.animate(
      [
        { transform: getComputedStyle(content).transform },
        { transform: mobile ? 'translateY(100%)' : 'translateY(16px) scale(.98)' },
      ],
      options,
    );
    const animation = overlay.animate([{ opacity: 1 }, { opacity: 0 }], options);
    void animation.finished.then(finish, finish);
  } catch {
    finish();
  }
};
