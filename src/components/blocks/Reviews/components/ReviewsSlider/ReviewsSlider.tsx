// styles
import styles from "./ReviewsSlider.module.scss";
// components
import ReviewsItem from "@components/blocks/Reviews/components/ReviewsItem/ReviewsItem";
// types
import type { ReviewsSliderProps } from "@components/blocks/Reviews/types/types";

const ReviewsSlider = ({ sliderRef, reviews }: ReviewsSliderProps) => {
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
