//styles
import styles from './ReviewsDots.module.scss'
//types
import type {ReviewsDotsInterface} from "@components/blocks/Reviews/components/ReviewsDots/types.ts";


const ReviewsDots = ({count, activeIndex, onDotClick}: ReviewsDotsInterface) => {
    return (
        <div className={styles.dots}>
            {Array.from({length: count}).map((_, index) => (
                <button
                    key={index}
                    type="button"
                    className={`${styles.dots__item} ${
                        activeIndex === index ? styles.dots__item_active : ''
                    }`}
                    onClick={() => onDotClick(index)}
                />
            ))}
        </div>
    );
};

export default ReviewsDots;