import type { ReactNode, RefObject } from 'react';

interface SliderChildrenProps {
    sliderRef: RefObject<HTMLDivElement | null>;
    scrollSlider: (direction: 'left' | 'right') => void;
}

export interface MainSliderCardsInterface {
    title: string;
    children: ReactNode | ((props: SliderChildrenProps) => ReactNode);
    withControls?: boolean;
    withFullContainer?: boolean;
    scrollStep?: number;
    mode?: 'slider' | 'grid';
    showMoreButton?: boolean;
    moreButtonText?: string;
}