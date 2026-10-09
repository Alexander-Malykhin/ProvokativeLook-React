import { safeLocalStorage } from "@helpers/browserStorage";
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
    if (typeof window === "undefined")
        return false;
    return (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");
};
const canUseBrowserNotifications = () => typeof window !== "undefined" &&
    "Notification" in window &&
    (window.isSecureContext || isLocalDevelopmentHost());
export type BrowserNotificationPermissionResult = NotificationPermission | "unsupported" | "insecure";
const getLastShownNotificationId = (): number => {
    if (typeof window === "undefined")
        return 0;
    const value = Number(safeLocalStorage.getItem(LAST_BROWSER_NOTIFICATION_KEY) ?? 0);
    return Number.isFinite(value) && value > 0 ? value : 0;
};
export const rememberBrowserNotificationBaseline = (notificationId: number) => {
    if (typeof window === "undefined" || notificationId <= 0)
        return;
    safeLocalStorage.setItem(LAST_BROWSER_NOTIFICATION_KEY, String(notificationId));
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
        }
        else {
            window.location.assign("/profile/notifications");
        }
        notification.close();
    };
};
export const requestBrowserNotificationPermission = async (): Promise<BrowserNotificationPermissionResult> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
        return "unsupported";
    }
    if (!window.isSecureContext && !isLocalDevelopmentHost()) {
        return "insecure";
    }
    try {
        return await Notification.requestPermission();
    }
    catch {
        return "unsupported";
    }
};
export const useRealtimeUpdates = (enabled = true) => {
    const dispatch = useDispatch();
    const sourceRef = useRef<EventSource | null>(null);
    useEffect(() => {
        if (!enabled || typeof EventSource === "undefined")
            return;
        const url = `${SITE_API_BASE_URL}events`;
        const source = new EventSource(url, { withCredentials: true });
        sourceRef.current = source;
        source.addEventListener("snapshot", (event) => {
                try {
                    const payload = JSON.parse((event as MessageEvent<string>).data) as RealtimeSnapshot;
                    if (payload.latestNotification) {
                        showBrowserNotification(payload.latestNotification);
                    }
                }
                catch {
                    // Ignore a malformed event; the next snapshot can recover the stream.
                }
        });
        source.addEventListener("orders.changed", () => {
            dispatch(baseApi.util.invalidateTags(["Orders"]));
        });
        source.addEventListener("notifications.changed", () => {
            dispatch(baseApi.util.invalidateTags(["Notifications"]));
        });
        source.addEventListener("notification.created", (event) => {
            dispatch(baseApi.util.invalidateTags(["Orders", "Notifications"]));
                try {
                    const payload = JSON.parse((event as MessageEvent<string>).data) as RealtimeNotification;
                    showBrowserNotification(payload);
                }
                catch {
                    // Query invalidation above still refreshes the authoritative data.
                }
        });
        return () => {
            source.close();
            if (sourceRef.current === source)
                sourceRef.current = null;
        };
    }, [dispatch, enabled]);
};
