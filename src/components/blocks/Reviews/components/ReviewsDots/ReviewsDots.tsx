// styles
import styles from "./ReviewsDots.module.scss";
// types
import type {ReviewsDotsProps} from "@components/blocks/Reviews/types/types";

const ReviewsDots = ({count, activeIndex, onDotClick,}: ReviewsDotsProps) => {
    return (
        <div className={styles.dots}>
            {Array.from({length: count}).map((_, index) => (
                <button
                    key={index}
                    type="button"
                    className={`${styles.dots__item} ${
                        activeIndex === index
                            ? styles.dots__item_active
                            : ""
                    }`}
                    onClick={() => onDotClick(index)}
                    aria-label={`Перейти к отзыву ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default ReviewsDots;