import styles from '../NotOrder/NotOrder.module.scss';

const NotOrder = () => {
    return (
        <div className={styles.notOrder}>
            <p className={styles.notOrder__text}>Заказов пока нет.</p>

            <button className={styles.notOrder__button}>
                Перейти в каталог
            </button>
        </div>
    );
};

export default NotOrder;