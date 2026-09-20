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

export interface AiComparisonProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  thumbnail: string;
  images?: string[];
  stock: number;
  rating?: {
    average: number;
    count: number;
  };
  soldCount?: number;
  categoryName?: string;
  specs?: Array<{ key: string; value: string }>;
  tags?: string[];
  description?: string;
}

export interface AiWinnerBadge {
  productId: string;
  badgeTitle: string;
  reason: string;
}

export interface AiComparisonDimension {
  name: string;
  description: string;
  scores: Array<{
    productId: string;
    score: number;
    note: string;
  }>;
}

export interface AiProductBreakdown {
  productId: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  overallScore: number;
}

export interface AiProductComparisonResponse {
  products: AiComparisonProduct[];
  summary: string;
  verdict: string;
  winnerBadges: AiWinnerBadge[];
  dimensions: AiComparisonDimension[];
  productBreakdowns: AiProductBreakdown[];
  keyDifferences: string[];
}

export interface AiCartOptimizerResponse {
  cartScore: number;
  vibeTitle: string;
  vibeSummary: string;
  freeShippingStatus: {
    qualified: boolean;
    amountNeeded: number;
    tip: string;
  };
  savingsAdvice: string;
  recommendedProductIds: string[];
  pairReasoning: string;
  recommendations: AiProductRecommendation[];
}
