import styles from './ProductColors.module.scss'

const ProductColors = () => {
    return (
        <div className={styles.colors}>
            <h2 className={styles.colors__title}>
                цвет
            </h2>

            <div className={styles.colors__list}>
                <article className={`${styles.colors__item} ${styles.colors__item_black}`}></article>
                <article className={`${styles.colors__item} ${styles.colors__item_white}`}></article>
            </div>
        </div>
    );
};

export default ProductColors;