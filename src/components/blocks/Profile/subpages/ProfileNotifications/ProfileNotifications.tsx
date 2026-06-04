//styles
import styles from './ProfileNotifications.module.scss'

interface ProfileNotificationsInterface {
    title: string
}

const ProfileNotifications = ({title}: ProfileNotificationsInterface) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>
                {title}
            </h2>

            <div className={styles.list}>
                <article className={styles.item}>
                    <span className={styles.item__date}>15.02.2025</span>

                    <div className={styles.item__information}>
                        <h4 className={styles.item__information_title}>Начислены бонусы ко дню рождения</h4>
                        <p className={styles.item__information_description}>+ 1000 бонусов до 15.02.2025 г.
                            включительно</p>
                    </div>
                </article>
                <article className={styles.item}>
                    <span className={styles.item__date}>15.02.2025</span>

                    <div className={styles.item__information}>
                        <h4 className={styles.item__information_title}>Начислен кэшбэк</h4>
                        <p className={styles.item__information_description}>+ 100 бонусов</p>
                    </div>
                </article>
                <article className={styles.item}>
                    <span className={styles.item__date}>15.02.2025</span>

                    <div className={styles.item__information}>
                        <h4 className={styles.item__information_title}>Акция на новую коллекцию</h4>
                        <p className={styles.item__information_description}>Скидка 5% при покупке от 80 000 ₽</p>
                    </div>
                </article>
            </div>

            <button className={styles.button}>
                Загрузить еще
            </button>
        </div>
    );
};

export default ProfileNotifications;