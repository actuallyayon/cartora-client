'use client';

import * as React from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Newsletter sign-up. Validates the email client-side and confirms; a mailing
 * backend can be wired later without changing this UI.
 */
export function Newsletter() {
  const [email, setEmail] = React.useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border-border bg-card rounded-2xl border p-8 text-center sm:p-12">
        <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Stay in the loop</h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
          Subscribe for new arrivals, exclusive offers, and style tips. No spam — unsubscribe
          anytime.
        </p>
        <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
