import { useCallback, useEffect, useRef, useState } from 'react';
type CarouselMode = 'item' | 'progress';
interface UseCarouselOptions {
  itemCount: number;
  mode?: CarouselMode;
}
export const useCarousel = ({ itemCount, mode = 'item' }: UseCarouselOptions) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const actualIndex = useRef(0);
  const target = useRef<{ index: number; left: number } | null>(null);
  const metrics = useRef({ step: 0, max: 0, width: 0 });
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelTarget = useCallback(() => {
    target.current = null;
    clearTimeout(settleTimer.current);
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const slider = sliderRef.current;
      if (!slider || itemCount === 0) return;
      const { step, max, width } = metrics.current;
      const lastIndex = mode === 'item' && step > 0 ? Math.ceil(max / step) : itemCount - 1;
      const nextIndex = Math.max(0, Math.min(index, itemCount - 1, lastIndex));
      const left = Math.min(
        max,
        mode === 'progress' ? (max / Math.max(1, itemCount - 1)) * nextIndex : step * nextIndex,
      );
      cancelTarget();

      target.current = { index: nextIndex, left };
      const instant =
        Math.abs(left - slider.scrollLeft) > width * 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      slider.scrollTo({ left, behavior: instant ? 'instant' : 'smooth' });
      if (Math.abs(slider.scrollLeft - left) < 1) {
        actualIndex.current = nextIndex;
        target.current = null;
      }
    },
    [cancelTarget, itemCount, mode],
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { step, max } = metrics.current;
      const position =
        mode === 'progress'
          ? max
            ? (slider.scrollLeft / max) * (itemCount - 1)
            : 0
          : step
            ? slider.scrollLeft / step
            : 0;
      const index = Math.max(0, Math.min(Math.round(position), itemCount - 1));
      actualIndex.current = index;
      setActiveIndex((current) => (current === index ? current : index));
      if (target.current && Math.abs(slider.scrollLeft - target.current.left) < 1) cancelTarget();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScroll = () => {
      schedule();
      clearTimeout(settleTimer.current);

      settleTimer.current = setTimeout(cancelTarget, 180);
    };
    const measure = () => {
      const first = slider.firstElementChild as HTMLElement | null;
      metrics.current = {
        step: (first?.offsetWidth ?? 0) + (Number.parseFloat(getComputedStyle(slider).columnGap) || 0),
        max: Math.max(0, slider.scrollWidth - slider.clientWidth),
        width: slider.clientWidth,
      };
      cancelTarget();
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(slider);
    slider.addEventListener('scroll', onScroll, { passive: true });
    slider.addEventListener('scrollend', cancelTarget);
    slider.addEventListener('pointerdown', cancelTarget, { passive: true });
    slider.addEventListener('wheel', cancelTarget, { passive: true });
    slider.addEventListener('keydown', cancelTarget);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      cancelTarget();
      observer.disconnect();
      slider.removeEventListener('scroll', onScroll);
      slider.removeEventListener('scrollend', cancelTarget);
      slider.removeEventListener('pointerdown', cancelTarget);
      slider.removeEventListener('wheel', cancelTarget);
      slider.removeEventListener('keydown', cancelTarget);
    };
  }, [cancelTarget, itemCount, mode]);

  const showPrevious = useCallback(
    () => scrollToIndex((target.current?.index ?? actualIndex.current) - 1),
    [scrollToIndex],
  );
  const showNext = useCallback(
    () => scrollToIndex((target.current?.index ?? actualIndex.current) + 1),
    [scrollToIndex],
  );
  return { sliderRef, activeIndex, scrollToIndex, showPrevious, showNext };
};
