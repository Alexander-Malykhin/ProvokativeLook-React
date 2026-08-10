import styles from "./NotificationItem.module.scss";
import type { NotificationItemDto } from "@store/api/notifications/types";

interface NotificationItemProps {
  item: NotificationItemDto;
  onClick?: () => void;
}

const formatDate = (value: string | null): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return new Intl.DateTimeFormat("ru-RU").format(date);
};

const NotificationItem = ({ item, onClick }: NotificationItemProps) => (
  <article
    className={`${styles.item} ${!item.isRead ? styles.item_unread : ""}`}
    onClick={onClick}
  >
    <span className={styles.item__date}>{formatDate(item.createdAt)}</span>

    <div className={styles.item__information}>
      <h4 className={styles.item__title}>{item.title}</h4>
      <p className={styles.item__description}>{item.message}</p>
    </div>

    {!item.isRead && <span className={styles.item__dot} aria-label="Непрочитано" />}
  </article>
);

export default NotificationItem;
