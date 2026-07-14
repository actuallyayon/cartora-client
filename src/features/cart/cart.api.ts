import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Cart } from '@/features/cart/cart.types';

export const cartApi = {
  async get(): Promise<Cart> {
    const { data } = await api.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },
  async addItem(productId: string, quantity = 1, selectedVariant?: { name: string; value: string }): Promise<Cart> {
    const { data } = await api.post<ApiResponse<Cart>>('/cart/items', { productId, quantity, selectedVariant });
    return data.data;
  },
  async updateItem(productId: string, quantity: number): Promise<Cart> {
    const { data } = await api.patch<ApiResponse<Cart>>(`/cart/items/${productId}`, { quantity });
    return data.data;
  },
  async removeItem(productId: string): Promise<Cart> {
    const { data } = await api.delete<ApiResponse<Cart>>(`/cart/items/${productId}`);
    return data.data;
  },
  async clear(): Promise<Cart> {
    const { data } = await api.delete<ApiResponse<Cart>>('/cart');
    return data.data;
  },
};
