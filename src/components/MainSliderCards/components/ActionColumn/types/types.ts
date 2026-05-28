import type { SliderDirection } from '@/hooks/useHorizontalSlider';

export interface ActionColumnInterface {
    title: string;
    scrollSlider: (direction: SliderDirection) => void;
    withControls?: boolean;
}