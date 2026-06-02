import styles from './BestsellersDots.module.scss';

interface BestsellersDotsInterface {
    count: number;
    activeIndex: number;
    onDotClick: (index: number) => void;
}

const BestsellersDots = ({ count, activeIndex, onDotClick }: BestsellersDotsInterface) => {
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

export default BestsellersDots;