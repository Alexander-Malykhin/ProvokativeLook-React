import type { ChangeEvent, MouseEvent } from "react";

import styles from "./NotificationItem.module.scss";
import type { NotificationItemDto } from "@store/api/notifications/types";

interface NotificationItemProps {
  item: NotificationItemDto;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  onClick?: () => void;
}

const formatDate = (value: string | null): string => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  return new Intl.DateTimeFormat("ru-RU").format(date);
};

const NotificationItem = ({ item, selected = false, onSelect, onClick }: NotificationItemProps) => {
  const stop = (event: MouseEvent | ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <article
      className={`${styles.item} ${!item.isRead ? styles.item_unread : ""}`}
      onClick={onClick}
    >
      <label className={styles.item__select} onClick={stop}>
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => {
            stop(event);
            onSelect?.(event.target.checked);
          }}
          aria-label={`Выбрать уведомление: ${item.title}`}
        />
        <span aria-hidden="true" />
      </label>

      <span className={styles.item__date}>{formatDate(item.createdAt)}</span>

      <div className={styles.item__information}>
        <h4 className={styles.item__title}>{item.title}</h4>
        <p className={styles.item__description}>{item.message}</p>
      </div>

      {!item.isRead && <span className={styles.item__dot} aria-label="Непрочитано" />}
    </article>
  );
};

export default NotificationItem;
