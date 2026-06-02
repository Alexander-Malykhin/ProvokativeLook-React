//styles
import styles from './FavoritesHeader.module.scss'

const FavoritesHeader = () => {
    return (
        <div className={styles.header}>
            <span className={styles.header__count}>
                4 товара
            </span>

            <button className={styles.header__button}>
                Очистить избранное
            </button>
        </div>
    );
};

export default FavoritesHeader;