'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, type UpdateProfilePayload } from '@/features/profile/profile.api';
import { authKeys } from '@/features/auth/use-auth';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
    onSuccess: () => {
      // Invalidate auth query to refresh user name/avatar globally
      void queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    },
  });
}
