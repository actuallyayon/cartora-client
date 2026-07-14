import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Product } from '@/features/catalog/catalog.types';

export const wishlistApi = {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get<ApiResponse<Product[]>>('/wishlist');
    return data.data;
  },
  async getIds(): Promise<string[]> {
    const { data } = await api.get<ApiResponse<string[]>>('/wishlist/ids');
    return data.data;
  },
  async add(productId: string): Promise<string[]> {
    const { data } = await api.post<ApiResponse<string[]>>(`/wishlist/${productId}`);
    return data.data;
  },
  async remove(productId: string): Promise<string[]> {
    const { data } = await api.delete<ApiResponse<string[]>>(`/wishlist/${productId}`);
    return data.data;
  },
};
