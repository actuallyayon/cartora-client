'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/notification.api';

export const notificationKeys = {
  all: ['notifications'] as const,
};

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: () => notificationApi.getNotifications(),
    enabled,
    refetchInterval: 30000, // Poll every 30 seconds for order updates
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
