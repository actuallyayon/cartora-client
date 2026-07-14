import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Notification } from '@/features/notification/notification.types';

export const notificationApi = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<ApiResponse<Notification[]>>('/notifications');
    return data.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const { data } = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return data.data;
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const { data } = await api.patch<ApiResponse<{ success: boolean }>>('/notifications/read-all');
    return data.data;
  },
};
