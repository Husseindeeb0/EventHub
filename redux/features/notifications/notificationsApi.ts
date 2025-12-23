import { api } from "../../api";

export interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
}

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: "/notifications",
        method: "PUT",
        body: { notificationId },
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/notifications",
        method: "PUT",
        body: { markAllRead: true },
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: "/notifications",
        method: "DELETE",
        body: { notificationId },
      }),
      invalidatesTags: ["Notification"],
    }),
    clearAllNotifications: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/notifications",
        method: "DELETE",
        body: { clearAll: true },
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} = notificationsApi;
