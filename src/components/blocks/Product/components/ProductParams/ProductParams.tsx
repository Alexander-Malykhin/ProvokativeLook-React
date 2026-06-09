import styles from './ProductParams.module.scss'

const ProductParams = () => {
    return (
        <div className={styles.params}>
            <article className={styles.params__item}>
                    <span className={styles.params__item_label}>
                        Параметры модели:
                    </span>
                    <span className={styles.params__item_description}>
                        88-78-96, рост 174
                    </span>
            </article>
            <article className={styles.params__item}>
                    <span className={styles.params__item_label}>
                        Размер на модели:
                    </span>
                    <span className={styles.params__item_description}>
                        46
                    </span>
            </article>
        </div>
    );
};

export default ProductParams;