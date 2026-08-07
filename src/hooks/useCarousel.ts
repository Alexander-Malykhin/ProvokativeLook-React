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

  const getTargetLeft = useCallback(
    (index: number) => {
      const slider = sliderRef.current;

      if (!slider || itemCount <= 1) {
        return 0;
      }

      if (mode === "progress") {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        return (maxScrollLeft / (itemCount - 1)) * index;
      }

      const firstItem = slider.firstElementChild as HTMLElement | null;

      if (!firstItem) {
        return 0;
      }

      const gap = Number.parseFloat(getComputedStyle(slider).gap) || 0;
      return (firstItem.offsetWidth + gap) * index;
    },
    [itemCount, mode],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const slider = sliderRef.current;

      if (!slider || itemCount === 0) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(index, itemCount - 1));
      slider.scrollTo({
        left: getTargetLeft(nextIndex),
        behavior: "smooth",
      });
      setActiveIndex(nextIndex);
    },
    [getTargetLeft, itemCount],
  );

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const update = () => {
      if (itemCount <= 1) {
        setActiveIndex(0);
        return;
      }

      if (mode === "progress") {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        const index = maxScrollLeft
          ? Math.round((slider.scrollLeft / maxScrollLeft) * (itemCount - 1))
          : 0;
        setActiveIndex(index);
        return;
      }

      const step = getTargetLeft(1);
      setActiveIndex(step ? Math.round(slider.scrollLeft / step) : 0);
    };

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(slider);
    slider.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      resizeObserver.disconnect();
      slider.removeEventListener("scroll", update);
    };
  }, [getTargetLeft, itemCount, mode]);

  useEffect(() => {
    if (activeIndex >= itemCount) {
      setActiveIndex(Math.max(0, itemCount - 1));
    }
  }, [activeIndex, itemCount]);

  return {
    sliderRef,
    activeIndex,
    scrollToIndex,
    showPrevious: () => scrollToIndex(activeIndex - 1),
    showNext: () => scrollToIndex(activeIndex + 1),
  };
};
