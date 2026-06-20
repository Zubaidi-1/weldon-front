"use client";

import { getApiUrl, API_BASE_URL } from "@/config/api";
import { useAuth } from "@/Context/auth/authContext";
import type {
  AppNotification,
  NotificationsResponse,
} from "@/lib/types/NotificationTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useApi } from "../api/useApi";

type RealtimeNotification = Partial<AppNotification> & {
  title: string;
  message: string;
};

export const notificationsQueryKey = ["notifications"];

export const useNotifications = (enabled: boolean) => {
  const api = useApi();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<NotificationsResponse>({
    queryKey: notificationsQueryKey,
    enabled: enabled && Boolean(accessToken),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await api(getApiUrl("/notifications?limit=10"));

      return response as NotificationsResponse;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: number) =>
      api(getApiUrl(`/notifications/${notificationId}/read`), {
        method: "PATCH",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () =>
      api(getApiUrl("/notifications/read-all"), {
        method: "PATCH",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });

  useEffect(() => {
    if (!enabled || !accessToken) return;

    const socket = io(API_BASE_URL, {
      auth: { token: accessToken },
    });

    socket.on("notification.created", (notification: RealtimeNotification) => {
      toast(notification.message || notification.title);
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, enabled, queryClient]);

  return {
    ...query,
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    isMarkingAllAsRead: markAllAsRead.isPending,
  };
};
