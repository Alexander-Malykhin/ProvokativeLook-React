// styles
import styles from "./NewsDots.module.scss";
// types
import type {NewsDotsProps} from "@components/blocks/News/components/types/types.ts";

const NewsDots = ({count, activeIndex, onDotClick,}: NewsDotsProps) => {
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
                    aria-label={`Перейти к слайду ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default NewsDots;