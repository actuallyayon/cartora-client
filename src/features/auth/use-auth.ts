'use client';

import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/auth.api';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/features/auth/auth.types';

export const authKeys = {
  currentUser: ['auth', 'me'] as const,
};

/**
 * Source of truth for auth state. Treats 401/403 as "logged out" (data = null)
 * rather than an error, so components can branch on `user` cleanly.
 */
export function useCurrentUser() {
  return useQuery<AuthUser | null>({
    queryKey: authKeys.currentUser,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (error) {
        if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/** Convenience selector used across the app. */
export function useAuth() {
  const { data: user, isLoading, isFetching } = useCurrentUser();
  return {
    user: user ?? null,
    isLoading,
    isFetching,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser, user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser, user);
      toast.success('Account created — welcome to Cartora!');
    },
  });
}

export function useGoogleSignIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credential: string) => authApi.googleLogin(credential),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser, user);
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.clear();
      toast.success('Signed out');
      router.push('/');
    },
  });
}
