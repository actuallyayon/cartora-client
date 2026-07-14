'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/features/catalog/use-catalog';
import { ProductCard } from '@/features/catalog/components/product-card';
import { ProductCardSkeleton } from '@/features/catalog/components/product-card-skeleton';
import type { ProductListParams } from '@/features/catalog/catalog.types';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  params: ProductListParams;
  viewAllHref?: string;
}

/** A titled horizontal-feeling grid of products, backed by a live query. */
export function ProductSection({ title, subtitle, params, viewAllHref }: ProductSectionProps) {
  const { data, isLoading } = useProducts({ limit: 4, ...params });
  const products = data?.items ?? [];

  // Hide the section entirely if there's genuinely nothing to show.
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle ? <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p> : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-primary inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
