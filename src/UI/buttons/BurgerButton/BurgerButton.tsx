//styles
import styles from './BurgerButton.module.scss'

const BurgerButton = () => {
    return (
        <button className={styles.burger}>
            <span className={styles.burger__line}></span>
            <span className={styles.burger__line}></span>
            <span className={styles.burger__line}></span>
        </button>
    );
};

export default BurgerButton;