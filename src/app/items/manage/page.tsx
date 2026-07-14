'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Search, Plus, Loader2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useProducts, useDeleteProduct, useCategories } from '@/features/catalog/use-catalog';
import { useDebounce } from '@/hooks/use-debounce';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import axios from 'axios';

function ManageProductsContent() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data: categories } = useCategories();

  const params = {
    search: debouncedSearch || undefined,
    category: category || undefined,
    page,
    limit: 10,
  };

  const { data, isLoading, isError } = useProducts(params);
  const deleteProduct = useDeleteProduct();

  const products = data?.items ?? [];
  const meta = data?.meta;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete “${name}”?`)) return;

    setDeletingId(id);
    deleteProduct.mutate(id, {
      onSuccess: () => {
        toast.success(`Deleted “${name}”`);
        setDeletingId(null);
      },
      onError: (err) => {
        const msg = axios.isAxiosError(err)
          ? ((err.response?.data as { message?: string })?.message ?? `Failed to delete “${name}”`)
          : `Failed to delete “${name}”`;
        toast.error(msg);
        setDeletingId(null);
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Manage products</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add, update, or delete products in the catalog.
          </p>
        </div>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/items/add">
            <Plus className="mr-1.5 h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or SKU…"
            className="pl-9"
          />
        </div>

        <select
          value={category}
          onChange={handleCategoryChange}
          className="border-input bg-background focus-visible:ring-ring h-10 w-full md:w-48 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {(categories ?? []).map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center border rounded-lg bg-card/50 backdrop-blur-sm">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : isError ? (
        <div className="border rounded-lg bg-card p-12 text-center text-muted-foreground">
          Error loading products. Please try again.
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed rounded-lg bg-card p-12 text-center flex flex-col items-center justify-center">
          <Inbox className="text-muted-foreground h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-1 text-sm max-w-sm">
            Try adjusting your search query, selecting another category, or add a new product.
          </p>
          <Button asChild className="mt-4">
            <Link href="/items/add">Add product</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg bg-card/40 backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-xs font-semibold uppercase text-foreground border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4">Product</th>
                  <th scope="col" className="px-6 py-4">SKU</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Stock</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="bg-muted relative h-10 w-10 shrink-0 overflow-hidden rounded border border-border">
                        <Image
                          src={p.thumbnail}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="truncate max-w-[200px] block" title={p.name}>
                        {p.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{p.sku}</td>
                    <td className="px-6 py-4">{p.category.name}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatPrice(p.price, p.currency)}
                    </td>
                    <td className="px-6 py-4">
                      {p.stock <= 0 ? (
                        <span className="text-destructive font-medium">Out of stock</span>
                      ) : p.stock <= 5 ? (
                        <span className="text-amber-500 font-medium">{p.stock} low stock</span>
                      ) : (
                        <span>{p.stock}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-muted-foreground/10 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0" title="Edit">
                          <Link href={`/items/edit/${p.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                          title="Delete"
                          disabled={deletingId === p.id}
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
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

export default function ManageProductsPage() {
  return (
    <RequireAuth role="admin">
      <ManageProductsContent />
    </RequireAuth>
  );
}
