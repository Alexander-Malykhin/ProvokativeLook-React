import styles from "./BasketButtonReset.module.scss";
interface BasketButtonResetProps {
    onClick: () => void;
    disabled?: boolean;
}
const BasketButtonReset = ({ onClick, disabled }: BasketButtonResetProps) => {
    return (<button type="button" className={styles.button} onClick={onClick} disabled={disabled}>
      Очистить корзину
    </button>);
};
export default BasketButtonReset;

