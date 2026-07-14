import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  Category,
  CreateProductPayload,
  Product,
  ProductListParams,
  UpdateProductPayload,
} from '@/features/catalog/catalog.types';

export interface ProductListResult {
  items: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const catalogApi = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  async getProducts(params: ProductListParams): Promise<ProductListResult> {
    const { data } = await api.get<ApiResponse<Product[]>>('/products', { params });
    const m = data.meta;
    return {
      items: data.data,
      meta: {
        page: m?.page ?? 1,
        limit: m?.limit ?? 12,
        total: m?.total ?? data.data.length,
        totalPages: m?.totalPages ?? 1,
      },
    };
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${idOrSlug}`);
    return data.data;
  },

  async getRelated(idOrSlug: string): Promise<Product[]> {
    const { data } = await api.get<ApiResponse<Product[]>>(`/products/${idOrSlug}/related`);
    return data.data;
  },

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const { data } = await api.post<ApiResponse<Product>>('/products', payload);
    return data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
    const { data } = await api.patch<ApiResponse<Product>>(`/products/${id}`, payload);
    return data.data;
  },

  async uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append('image', file);
    const { data } = await api.post<ApiResponse<{ url: string }>>('/uploads/image', form);
    return data.data.url;
  },
};
