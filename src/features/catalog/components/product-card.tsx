'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatPrice, discountPercent } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/use-auth';
import { useAddToCart } from '@/features/cart/use-cart';
import { useToggleWishlist, useWishlistIds } from '@/features/wishlist/use-wishlist';
import type { Product } from '@/features/catalog/catalog.types';

/**
 * Reusable product card — identical dimensions across the grid. Shows image,
 * title, price with discount badge, a wishlist heart, and add-to-cart.
 * Cart/wishlist actions persist via the API for signed-in users; guests are
 * nudged to sign in.
 */
export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: wishlistIds } = useWishlistIds();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  const wished = wishlistIds?.includes(product.id) ?? false;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      toast.info('Please sign in to continue');
      router.push('/login?redirect=/explore');
      return false;
    }
    return true;
  };

  const onToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    toggleWishlist.mutate({ productId: product.id, wished });
  };

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    addToCart.add(product.id, 1);
  };

  return (
    <div className="group border-border bg-card relative flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="bg-muted relative block aspect-square overflow-hidden"
      >
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 ? (
          <span className="bg-destructive text-destructive-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold">
            -{discount}%
          </span>
        ) : null}
        {outOfStock ? (
          <span className="bg-background/80 text-muted-foreground absolute inset-x-0 bottom-0 py-1 text-center text-xs font-medium backdrop-blur-sm">
            Out of stock
          </span>
        ) : null}
        <button
          type="button"
          onClick={onToggleWish}
          aria-label="Toggle wishlist"
          className="bg-background/80 text-foreground hover:bg-background absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-destructive text-destructive')} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-muted-foreground text-xs">{product.category?.name}</p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-sm font-medium hover:underline"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold">
            {formatPrice(product.price, product.currency)}
          </span>
          {discount > 0 && product.compareAtPrice ? (
            <span className="text-muted-foreground text-sm line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          ) : null}
        </div>

        <Button
          size="sm"
          className="mt-3 w-full"
          onClick={onAddToCart}
          disabled={outOfStock || addToCart.isPending}
          variant={outOfStock ? 'secondary' : 'default'}
        >
          <ShoppingCart />
          {outOfStock ? 'Unavailable' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
}
