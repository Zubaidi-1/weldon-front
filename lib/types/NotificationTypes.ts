export type NotificationType = "ORDERS" | "DISCOUNTS" | "REVIEWS";
export type NotificationAudience = "USER" | "ADMIN" | "ALL";

export type AppNotification = {
  notificationId: number;
  type: NotificationType;
  audience: NotificationAudience;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  userId: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = {
  notifications: AppNotification[];
  unreadCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
};
