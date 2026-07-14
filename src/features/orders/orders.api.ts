import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { AdminOrdersResult, Order } from '@/features/orders/orders.types';

export const ordersApi = {
  async getUserOrders(): Promise<Order[]> {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders');
    return data.data;
  },

  async getOrderDetails(orderNumber: string): Promise<Order> {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${orderNumber}`);
    return data.data;
  },

  async adminGetOrders(params: { status?: string; page?: number; limit?: number }): Promise<AdminOrdersResult> {
    const { data } = await api.get<
      ApiResponse<{
        items: Order[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      }>
    >('/orders/admin', { params });
    return {
      items: data.data.items,
      meta: data.data.meta,
    };
  },

  async adminUpdateStatus(id: string, orderStatus: string): Promise<Order> {
    const { data } = await api.patch<ApiResponse<Order>>(`/orders/admin/${id}/status`, { orderStatus });
    return data.data;
  },

  async userCancelOrder(id: string): Promise<Order> {
    const { data } = await api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return data.data;
  },
};
