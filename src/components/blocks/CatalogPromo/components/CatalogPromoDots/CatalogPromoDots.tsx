// styles
import styles from "./CatalogPromoDots.module.scss";
// types
import type {CatalogPromoDotsProps,} from "@components/blocks/CatalogPromo/types/types";

const CatalogPromoDots = ({count, activeIndex, onDotClick,}: CatalogPromoDotsProps) => {
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

export default CatalogPromoDots;