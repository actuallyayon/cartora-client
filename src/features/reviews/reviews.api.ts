import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { ProductReviewsResult, CreateReviewPayload, Review } from '@/features/reviews/reviews.types';

export const reviewsApi = {
  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductReviewsResult> {
    const { data } = await api.get<ApiResponse<ProductReviewsResult>>(`/reviews/product/${productId}`, {
      params: { page, limit },
    });
    return data.data;
  },

  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await api.post<ApiResponse<Review>>('/reviews', payload);
    return data.data;
  },

  async deleteReview(reviewId: string): Promise<Review> {
    const { data } = await api.delete<ApiResponse<Review>>(`/reviews/${reviewId}`);
    return data.data;
  },
};
