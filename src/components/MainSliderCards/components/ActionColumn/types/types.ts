import type {ReactNode} from "react";

export interface ActionColumnInterface {
    title: ReactNode | string;
    scrollSlider: (direction: 'left' | 'right') => void
}