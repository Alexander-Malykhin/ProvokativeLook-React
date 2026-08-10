export type NotificationType = string;

export interface NotificationItemDto {
  id: number;
  userId: number;
  contactId: number | null;
  dealId: number | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string | null;
  readAt: string | null;
}

export interface NotificationsData {
  items: NotificationItemDto[];
  unreadCount: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface NotificationsResponse {
  success: boolean;
  data: NotificationsData;
}

export interface NotificationActionResponse {
  success: boolean;
  data: {
    notificationId?: number;
    isRead?: boolean;
    unreadCount: number;
    updatedCount?: number;
    deletedCount?: number;
    deleted?: boolean;
  };
}
