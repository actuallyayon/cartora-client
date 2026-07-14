'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * TanStack Query provider. The client is created inside state so it's stable
 * across re-renders and never shared between requests on the server.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    const handleLogout = () => {
      // Prevent infinite loops if we are already on the login page
      if (window.location.pathname !== '/login') {
        queryClient.clear();
        queryClient.setQueryData(['auth', 'me'], null);
        toast.error('Your session has expired. Please sign in again.');
        router.push('/login');
      } else {
        // If we are already on login, just ensure the current user is null
        queryClient.setQueryData(['auth', 'me'], null);
      }
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
