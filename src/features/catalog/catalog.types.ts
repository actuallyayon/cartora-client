export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | null;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}

/** Populated ref shape returned by list/detail endpoints. */
export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  name: string;
  value: string;
  priceDelta: number;
  stock: number;
  sku?: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  richDescription?: string;
  brand?: CategoryRef | null;
  category: CategoryRef;
  price: number;
  compareAtPrice?: number;
  currency: string;
  thumbnail: string;
  images: string[];
  sku: string;
  stock: number;
  variants: ProductVariant[];
  specs: ProductSpec[];
  tags: string[];
  rating: { average: number; count: number };
  soldCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  thumbnail: string;
  images?: string[];
  sku: string;
  stock: number;
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  variants?: { name: string; value: string }[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  compareAtPrice?: number;
  thumbnail?: string;
  images?: string[];
  sku?: string;
  stock?: number;
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  variants?: { name: string; value: string }[];
}

