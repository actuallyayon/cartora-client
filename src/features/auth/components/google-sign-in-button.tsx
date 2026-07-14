'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useGoogleSignIn } from '@/features/auth/use-auth';

interface GoogleSignInButtonProps {
  redirectTo?: string;
}

/**
 * Renders Google's official "Sign in with Google" button via @react-oauth/google.
 * On successful credential exchange, the backend verifies the ID token, creates
 * or finds the user, and returns a JWT session cookie.
 */
export function GoogleSignInButton({ redirectTo }: GoogleSignInButtonProps) {
  const router = useRouter();
  const params = useSearchParams();
  const target = redirectTo ?? params.get('redirect') ?? '/dashboard';
  const googleSignIn = useGoogleSignIn();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSuccess = (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error('Google sign-in failed — no credential received.');
      return;
    }

    googleSignIn.mutate(response.credential, {
      onSuccess: () => {
        router.replace(target);
      },
      onError: (error) => {
        const msg = axios.isAxiosError(error)
          ? ((error.response?.data as { message?: string })?.message ?? 'Google sign-in failed')
          : 'Google sign-in failed';
        toast.error(msg);
      },
    });
  };

  if (!mounted) {
    return (
      <div className="flex w-full justify-center">
        <div className="h-10 w-[340px] animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in was cancelled.')}
        size="large"
        width="340"
        text="continue_with"
        shape="rectangular"
        theme={resolvedTheme === 'dark' ? 'filled_black' : 'outline'}
      />
    </div>
  );
}
