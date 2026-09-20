import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type {
  AiChatResponse,
  AiProductInsights,
  AiGeneratedProductDraft,
  AiProductComparisonResponse,
  AiCartOptimizerResponse,
} from '@/features/ai/ai.types';

export const aiApi = {
  async sendChatMessage(payload: {
    message: string;
    history: Array<{ role: 'user' | 'model' | 'assistant'; content: string }>;
    currentPath?: string;
  }): Promise<AiChatResponse> {
    const { data } = await api.post<ApiResponse<AiChatResponse>>('/ai/chat', payload);
    return data.data;
  },

  async getProductInsights(productIdOrSlug: string): Promise<AiProductInsights> {
    const { data } = await api.get<ApiResponse<AiProductInsights>>(
      `/ai/insights/${productIdOrSlug}`,
    );
    return data.data;
  },

  async generateProductDraft(payload: {
    prompt: string;
    existingData?: Record<string, unknown>;
  }): Promise<AiGeneratedProductDraft> {
    const { data } = await api.post<ApiResponse<AiGeneratedProductDraft>>(
      '/ai/generate-product',
      payload,
    );
    return data.data;
  },

  async compareProducts(payload: {
    productIds: string[];
    userPriority?: string;
  }): Promise<AiProductComparisonResponse> {
    const { data } = await api.post<ApiResponse<AiProductComparisonResponse>>(
      '/ai/compare',
      payload,
    );
    return data.data;
  },

  async optimizeCart(payload: {
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      category?: string;
    }>;
    userNote?: string;
  }): Promise<AiCartOptimizerResponse> {
    const { data } = await api.post<ApiResponse<AiCartOptimizerResponse>>(
      '/ai/cart-optimizer',
      payload,
    );
    return data.data;
  },
};
