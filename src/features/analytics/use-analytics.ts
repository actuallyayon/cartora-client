'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/features/analytics/analytics.api';
import { useAuth } from '@/features/auth/use-auth';

export const analyticsKeys = {
  stats: ['analytics', 'stats'] as const,
};

export function useAdminAnalytics() {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: analyticsKeys.stats,
    queryFn: () => analyticsApi.getStats(),
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}
