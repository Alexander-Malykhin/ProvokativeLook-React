import styles from '././NewsDots.module.scss';

interface NewsDotsInterface {
    count: number;
    activeIndex: number;
    onDotClick: (index: number) => void;
}

const NewsDots = ({count, activeIndex, onDotClick}: NewsDotsInterface) => {
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

export default NewsDots;