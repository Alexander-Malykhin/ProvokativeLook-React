import { baseApi } from "@store/api/baseApi";
import type { NotificationActionResponse, NotificationsResponse, } from "./types";
export interface GetNotificationsParams {
    limit?: number;
    offset?: number;
    isRead?: boolean;
}
export const notificationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationsResponse, GetNotificationsParams | void>({
            query: (params) => {
                const limit = params?.limit ?? 10;
                const offset = params?.offset ?? 0;
                const isRead = params?.isRead;
                const search = new URLSearchParams({
                    limit: String(limit),
                    offset: String(offset),
                });
                if (typeof isRead === "boolean") {
                    search.set("isRead", isRead ? "1" : "0");
                }
                return {
                    url: `notifications&${search.toString()}`,
                };
            },
            providesTags: ["Notifications"],
        }),
        getUnreadNotificationsCount: builder.query<NotificationActionResponse, void>({
            query: () => ({
                url: "notifications/unread-count",
            }),
            providesTags: ["Notifications"],
        }),
        markNotificationAsRead: builder.mutation<NotificationActionResponse, number>({
            query: (notificationId) => ({
                url: "notifications/read",
                method: "POST",
                body: { notificationId },
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllNotificationsAsRead: builder.mutation<NotificationActionResponse, void>({
            query: () => ({
                url: "notifications/read-all",
                method: "POST",
            }),
            invalidatesTags: ["Notifications"],
        }),
        deleteNotification: builder.mutation<NotificationActionResponse, number>({
            query: (notificationId) => ({
                url: "notifications/delete",
                method: "POST",
                body: { notificationId },
            }),
            invalidatesTags: ["Notifications"],
        }),
        deleteAllNotifications: builder.mutation<NotificationActionResponse, void>({
            query: () => ({
                url: "notifications/delete-all",
                method: "POST",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});
export const { useGetNotificationsQuery, useGetUnreadNotificationsCountQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation, useDeleteNotificationMutation, useDeleteAllNotificationsMutation, } = notificationsApi;

