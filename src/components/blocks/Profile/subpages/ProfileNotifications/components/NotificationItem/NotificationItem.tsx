import styles from "./NotificationItem.module.scss";
import type { ProfileNotification } from "../../data";

interface NotificationItemProps {
  item: ProfileNotification;
}

const NotificationItem = ({ item }: NotificationItemProps) => (
  <article className={styles.item}>
    <span className={styles.item__date}>{item.date}</span>

    <div className={styles.item__information}>
      <h4 className={styles.item__title}>{item.title}</h4>
      <p className={styles.item__description}>{item.description}</p>
    </div>
  </article>
);

export default NotificationItem;
