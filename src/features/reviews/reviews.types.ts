export interface Review {
  id: string;
  product: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsResult {
  items: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateReviewPayload {
  product: string;
  rating: number;
  comment: string;
}
