import { useDragScroll } from '@hooks/useDragScroll';
import styles from './ReviewsSlider.module.scss';
import ReviewsItem from '@components/blocks/Reviews/components/ReviewsItem/ReviewsItem';
import type { ReviewsSliderProps } from '@components/blocks/Reviews/types/types';
const ReviewsSlider = ({ sliderRef, reviews }: ReviewsSliderProps) => {
  useDragScroll(sliderRef, reviews.length);
  return (
    <div ref={sliderRef} className={styles.list}>
      {reviews.map((review) => (
        <ReviewsItem key={review.id} name={review.name} date={review.date} text={review.text} photos={review.photos} />
      ))}
    </div>
  );
};
export default ReviewsSlider;
