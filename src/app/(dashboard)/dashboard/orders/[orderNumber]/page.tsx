'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Loader2, ArrowLeft, ShieldCheck, MapPin, CreditCard, ShoppingBag, XOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useOrderDetails, useCancelOrder } from '@/features/orders/use-orders';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import axios from 'axios';

interface OrderDetailsParams {
  orderNumber: string;
}

function OrderDetailsContent({ orderNumber }: { orderNumber: string }) {
  const { data: order, isLoading, isError } = useOrderDetails(orderNumber);
  const cancelOrderMutation = useCancelOrder();
  const [isCancelling, setIsCancelling] = React.useState(false);

  const handleCancelOrder = () => {
    if (!order) return;
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setIsCancelling(true);
    cancelOrderMutation.mutate(order.id, {
      onSuccess: () => {
        toast.success('Order cancelled successfully.');
        setIsCancelling(false);
      },
      onError: (err) => {
        const msg = axios.isAxiosError(err)
          ? ((err.response?.data as { message?: string })?.message ?? 'Failed to cancel order')
          : 'Failed to cancel order';
        toast.error(msg);
        setIsCancelling(false);
      },
    });
  };

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
        <h2 className="text-xl font-semibold">Order not found</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          We could not retrieve the details for order number <span className="font-semibold text-foreground">{orderNumber}</span>.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const items = order.items ?? [];
  const addr = order.shippingAddress;
  const dateStr = new Date(order.placedAt || order.createdAt).toLocaleDateString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const getStatusBanner = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20',
          title: 'Awaiting confirmation',
          desc: 'Your order is pending confirmation or payment authorization.',
        };
      case 'processing':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          title: 'Processing shipment',
          desc: 'Your items are being packed and prepared for shipping.',
        };
      case 'shipped':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/20',
          title: 'Order shipped',
          desc: 'Your package is on its way. Expect delivery soon.',
        };
      case 'delivered':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          title: 'Delivered',
          desc: `Order was successfully delivered. Thank you for shopping smarter!`,
        };
      case 'cancelled':
        return {
          bg: 'bg-muted/40 border-border',
          title: 'Cancelled',
          desc: 'This order was cancelled and cannot be fulfilled.',
        };
      default:
        return {
          bg: 'bg-secondary',
          title: 'Order status: ' + status,
          desc: '',
        };
    }
  };

  const banner = getStatusBanner(order.orderStatus);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Button asChild size="sm" variant="ghost" className="h-8 p-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header title */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Order {order.orderNumber}
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Placed on {dateStr}
          </p>
        </div>
        {order.orderStatus === 'pending' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                Cancelling...
              </>
            ) : (
              <>
                <XOctagon className="h-4 w-4 mr-1.5" />
                Cancel Order
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status banner description */}
      <div className={`rounded-lg border p-4 mb-6 ${banner.bg}`}>
        <h3 className="font-semibold text-foreground text-sm">{banner.title}</h3>
        {banner.desc && <p className="text-xs text-muted-foreground mt-1">{banner.desc}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left main details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="py-4 border-b font-medium text-xs text-foreground uppercase tracking-wider bg-muted/40">
              Ordered Items
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
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
                  <div className="text-right">
                    <span className="text-sm font-semibold block">
                      {formatPrice(item.subtotal)}
                    </span>
                    <span className="text-muted-foreground text-xxs block mt-0.5">
                      {formatPrice(item.unitPrice)} each
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right sub details */}
        <div className="space-y-6">
          {/* Summary calculations */}
          <Card>
            <CardHeader className="py-3 border-b font-medium text-xs text-foreground uppercase bg-muted/40">
              Order Summary
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
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
              <div className="flex justify-between border-t pt-3 font-semibold text-sm">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery tracking address */}
          <Card>
            <CardHeader className="py-3 border-b font-medium text-xs text-foreground uppercase bg-muted/40">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Shipping address
              </span>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground">{addr.fullName}</p>
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>{addr.city}, {addr.state ? `${addr.state} ` : ''}{addr.postalCode}</p>
              <p>{addr.country}</p>
              <p className="pt-1 text-foreground font-medium">Phone: {addr.phone}</p>
            </CardContent>
          </Card>

          {/* Payments detail tracking */}
          <Card>
            <CardHeader className="py-3 border-b font-medium text-xs text-foreground uppercase bg-muted/40">
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Payment Info
              </span>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold capitalize text-foreground">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Stripe Sandbox
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<OrderDetailsParams>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  
  return (
    <RequireAuth>
      <OrderDetailsContent orderNumber={resolvedParams.orderNumber} />
    </RequireAuth>
  );
}
