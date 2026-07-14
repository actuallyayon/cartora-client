import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  CheckoutPayload,
  CheckoutResult,
  ValidateCouponPayload,
  ValidateCouponResult,
  Order,
} from '@/features/checkout/checkout.types';

export const checkoutApi = {
  async validateCoupon(payload: ValidateCouponPayload): Promise<ValidateCouponResult> {
    const { data } = await api.post<ApiResponse<ValidateCouponResult>>('/coupons/validate', payload);
    return data.data;
  },

  async checkout(payload: CheckoutPayload): Promise<CheckoutResult> {
    const { data } = await api.post<ApiResponse<CheckoutResult>>('/orders/checkout', payload);
    return data.data;
  },

  async getOrder(orderNumber: string): Promise<Order> {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${orderNumber}`);
    return data.data;
  },
};
