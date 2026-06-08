//styles
import styles from './ReviewsSlider.module.scss';
//components
import ReviewsItem from "@components/blocks/Reviews/components/ReviewsItem/ReviewsItem.tsx";
//types
import type {ReviewsSliderInterface} from "@components/blocks/Reviews/components/ReviewsSlider/types.ts";


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