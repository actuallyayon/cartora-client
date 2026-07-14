'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, PackageCheck, User, Calendar, MapPin, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useOrder } from '@/features/checkout/use-checkout';
import { formatPrice } from '@/lib/format';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';

  const { data: order, isLoading, isError } = useOrder(orderNumber);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-full bg-amber-500/10 p-3 w-fit mx-auto text-amber-500 mb-4">
          <PackageCheck className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-semibold">Order processing</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          We received your payment details. The order is being registered in the system.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild>
            <Link href="/explore">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const items = order.items ?? [];
  const addr = order.shippingAddress;
  const dateStr = new Date(order.placedAt || order.createdAt).toLocaleDateString('en-US', {
    dateStyle: 'long',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header alert */}
      <div className="text-center mb-8">
        <div className="rounded-full bg-emerald-500/10 p-3 w-fit mx-auto text-emerald-500 mb-4 animate-bounce">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Thank you for your order!</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
          We have received your payment. Your order <span className="font-semibold text-foreground">{order.orderNumber}</span> has been confirmed and is being processed.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Order Info Summary */}
        <Card>
          <CardHeader className="bg-muted/40 py-4 border-b">
            <div className="flex flex-wrap justify-between items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Date: <span className="font-medium text-foreground">{dateStr}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                Status:{' '}
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500 capitalize">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 divide-y divide-border">
            {/* Products */}
            <div className="pb-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded border border-border">
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                    {item.selectedVariant && (
                      <p className="text-muted-foreground mt-0.5">
                        {item.selectedVariant.name}: {item.selectedVariant.value}
                      </p>
                    )}
                    <p className="text-muted-foreground mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial breakdown */}
            <div className="py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold text-base">
                <span>Total Paid</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="pt-4 text-sm space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Shipping address
              </h3>
              <div className="text-muted-foreground space-y-0.5 text-xs">
                <p className="font-medium text-foreground">{addr.fullName}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{addr.city}, {addr.state ? `${addr.state} ` : ''}{addr.postalCode}</p>
                <p>{addr.country}</p>
                <p className="mt-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Phone: {addr.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/explore">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">View All Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <RequireAuth>
      <React.Suspense fallback={null}>
        <SuccessContent />
      </React.Suspense>
    </RequireAuth>
  );
}
