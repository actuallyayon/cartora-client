'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/features/reviews/reviews.api';
import type { CreateReviewPayload } from '@/features/reviews/reviews.types';

export const reviewsKeys = {
  all: ['reviews'] as const,
  product: (productId: string, params: Record<string, unknown>) => ['reviews', productId, params] as const,
};

export function useProductReviews(productId: string, params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: reviewsKeys.product(productId, params),
    queryFn: () => reviewsApi.getProductReviews(productId, params.page, params.limit),
    enabled: Boolean(productId),
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.createReview(payload),
    onSuccess: () => {
      // Invalidate reviews for this product
      void queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      // Invalidate product details and listings to refresh rating score statistics
      void queryClient.invalidateQueries({ queryKey: ['product'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      void queryClient.invalidateQueries({ queryKey: ['product'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
