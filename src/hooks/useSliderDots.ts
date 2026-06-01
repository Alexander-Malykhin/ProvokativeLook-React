import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

export const useSliderDots = (
    sliderRef: RefObject<HTMLDivElement | null>
) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dotsCount, setDotsCount] = useState(0);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const updateDots = () => {
            const step = slider.clientWidth;
            if (!step) return;

            const count = Math.ceil(slider.scrollWidth / step);
            const index = Math.round(slider.scrollLeft / step);

            setDotsCount(count);
            setActiveIndex(Math.min(index, count - 1));
        };

        updateDots();

        slider.addEventListener('scroll', updateDots);
        window.addEventListener('resize', updateDots);

        return () => {
            slider.removeEventListener('scroll', updateDots);
            window.removeEventListener('resize', updateDots);
        };
    }, [sliderRef]);

    const scrollToSlide = (index: number) => {
        const slider = sliderRef.current;
        if (!slider) return;

        slider.scrollTo({
            left: slider.clientWidth * index,
            behavior: 'smooth',
        });
    };

    return {
        activeIndex,
        dotsCount,
        scrollToSlide,
    };
};