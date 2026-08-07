import styles from './NotNotification.module.scss'

const NotNotification = () => {
    return (
        <div className={styles.notNotification}>
            <p className={styles.notNotification__text}>Нет уведомлений</p>
        </div>
    );
};

export default NotNotification;