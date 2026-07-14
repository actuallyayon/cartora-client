import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { AnalyticsStats } from '@/features/analytics/analytics.types';

export const analyticsApi = {
  async getStats(): Promise<AnalyticsStats> {
    const { data } = await api.get<ApiResponse<AnalyticsStats>>('/analytics');
    return data.data;
  },
};
