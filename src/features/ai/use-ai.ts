import { useMutation, useQuery } from '@tanstack/react-query';
import { aiApi } from '@/features/ai/ai.api';

export const AI_QUERY_KEYS = {
  insights: (productIdOrSlug: string) => ['ai', 'insights', productIdOrSlug] as const,
};

export function useProductInsights(productIdOrSlug: string) {
  return useQuery({
    queryKey: AI_QUERY_KEYS.insights(productIdOrSlug),
    queryFn: () => aiApi.getProductInsights(productIdOrSlug),
    staleTime: 1000 * 60 * 15, // Cache insights for 15 minutes
    enabled: Boolean(productIdOrSlug),
  });
}

export function useAiChat() {
  return useMutation({
    mutationFn: aiApi.sendChatMessage,
  });
}

export function useGenerateProductDraft() {
  return useMutation({
    mutationFn: aiApi.generateProductDraft,
  });
}
