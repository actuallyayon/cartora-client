'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { publicNavLinks, authNavLinks } from '@/config/site';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { CartButton } from '@/features/cart/components/cart-button';
import { WishlistButton } from '@/features/wishlist/components/wishlist-button';
import { NotificationBell } from '@/features/notification/components/notification-bell';
import { useNotifications } from '@/features/notification/use-notification';
import { useAuth, useLogout } from '@/features/auth/use-auth';

/**
 * Sticky, responsive, auth-aware navbar. Turns glassy on scroll (the one place
 * glassmorphism is used). Logged-out users see public routes + Sign in/up;
 * logged-in users see their account routes + a user menu.
 */
export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const { data: notifications = [] } = useNotifications(isAuthenticated);
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = isAuthenticated ? authNavLinks : publicNavLinks;
  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled
          ? 'border-border bg-background/70 backdrop-blur-md'
          : 'bg-background border-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="text-primary">C</span>artora
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <WishlistButton />
          <CartButton />
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link
                href="/dashboard"
                className="hover:bg-accent flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm font-medium"
              >
                <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                  {initial}
                </span>
                <span className="max-w-[8rem] truncate">{user?.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <WishlistButton />
          <CartButton />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
            {isAuthenticated && hasUnreadNotifications ? (
              <span
                className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-background"
                aria-label="Unread notifications"
              />
            ) : null}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="border-border bg-background border-t md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <li className="flex items-center justify-end gap-2 border-b border-border pb-3">
              {isAuthenticated ? <NotificationBell /> : null}
              <ThemeToggle />
            </li>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground block rounded-md px-3 py-2 text-sm font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      logout.mutate();
                    }}
                  >
                    <LogOut />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href="/register" onClick={() => setOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
