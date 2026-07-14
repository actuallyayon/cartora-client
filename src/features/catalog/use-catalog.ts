'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogApi } from '@/features/catalog/catalog.api';
import type { Category, CreateProductPayload, ProductListParams, UpdateProductPayload } from '@/features/catalog/catalog.types';

export const catalogKeys = {
  categories: ['categories'] as const,
  products: (params: ProductListParams) => ['products', params] as const,
  product: (idOrSlug: string) => ['product', idOrSlug] as const,
  related: (idOrSlug: string) => ['product', idOrSlug, 'related'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: catalogKeys.categories,
    queryFn: () => catalogApi.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: catalogKeys.products(params),
    queryFn: () => catalogApi.getProducts(params),
    placeholderData: keepPreviousData, // smooth pagination/filter transitions
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: catalogKeys.product(idOrSlug),
    queryFn: () => catalogApi.getProduct(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
}

export function useRelatedProducts(idOrSlug: string) {
  return useQuery({
    queryKey: catalogKeys.related(idOrSlug),
    queryFn: () => catalogApi.getRelated(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
}

export function useUploadImage() {
  return useMutation({ mutationFn: (file: File) => catalogApi.uploadImage(file) });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<Category, 'name' | 'description' | 'image' | 'isActive'>> }) =>
      catalogApi.updateCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.categories });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => catalogApi.createProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogApi.deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      catalogApi.updateProduct(id, payload),
    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: catalogKeys.product(product.id) });
      void queryClient.invalidateQueries({ queryKey: catalogKeys.product(product.slug) });
    },
  });
}
