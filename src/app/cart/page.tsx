'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import { RequireAuth } from '@/features/auth/components/require-auth';
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/features/cart/use-cart';

const SHIPPING_FLAT = 0; // shipping/tax are calculated at checkout (Step 11)

function CartView() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="border-border bg-card flex flex-col items-center rounded-lg border border-dashed p-12 text-center">
        <ShoppingBag className="text-muted-foreground h-10 w-10" />
        <h2 className="mt-3 text-lg font-medium">Your cart is empty</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse the collection and add something you love.
        </p>
        <Button asChild className="mt-4">
          <Link href="/explore">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {items.map((item) => {
          const pid = item.product.id;
          const busy =
            (updateItem.isPending || removeItem.isPending) &&
            (updateItem.variables?.[0] === pid || removeItem.variables?.[0] === pid);
          return (
            <Card key={pid}>
              <CardContent className="flex gap-4 p-4">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-md"
                >
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem.mutate([pid])}
                      aria-label="Remove item"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {item.selectedVariant ? (
                    <p className="text-muted-foreground text-xs">
                      {item.selectedVariant.name}: {item.selectedVariant.value}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground mt-1 text-sm">
                    {formatPrice(item.product.price, item.product.currency)} each
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="border-border flex items-center rounded-md border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1 || busy}
                        onClick={() => updateItem.mutate([pid, item.quantity - 1])}
                        className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={item.quantity >= item.product.stock || busy}
                        onClick={() => updateItem.mutate([pid, item.quantity + 1])}
                        className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold">
                      {formatPrice(item.lineTotal, item.product.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <button
          type="button"
          onClick={() => clearCart.mutate([])}
          className="text-muted-foreground hover:text-destructive text-sm transition-colors"
        >
          Clear cart
        </button>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({cart?.itemCount} item{cart?.itemCount === 1 ? '' : 's'})
                </span>
                <span>{formatPrice(cart?.subtotal ?? 0, cart?.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-border flex justify-between border-t pt-4 font-semibold">
              <span>Total</span>
              <span>{formatPrice((cart?.subtotal ?? 0) + SHIPPING_FLAT, cart?.currency)}</span>
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/explore">Continue shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">Your Cart</h1>
        <CartView />
      </div>
    </RequireAuth>
  );
}
