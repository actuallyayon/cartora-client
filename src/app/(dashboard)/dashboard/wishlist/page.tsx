'use client';

import Link from 'next/link';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { ProductCard } from '@/features/catalog/components/product-card';
import { useWishlistProducts } from '@/features/wishlist/use-wishlist';

function WishlistView() {
  const { data: products, isLoading } = useWishlistProducts();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="border-border bg-card flex flex-col items-center rounded-lg border border-dashed p-12 text-center">
        <Heart className="text-muted-foreground h-10 w-10" />
        <h2 className="mt-3 text-lg font-medium">Your wishlist is empty</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Tap the heart on any product to save it here.
        </p>
        <Button asChild className="mt-4">
          <Link href="/explore">Explore products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">Your Wishlist</h1>
        <WishlistView />
      </div>
    </RequireAuth>
  );
}
