export interface AiChatMessage {
  id: string;
  role: 'user' | 'model' | 'assistant';
  content: string;
  createdAt: Date;
  products?: AiProductRecommendation[];
  suggestedQueries?: string[];
}

export interface AiProductRecommendation {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  thumbnail: string;
  stock: number;
  categoryName?: string;
  rating?: {
    average: number;
    count: number;
  };
}

export interface AiChatResponse {
  reply: string;
  products: AiProductRecommendation[];
  suggestedQueries: string[];
}

export interface AiProductInsights {
  productId: string;
  productName: string;
  summary: string;
  pros: string[];
  cons: string[];
  idealFor: string[];
  buyerMatchScore: number;
  verdict: string;
  keyTakeaways: string[];
}

export interface AiGeneratedProductDraft {
  name: string;
  description: string;
  suggestedCategoryName: string;
  suggestedPrice: number;
  suggestedCompareAtPrice?: number;
  suggestedSku: string;
  tags: string[];
  specs: Array<{ key: string; value: string }>;
  highlights: string[];
  categoryId?: string;
}
