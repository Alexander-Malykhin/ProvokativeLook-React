import styles from './BasketCounter.module.scss';

interface BasketCounterProps {
    count: number;
    onDecrease: () => void;
    onIncrease: () => void;
    label?: string;
}

const BasketCounter = ({count, onDecrease, onIncrease, label = 'Количество',}: BasketCounterProps) => {
    return (
        <div className={styles.counter}>
            <span className={styles.counter__label}>{label}</span>

            <div className={styles.counter__controls}>
                <button
                    type="button"
                    className={`${styles.counter__button} ${styles.counter__button_prev}`}
                    onClick={onDecrease}
                />

                <span className={styles.counter__value}>{count}</span>

                <button
                    type="button"
                    className={`${styles.counter__button} ${styles.counter__button_next}`}
                    onClick={onIncrease}
                />
            </div>
        </div>
    );
};

export default BasketCounter;