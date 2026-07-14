'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/features/cart/use-cart';

/** Navbar cart icon with a live item-count badge. */
export function CartButton() {
  const { data: cart } = useCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Link
      href="/cart"
      aria-label={`Cart with ${count} item${count === 1 ? '' : 's'}`}
      className="text-foreground hover:bg-accent relative flex h-10 w-10 items-center justify-center rounded-md transition-colors"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 ? (
        <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}
