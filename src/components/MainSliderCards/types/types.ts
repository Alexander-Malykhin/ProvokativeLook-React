import type { ReactNode, RefObject } from 'react';
import type { SliderDirection } from '@/hooks/useHorizontalSlider';

export interface MainSliderCardsInterface {
    title: string;
    withControls?: boolean;
    withFullContainer?: boolean;
    scrollStep?: number;
    children:
        | ReactNode
        | ((props: {
        sliderRef: RefObject<HTMLDivElement | null>;
        scrollSlider: (direction: SliderDirection) => void;
    }) => ReactNode);
}