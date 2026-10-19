import { useEffect, type RefObject } from 'react';

export const useDragScroll = (ref: RefObject<HTMLDivElement | null>, itemCount: number, snapToItem = false) => {
  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;
    let pointerId: number | null = null;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let suppressClick = false;
    const originalSnap = slider.style.scrollSnapType;
    const originalBehavior = slider.style.scrollBehavior;
    const finish = () => {
      if (pointerId !== null && slider.hasPointerCapture(pointerId)) {
        slider.releasePointerCapture(pointerId);
      }
      pointerId = null;
      dragging = false;
      delete slider.dataset.dragging;
      slider.style.scrollSnapType = originalSnap;
      slider.style.scrollBehavior = originalBehavior;
    };
    const onDown = (event: PointerEvent) => {
      suppressClick = false;
      if (event.pointerType !== 'mouse' || event.button !== 0 || !event.isPrimary) return;
      if (slider.scrollWidth <= slider.clientWidth) return;
      if ((event.target as Element).closest("button, input, textarea, select, [contenteditable='true']")) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startLeft = slider.scrollLeft;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      if (!(event.buttons & 1)) {
        finish();
        return;
      }
      const delta = event.clientX - startX;
      if (!dragging && Math.abs(delta) < 6) return;
      if (!dragging) {
        dragging = true;
        suppressClick = true;
        slider.setPointerCapture(event.pointerId);
        slider.dataset.dragging = 'true';
        slider.style.scrollSnapType = 'none';
        slider.style.scrollBehavior = 'auto';
      }
      event.preventDefault();
      slider.scrollLeft = startLeft - delta;
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const distance = slider.scrollLeft - startLeft;
      let destination: number | null = null;
      if (snapToItem && dragging && event.type === 'pointerup' && Math.abs(distance) >= 30) {
        const first = slider.firstElementChild as HTMLElement | null;
        const step = (first?.offsetWidth ?? 0) + (Number.parseFloat(getComputedStyle(slider).columnGap) || 0);
        if (step > 0) {
          destination =
            (distance > 0 ? Math.ceil(slider.scrollLeft / step) : Math.floor(slider.scrollLeft / step)) * step;
        }
      }
      finish();
      if (destination !== null) slider.scrollTo({ left: destination, behavior: 'smooth' });
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick || event.detail === 0) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    };
    const onDragStart = (event: DragEvent) => event.preventDefault();
    slider.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('blur', finish);
    slider.addEventListener('lostpointercapture', finish);
    slider.addEventListener('click', onClick, true);
    slider.addEventListener('dragstart', onDragStart);
    return () => {
      slider.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', finish);
      slider.removeEventListener('lostpointercapture', finish);
      slider.removeEventListener('click', onClick, true);
      slider.removeEventListener('dragstart', onDragStart);
      finish();
    };
  }, [ref, itemCount, snapToItem]);
};
