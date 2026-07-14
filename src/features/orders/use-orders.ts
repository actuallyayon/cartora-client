'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/features/orders/orders.api';

export const ordersKeys = {
  all: ['orders'] as const,
  user: () => ['orders', 'user'] as const,
  admin: (params: Record<string, unknown>) => ['orders', 'admin', params] as const,
  detail: (orderNumber: string) => ['orders', 'detail', orderNumber] as const,
};

export function useUserOrders() {
  return useQuery({
    queryKey: ordersKeys.user(),
    queryFn: () => ordersApi.getUserOrders(),
  });
}

export function useOrderDetails(orderNumber: string) {
  return useQuery({
    queryKey: ordersKeys.detail(orderNumber),
    queryFn: () => ordersApi.getOrderDetails(orderNumber),
    enabled: Boolean(orderNumber),
  });
}

export function useAdminOrders(params: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ordersKeys.admin(params),
    queryFn: () => ordersApi.adminGetOrders(params),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.adminUpdateStatus(id, status),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all });
      void queryClient.invalidateQueries({ queryKey: ordersKeys.detail(order.orderNumber) });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.userCancelOrder(id),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all });
      void queryClient.invalidateQueries({ queryKey: ordersKeys.detail(order.orderNumber) });
    },
  });
}
