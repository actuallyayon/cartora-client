'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/features/catalog/use-catalog';
import { ProductDetail } from '@/features/catalog/components/product-detail';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Next 16: route params are a Promise; unwrap with React.use().
  const { slug } = React.use(params);
  const { data: product, isLoading, isError } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <PackageX className="text-muted-foreground h-10 w-10" />
        <h1 className="mt-3 text-lg font-medium">Product not found</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          This product may have been removed or is no longer available.
        </p>
        <Button asChild className="mt-4">
          <Link href="/explore">Back to Explore</Link>
        </Button>
      </div>
    );
  }

  return <ProductDetail key={product.id} product={product} />;
}
