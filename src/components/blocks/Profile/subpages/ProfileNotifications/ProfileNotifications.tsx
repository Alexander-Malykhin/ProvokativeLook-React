import { useState } from "react";

// styles
import styles from "./ProfileNotifications.module.scss";

// types
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";

// api
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@store/api/notifications/notificationsApi";

// components
import NotNotification from "./components/NotNotification/NotNotification";
import NotificationItem from "./components/NotificationItem/NotificationItem";

const ProfileNotifications = ({ title }: ProfilePageProps) => {
  const [limit, setLimit] = useState(10);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetNotificationsQuery({ limit, offset: 0 });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data.items ?? [];
  const pagination = data?.data.pagination;
  const unreadCount = data?.data.unreadCount ?? 0;

  const handleNotificationClick = (id: number, isRead: boolean) => {
    if (!isRead) {
      void markAsRead(id);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.content__header}>
        <h2 className={styles.content__title}>{title}</h2>

        {unreadCount > 0 && (
          <button
            type="button"
            className={styles.content__readAll}
            onClick={() => void markAllAsRead()}
            disabled={isMarkingAll}
          >
            Прочитать все
          </button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.content__skeleton} aria-label="Загрузка уведомлений">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.content__skeletonItem} />
          ))}
        </div>
      ) : isError ? (
        <div className={styles.content__error}>
          <span>Не удалось загрузить уведомления.</span>
          <button type="button" onClick={() => void refetch()}>
            Повторить
          </button>
        </div>
      ) : notifications.length > 0 ? (
        <>
          <div className={styles.content__list}>
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onClick={() => handleNotificationClick(item.id, item.isRead)}
              />
            ))}
          </div>

          {pagination?.hasMore && (
            <button
              type="button"
              className={styles.button}
              disabled={isFetching}
              onClick={() => setLimit((current) => current + 10)}
            >
              {isFetching ? "Загрузка..." : "Загрузить ещё"}
            </button>
          )}
        </>
      ) : (
        <NotNotification />
      )}
    </div>
  );
};

export default ProfileNotifications;
