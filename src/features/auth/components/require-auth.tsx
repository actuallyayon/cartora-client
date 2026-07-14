'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types';
import { useAuth } from '@/features/auth/use-auth';

interface RequireAuthProps {
  children: React.ReactNode;
  role?: UserRole; // when set, also enforces this role
}

/**
 * Client-side route guard. Redirects unauthenticated users to /login (carrying
 * a `redirect` back to the current page) and role-mismatched users home.
 * Server middleware can't read the httpOnly token cheaply, so guarding here —
 * plus the API enforcing auth on every request — is the pragmatic SPA approach.
 */
export function RequireAuth({ children, role }: RequireAuthProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const denied = !isLoading && (!isAuthenticated || (role && user?.role !== role));

  React.useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (role && user?.role !== role) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, role, user?.role, router, pathname]);

  if (isLoading || denied) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
