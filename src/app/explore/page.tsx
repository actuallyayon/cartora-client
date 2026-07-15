'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PackageOpen, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/features/auth/use-auth';
import { useCategories, useProducts } from '@/features/catalog/use-catalog';
import { ProductCard } from '@/features/catalog/components/product-card';
import { ProductCardSkeleton } from '@/features/catalog/components/product-card-skeleton';
import type { ProductListParams } from '@/features/catalog/catalog.types';

const SORTS: { value: NonNullable<ProductListParams['sort']>; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'popular', label: 'Best selling' },
];

function ExploreContent() {
  const { isAdmin } = useAuth();
  const { data: categories } = useCategories();
  const searchParams = useSearchParams();

  // Seed initial filters from the URL so homepage/category links deep-link in.
  const [search, setSearch] = React.useState(searchParams.get('search') ?? '');
  const [category, setCategory] = React.useState<string>(searchParams.get('category') ?? '');
  const [sort, setSort] = React.useState<ProductListParams['sort']>('newest');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [page, setPage] = React.useState(1);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMin = useDebounce(minPrice, 500);
  const debouncedMax = useDebounce(maxPrice, 500);

  // Any filter change resets to page 1 (done in handlers, not an effect).
  const onSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const onCategory = (slug: string) => {
    setCategory(slug);
    setPage(1);
  };
  const onSort = (v: ProductListParams['sort']) => {
    setSort(v);
    setPage(1);
  };
  const onMin = (v: string) => {
    setMinPrice(v);
    setPage(1);
  };
  const onMax = (v: string) => {
    setMaxPrice(v);
    setPage(1);
  };

  const params: ProductListParams = {
    search: debouncedSearch || undefined,
    category: category || undefined,
    sort,
    minPrice: debouncedMin ? Number(debouncedMin) : undefined,
    maxPrice: debouncedMax ? Number(debouncedMax) : undefined,
    page,
    limit: 12,
    newArrival: searchParams.get('newArrival') === 'true' ? true : undefined,
    bestSeller: searchParams.get('bestSeller') === 'true' ? true : undefined,
  };

  const { data, isLoading, isError } = useProducts(params);
  const products = data?.items ?? [];
  const meta = data?.meta;

  const tabs = [
    { name: 'All', slug: '' },
    ...(categories ?? []).map((c) => ({ name: c.name, slug: c.slug })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Explore</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse the collection. Filter by category, price, and more.
        </p>
      </header>

      {/* Category tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.slug || 'all'}
            type="button"
            onClick={() => onCategory(tab.slug)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              category === tab.slug
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Controls: search, price, sort */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="text-muted-foreground flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => onMin(e.target.value)}
            placeholder="Min $"
            className="w-24"
          />
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => onMax(e.target.value)}
            placeholder="Max $"
            className="w-24"
          />
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as ProductListParams['sort'])}
            className="border-input bg-background focus-visible:ring-ring h-10 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Sort products"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="border-border bg-card text-muted-foreground rounded-lg border p-10 text-center text-sm">
          Something went wrong loading products. Please try again.
        </div>
      ) : products.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center rounded-lg border border-dashed p-12 text-center">
          <PackageOpen className="text-muted-foreground h-10 w-10" />
          <h3 className="mt-3 font-medium">No products found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            {isAdmin
              ? 'Your catalog is empty. Add your first product to see it here.'
              : 'Try adjusting your filters or check back soon.'}
          </p>
          {isAdmin ? (
            <Button asChild className="mt-4">
              <Link href="/items/add">Add a product</Link>
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {meta && meta.totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  );
}
