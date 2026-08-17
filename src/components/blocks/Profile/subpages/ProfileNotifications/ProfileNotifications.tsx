import { useEffect, useMemo, useState } from "react";

import styles from "./ProfileNotifications.module.scss";
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";
import {
  useDeleteAllNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@store/api/notifications/notificationsApi";
import NotNotification from "./components/NotNotification/NotNotification";
import NotificationItem from "./components/NotificationItem/NotificationItem";
import {
  rememberBrowserNotificationBaseline,
  requestBrowserNotificationPermission,
  type BrowserNotificationPermissionResult,
} from "@hooks/realtime/useRealtimeUpdates";

const ProfileNotifications = ({ title }: ProfilePageProps) => {
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pushPermission, setPushPermission] =
    useState<BrowserNotificationPermissionResult>("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushPermission("unsupported");
      return;
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!window.isSecureContext && !isLocalhost) {
      setPushPermission("insecure");
      return;
    }

    setPushPermission(Notification.permission);
  }, []);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetNotificationsQuery({ limit, offset: 0 });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications, { isLoading: isDeletingAll }] = useDeleteAllNotificationsMutation();

  const notifications = data?.data.items ?? [];
  const pagination = data?.data.pagination;
  const unreadCount = data?.data.unreadCount ?? 0;
  const latestNotificationId = notifications.reduce((max, item) => Math.max(max, item.id), 0);

  const visibleIds = useMemo(() => notifications.map((item) => item.id), [notifications]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => visibleIds.includes(id)));
  }, [visibleIds]);

  const enablePush = async () => {
    const result = await requestBrowserNotificationPermission();
    setPushPermission(result);

    // После первого включения не показываем все старые уведомления как новые.
    if (result === "granted" && latestNotificationId > 0) {
      rememberBrowserNotificationBaseline(latestNotificationId);
    }
  };

  const handleNotificationClick = (id: number, isRead: boolean) => {
    if (!isRead) void markAsRead(id);
  };

  const toggleSelected = (id: number, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id),
    );
  };

  const toggleAllVisible = () => {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id));
      return Array.from(new Set([...current, ...visibleIds]));
    });
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Удалить выбранные уведомления (${selectedIds.length})?`)) return;

    await Promise.all(selectedIds.map((id) => deleteNotification(id).unwrap()));
    setSelectedIds([]);
  };

  const deleteAll = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm("Удалить все уведомления? Это действие нельзя отменить.")) return;

    await deleteAllNotifications().unwrap();
    setSelectedIds([]);
  };

  return (
    <div className={styles.content}>
      <div className={styles.content__header}>
        <h2 className={styles.content__title}>{title}</h2>

        <div className={styles.content__actions}>
          {pushPermission === "default" && (
            <button type="button" className={styles.content__push} onClick={() => void enablePush()}>
              Включить уведомления
            </button>
          )}

          {pushPermission === "granted" && (
            <span className={styles.content__pushEnabled}>Уведомления включены</span>
          )}

          {pushPermission === "denied" && (
            <span className={styles.content__pushEnabled}>
              Уведомления запрещены в настройках браузера
            </span>
          )}

          {pushPermission === "insecure" && (
            <span className={styles.content__pushEnabled}>
              Для уведомлений откройте сайт по HTTPS
            </span>
          )}

          {pushPermission === "unsupported" && (
            <span className={styles.content__pushEnabled}>
              Браузер не поддерживает уведомления
            </span>
          )}

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
      </div>

      {notifications.length > 0 && !isLoading && (
        <div className={styles.content__manage}>
          <label className={styles.content__selectAll}>
            <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} />
            <span>Выбрать все на странице</span>
          </label>

          <div className={styles.content__deleteActions}>
            {selectedIds.length > 0 && (
              <button type="button" onClick={() => void deleteSelected()}>
                Удалить выбранные ({selectedIds.length})
              </button>
            )}
            <button type="button" onClick={() => void deleteAll()} disabled={isDeletingAll}>
              {isDeletingAll ? "Удаляем..." : "Удалить все"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={styles.content__skeleton} aria-label="Загрузка уведомлений">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.content__skeletonItem} />
          ))}
        </div>
      ) : isError ? (
        <div className={styles.content__error}>
          <span>Не удалось загрузить уведомления.</span>
          <button type="button" onClick={() => void refetch()}>Повторить</button>
        </div>
      ) : notifications.length > 0 ? (
        <>
          <div className={styles.content__list}>
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                selected={selectedIds.includes(item.id)}
                onSelect={(checked) => toggleSelected(item.id, checked)}
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
