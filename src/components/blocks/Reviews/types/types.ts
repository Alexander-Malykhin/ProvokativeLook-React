import type { RefObject } from 'react';
export interface ReviewItem {
  photos?: string[];
  id: number;
  name: string;
  date: string;
  text: string;
}
export interface ReviewsItemProps {
  photos?: string[];
  name: string;
  date: string;
  text: string;
}
export interface ReviewsSliderProps {
  sliderRef: RefObject<HTMLDivElement | null>;
  reviews: ReviewItem[];
}
export interface ReviewsColumnProps {
  onPrev: () => void;
  onNext: () => void;
}
export interface ReviewsDotsProps {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}
