'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoAccounts } from '@/config/site';
import { loginSchema, type LoginFormValues } from '@/features/auth/auth.schemas';
import { useLogin } from '@/features/auth/use-auth';
import { GoogleSignInButton } from '@/features/auth/components/google-sign-in-button';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirect') ?? '/dashboard';
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [serverError, setServerError] = React.useState<string | null>(null);

  const submit = handleSubmit((values) => {
    setServerError(null);
    login.mutate(values, {
      onSuccess: () => router.replace(redirectTo),
      onError: (error) => {
        const msg = axios.isAxiosError(error)
          ? ((error.response?.data as { message?: string })?.message ?? 'Login failed')
          : 'Login failed';
        setServerError(msg);
      },
    });
  });

  const fillDemo = (role: 'customer' | 'admin') => {
    setValue('email', demoAccounts[role].email);
    setValue('password', demoAccounts[role].password);
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="sm"
        onClick={() => fillDemo('customer')}
      >
        Demo customer
      </Button>

      <GoogleSignInButton redirectTo={redirectTo} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card text-muted-foreground px-2">or use your email</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email ? <p className="text-destructive text-sm">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? <Loader2 className="animate-spin" /> : null}
        Sign in
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
