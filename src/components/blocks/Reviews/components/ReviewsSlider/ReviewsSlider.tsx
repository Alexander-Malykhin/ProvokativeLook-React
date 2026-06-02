import type { RefObject } from 'react';
//styles
import styles from './ReviewsSlider.module.scss';
//components
import ReviewsItem from "@components/blocks/Reviews/components/ReviewsItem/ReviewsItem.tsx";

interface Review {
    id: number;
    name: string;
    date: string;
    text: string;
}

interface ReviewsSliderInterface {
    sliderRef: RefObject<HTMLDivElement | null>;
    reviews: Review[];
}

const ReviewsSlider = ({ sliderRef, reviews }: ReviewsSliderInterface) => {
    return (
        <div ref={sliderRef} className={styles.list}>
            {reviews.map((review) => (
                <ReviewsItem
                    key={review.id}
                    name={review.name}
                    date={review.date}
                    text={review.text}
                />
            ))}
        </div>
    );
};

export default ReviewsSlider;