'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

/** Navbar wishlist icon — always visible, links to the wishlist page. */
export function WishlistButton() {
  return (
    <Link
      href="/dashboard/wishlist"
      aria-label="Wishlist"
      className="text-foreground hover:bg-accent relative flex h-10 w-10 items-center justify-center rounded-md transition-colors"
    >
      <Heart className="h-5 w-5" />
    </Link>
  );
}
