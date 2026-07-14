import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { AuthUser } from '@/features/auth/auth.types';

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export const profileApi = {
  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const { data } = await api.patch<ApiResponse<AuthUser>>('/users/profile', payload);
    return data.data;
  },
};
