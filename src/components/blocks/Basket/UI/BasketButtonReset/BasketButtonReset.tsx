import styles from './BasketButtonReset.module.scss';

interface BasketButtonResetProps {
    onClick: () => void;
}

const BasketButtonReset = ({ onClick }: BasketButtonResetProps) => {
    return (
        <button
            type="button"
            className={styles.button}
            onClick={onClick}
        >
            Очистить корзину
        </button>
    );
};

export default BasketButtonReset;