'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2, Inbox, Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useAdminOrders, useUpdateOrderStatus } from '@/features/orders/use-orders';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import axios from 'axios';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

function AdminOrdersContent() {
  const [status, setStatus] = React.useState<string>('');
  const [page, setPage] = React.useState(1);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const { data, isLoading, isError } = useAdminOrders({
    status: status || undefined,
    page,
    limit: 10,
  });

  const updateStatusMutation = useUpdateOrderStatus();

  const orders = data?.items ?? [];
  const meta = data?.meta;

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string, orderNumber: string) => {
    setUpdatingId(orderId);
    updateStatusMutation.mutate(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order ${orderNumber} updated to “${newStatus}”`);
          setUpdatingId(null);
        },
        onError: (err) => {
          const msg = axios.isAxiosError(err)
            ? ((err.response?.data as { message?: string })?.message ?? 'Failed to update order status')
            : 'Failed to update order status';
          toast.error(msg);
          setUpdatingId(null);
        },
      }
    );
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled':
        return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPaymentColor = (s: string) => {
    switch (s) {
      case 'paid':
        return 'text-emerald-500 font-semibold';
      case 'pending':
        return 'text-amber-500 font-medium';
      case 'failed':
        return 'text-destructive font-semibold';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <Button asChild size="sm" variant="ghost" className="h-8 p-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Manage orders</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View platform transactions, process shipments, and track fulfillment status.
          </p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
        <select
          value={status}
          onChange={handleStatusFilterChange}
          className="border-input bg-background focus-visible:ring-ring h-10 w-full md:w-48 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Filter by order status"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="capitalize">
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Table view */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center border rounded-lg bg-card/50 backdrop-blur-sm">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : isError ? (
        <div className="border rounded-lg bg-card p-12 text-center text-muted-foreground">
          Error loading orders. Please try again.
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-dashed rounded-lg bg-card p-12 text-center flex flex-col items-center justify-center">
          <Inbox className="text-muted-foreground h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground mt-1 text-sm max-w-sm">
            No transactions match your current status filters or there have been no sales yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg bg-card/40 backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-xs font-semibold uppercase text-foreground border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4">Order</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Payment</th>
                  <th scope="col" className="px-6 py-4">Total</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => {
                  const dateStr = new Date(o.placedAt || o.createdAt).toLocaleDateString('en-US', {
                    dateStyle: 'medium',
                  });

                  return (
                    <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-foreground font-semibold">
                        {o.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground font-medium flex items-center gap-1.5 text-xs">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {o.user?.name || 'Guest User'}
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5">{o.user?.email || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {dateStr}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs capitalize">
                        <span className={getPaymentColor(o.paymentStatus)}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${getStatusColor(o.orderStatus)}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {updatingId === o.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary mr-3" />
                          ) : (
                            <select
                              value={o.orderStatus}
                              disabled={updatingId === o.id || o.orderStatus === 'cancelled'}
                              onChange={(e) => handleStatusUpdate(o.id, e.target.value, o.orderNumber)}
                              className="border-input bg-background focus-visible:ring-ring h-8 rounded border px-2 text-xs focus-visible:ring-2 focus-visible:outline-none capitalize disabled:opacity-40"
                              aria-label="Update order status"
                            >
                              {STATUS_OPTIONS.map((statusVal) => (
                                <option key={statusVal} value={statusVal} className="capitalize">
                                  {statusVal}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 ? (
            <div className="border-t border-border flex items-center justify-between px-6 py-4">
              <div className="text-muted-foreground text-xs">
                Showing page {meta.page} of {meta.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <RequireAuth role="admin">
      <AdminOrdersContent />
    </RequireAuth>
  );
}
