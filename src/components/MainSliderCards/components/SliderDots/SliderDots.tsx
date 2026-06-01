import styles from './SliderDots.module.scss';

interface SliderDotsProps {
    dotsCount: number;
    activeIndex: number;
    onDotClick: (index: number) => void;
}

const SliderDots = ({dotsCount, activeIndex, onDotClick,}: SliderDotsProps) => {
    return (
        <div className={styles.dots}>
            {Array.from({ length: dotsCount }).map((_, index) => (
                <button
                    key={index}
                    type="button"
                    className={`${styles.dots__item} ${
                        activeIndex === index ? styles.dots__item_active : ''
                    }`}
                    onClick={() => onDotClick(index)}
                    aria-label={`Перейти к слайду ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default SliderDots;