import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { SITE_API_BASE_URL } from "@/config/env";
import { baseApi } from "@store/api/baseApi";

type RealtimeNotification = {
  id: number;
  title: string;
  message: string;
  dealId?: number | null;
};

type RealtimeSnapshot = {
  latestNotification?: RealtimeNotification | null;
};

const LAST_BROWSER_NOTIFICATION_KEY = "provokativelook:lastBrowserNotificationId";

const isLocalDevelopmentHost = () => {
  if (typeof window === "undefined") return false;

  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

const canUseBrowserNotifications = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  (window.isSecureContext || isLocalDevelopmentHost());

export type BrowserNotificationPermissionResult =
  | NotificationPermission
  | "unsupported"
  | "insecure";

const getLastShownNotificationId = (): number => {
  if (typeof window === "undefined") return 0;

  const value = Number(window.localStorage.getItem(LAST_BROWSER_NOTIFICATION_KEY) ?? 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

export const rememberBrowserNotificationBaseline = (notificationId: number) => {
  if (typeof window === "undefined" || notificationId <= 0) return;
  window.localStorage.setItem(LAST_BROWSER_NOTIFICATION_KEY, String(notificationId));
};

const showBrowserNotification = (payload: RealtimeNotification) => {
  if (!canUseBrowserNotifications() || Notification.permission !== "granted") {
    return;
  }

  if (!payload.id || payload.id <= getLastShownNotificationId()) {
    return;
  }

  rememberBrowserNotificationBaseline(payload.id);

  const notification = new Notification(payload.title || "ProvokativeLook", {
    body: payload.message || "Статус заказа обновлён",
    tag: `provokativelook-${payload.id}`,
    icon: "/favicon.ico",
  });

  notification.onclick = () => {
    window.focus();
    if (payload.dealId) {
      window.location.assign(`/profile/orders/${payload.dealId}`);
    } else {
      window.location.assign("/profile/notifications");
    }
    notification.close();
  };
};

export const requestBrowserNotificationPermission =
  async (): Promise<BrowserNotificationPermissionResult> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    if (!window.isSecureContext && !isLocalDevelopmentHost()) {
      return "insecure";
    }

    try {
      return await Notification.requestPermission();
    } catch {
      return "unsupported";
    }
  };

export const useRealtimeUpdates = () => {
  const dispatch = useDispatch();
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let disposed = false;
    let fallbackTimer: number | null = null;
    let reconnectTimer: number | null = null;

    const invalidateRealtimeData = () => {
      dispatch(baseApi.util.invalidateTags(["Orders", "Notifications"]));
    };

    const startFallbackPolling = () => {
      if (fallbackTimer !== null) return;
      fallbackTimer = window.setInterval(invalidateRealtimeData, 15000);
    };

    const connect = () => {
      if (disposed || typeof EventSource === "undefined") {
        startFallbackPolling();
        return;
      }

      const url = `${SITE_API_BASE_URL}events`;
      const source = new EventSource(url, { withCredentials: true });
      sourceRef.current = source;

      source.addEventListener("snapshot", (event) => {
        // Короткое SSE-соединение отдаёт новый снимок примерно раз в 5 секунд.
        // Сразу обновляем заказы/уведомления, но не держим PHP worker открытым.
        invalidateRealtimeData();

        try {
          const payload = JSON.parse((event as MessageEvent<string>).data) as RealtimeSnapshot;
          if (payload.latestNotification) {
            showBrowserNotification(payload.latestNotification);
          }
        } catch {
          // Снимок realtime не должен ломать приложение.
        }
      });

      source.addEventListener("orders.changed", invalidateRealtimeData);
      source.addEventListener("notifications.changed", () => {
        dispatch(baseApi.util.invalidateTags(["Notifications"]));
      });
      source.addEventListener("notification.created", (event) => {
        dispatch(baseApi.util.invalidateTags(["Orders", "Notifications"]));

        try {
          const payload = JSON.parse((event as MessageEvent<string>).data) as RealtimeNotification;
          showBrowserNotification(payload);
        } catch {
          // Невалидное realtime-событие не должно ломать приложение.
        }
      });

      source.onopen = () => {
        if (fallbackTimer !== null) {
          window.clearInterval(fallbackTimer);
          fallbackTimer = null;
        }
      };

      source.onerror = () => {
        source.close();
        if (sourceRef.current === source) sourceRef.current = null;
        startFallbackPolling();

        if (!disposed) {
          reconnectTimer = window.setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      disposed = true;
      sourceRef.current?.close();
      sourceRef.current = null;
      if (fallbackTimer !== null) window.clearInterval(fallbackTimer);
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
    };
  }, [dispatch]);
};
