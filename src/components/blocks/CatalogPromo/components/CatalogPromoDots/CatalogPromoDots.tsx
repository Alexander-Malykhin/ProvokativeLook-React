//styles
import styles from './CatalogPromoDots.module.scss';

type CatalogPromoDotsProps = {
    count: number;
    activeIndex: number;
    onDotClick: (index: number) => void;
};

const CatalogPromoDots = ({ count, activeIndex, onDotClick }: CatalogPromoDotsProps) => {
    return (
        <div className={styles.dots}>
            {Array.from({ length: count }).map((_, index) => (
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

export default CatalogPromoDots;