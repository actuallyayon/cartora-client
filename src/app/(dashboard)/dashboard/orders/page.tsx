'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useAuth } from '@/features/auth/use-auth';
import { Loader2 } from 'lucide-react';

function OrdersRedirect() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  React.useEffect(() => {
    if (isLoading) return;
    if (isAdmin) {
      router.replace('/items/orders');
    } else {
      router.replace('/dashboard#orders');
    }
  }, [isAdmin, isLoading, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  );
}

export default function OrdersRedirectPage() {
  return (
    <RequireAuth>
      <OrdersRedirect />
    </RequireAuth>
  );
}
