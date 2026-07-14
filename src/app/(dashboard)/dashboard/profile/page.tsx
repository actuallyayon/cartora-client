'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { Loader2 } from 'lucide-react';

function ProfileRedirect() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/dashboard#profile');
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  );
}

export default function ProfileRedirectPage() {
  return (
    <RequireAuth>
      <ProfileRedirect />
    </RequireAuth>
  );
}
