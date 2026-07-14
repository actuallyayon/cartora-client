/**
 * Cross-cutting types shared across features. The API's response envelope is
 * declared here so hooks/services can type their responses consistently.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export type UserRole = 'customer' | 'admin';
