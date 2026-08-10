import { useCallback, useEffect, useRef, useState } from "react";

type CarouselMode = "item" | "progress";

interface UseCarouselOptions {
  itemCount: number;
  mode?: CarouselMode;
}

export const useCarousel = ({
  itemCount,
  mode = "item",
}: UseCarouselOptions) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const setIndexIfChanged = useCallback((nextIndex: number) => {
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }, []);

  const getTargetLeft = useCallback(
    (index: number) => {
      const slider = sliderRef.current;

      if (!slider || itemCount <= 1) return 0;

      if (mode === "progress") {
        const maxScrollLeft = Math.max(0, slider.scrollWidth - slider.clientWidth);
        return (maxScrollLeft / (itemCount - 1)) * index;
      }

      const firstItem = slider.firstElementChild as HTMLElement | null;
      if (!firstItem) return 0;

      const gap = Number.parseFloat(getComputedStyle(slider).gap) || 0;
      return (firstItem.offsetWidth + gap) * index;
    },
    [itemCount, mode],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const slider = sliderRef.current;
      if (!slider || itemCount === 0) return;

      const nextIndex = Math.max(0, Math.min(index, itemCount - 1));
      slider.scrollTo({
        left: getTargetLeft(nextIndex),
        behavior: "smooth",
      });
      setIndexIfChanged(nextIndex);
    },
    [getTargetLeft, itemCount, setIndexIfChanged],
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (itemCount <= 1) {
          setIndexIfChanged(0);
          return;
        }

        if (mode === "progress") {
          const maxScrollLeft = Math.max(0, slider.scrollWidth - slider.clientWidth);
          const index = maxScrollLeft
            ? Math.round((slider.scrollLeft / maxScrollLeft) * (itemCount - 1))
            : 0;
          setIndexIfChanged(Math.max(0, Math.min(index, itemCount - 1)));
          return;
        }

        const step = getTargetLeft(1);
        const index = step ? Math.round(slider.scrollLeft / step) : 0;
        setIndexIfChanged(Math.max(0, Math.min(index, itemCount - 1)));
      });
    };

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(slider);
    slider.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      slider.removeEventListener("scroll", update);
    };
  }, [getTargetLeft, itemCount, mode, setIndexIfChanged]);

  useEffect(() => {
    if (activeIndex >= itemCount) {
      setIndexIfChanged(Math.max(0, itemCount - 1));
    }
  }, [activeIndex, itemCount, setIndexIfChanged]);

  const showPrevious = useCallback(
    () => scrollToIndex(activeIndex - 1),
    [activeIndex, scrollToIndex],
  );

  const showNext = useCallback(
    () => scrollToIndex(activeIndex + 1),
    [activeIndex, scrollToIndex],
  );

  return {
    sliderRef,
    activeIndex,
    scrollToIndex,
    showPrevious,
    showNext,
  };
};
