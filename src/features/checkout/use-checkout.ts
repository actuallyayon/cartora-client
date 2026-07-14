'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkoutApi } from '@/features/checkout/checkout.api';
import type { CheckoutPayload, ValidateCouponPayload } from '@/features/checkout/checkout.types';

export const checkoutKeys = {
  order: (orderNumber: string) => ['order', orderNumber] as const,
};

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (payload: ValidateCouponPayload) => checkoutApi.validateCoupon(payload),
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkoutApi.checkout(payload),
    onSuccess: () => {
      // Invalidate cart queries since items will be cleared on successful checkout
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useOrder(orderNumber: string) {
  return useQuery({
    queryKey: checkoutKeys.order(orderNumber),
    queryFn: () => checkoutApi.getOrder(orderNumber),
    enabled: Boolean(orderNumber),
  });
}
