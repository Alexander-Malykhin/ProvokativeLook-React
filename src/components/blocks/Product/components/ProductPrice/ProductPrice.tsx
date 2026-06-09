import styles from './ProductPrice.module.scss'

const ProductPrice = () => {
    return (
        <div className={styles.price}>
            <span className={styles.price__main}>
                11 200 ₽
            </span>
            <span className={`${styles.price__main} ${styles.price__discount}`}>
                15 000 ₽
            </span>
        </div>
    );
};

export default ProductPrice;