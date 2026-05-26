import { useRef } from 'react';

export type SliderDirection = 'left' | 'right';

export const useHorizontalSlider = (scrollStep = 240) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollSlider = (direction: SliderDirection) => {
        sliderRef.current?.scrollBy({
            left: direction === 'right' ? scrollStep : -scrollStep,
            behavior: 'smooth',
        });
    };

    return {
        sliderRef,
        scrollSlider,
    };
};