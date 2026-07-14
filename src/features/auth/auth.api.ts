import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/features/auth/auth.types';

/** Thin API layer for auth endpoints. All calls rely on httpOnly cookies. */
export const authApi = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post<ApiResponse<AuthUser>>('/auth/login', payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const { data } = await api.post<ApiResponse<AuthUser>>('/auth/register', payload);
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
    return data.data;
  },

  async googleLogin(credential: string): Promise<AuthUser> {
    const { data } = await api.post<ApiResponse<AuthUser>>('/auth/google', { credential });
    return data.data;
  },
};
