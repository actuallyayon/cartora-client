import type { UserRole } from '@/types';

/** Authenticated user shape returned by the API (password never included). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'banned';
  avatarUrl?: string;
  phone?: string;
  authProvider: 'local' | 'google';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
