import type {RefObject} from "react";

interface Review {
    id: number;
    name: string;
    date: string;
    text: string;
}

export interface ReviewsSliderInterface {
    sliderRef: RefObject<HTMLDivElement | null>;
    reviews: Review[];
}