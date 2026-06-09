import styles from './ProductHeader.module.scss'

const ProductHeader = () => {
    return (
        <div className={styles.header}>
            <h1 className={styles.header__title}>
                Кардиган
            </h1>

            <span className={styles.header__articul}>
                Арт. 00000000
            </span>
        </div>
    );
};

export default ProductHeader;