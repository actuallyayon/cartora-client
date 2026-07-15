'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, PackageX } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useCategories, useProduct, useUpdateProduct } from '@/features/catalog/use-catalog';
import { ImageUpload } from '@/features/catalog/components/image-upload';
import { productFormSchema, type ProductFormValues } from '@/features/catalog/product-form.schema';
import type { Product } from '@/features/catalog/catalog.types';

const ADULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const KIDS_SIZES = ['Age 10-11', 'Age 11-12', 'Age 13-14', 'Age 15-16'];

function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const updateProduct = useUpdateProduct();
  const [images, setImages] = React.useState<string[]>(product.images || []);
  const [imageError, setImageError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      category: product.category.id,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
      sku: product.sku,
      stock: product.stock.toString(),
      tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured ?? false,
      isNewArrival: product.isNewArrival ?? false,
      isBestSeller: product.isBestSeller ?? false,
      sizes: product.variants?.filter(v => v.name.toLowerCase() === 'size').map(v => v.value) || [],
    },
  });

  const [isActive, setIsActive] = React.useState(product.isActive);

  const submit = handleSubmit((values) => {
    if (images.length === 0) {
      setImageError('Upload at least one image');
      return;
    }
    setImageError(null);

    updateProduct.mutate(
      {
        id: product.id,
        payload: {
          name: values.name,
          description: values.description,
          category: values.category,
          price: Number(values.price),
          compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
          sku: values.sku,
          stock: Number(values.stock),
          thumbnail: images[0],
          images,
          tags: values.tags
            ? values.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          isFeatured: values.isFeatured,
          isNewArrival: values.isNewArrival,
          isBestSeller: values.isBestSeller,
          variants: values.sizes?.map((sz) => ({ name: 'Size', value: sz })) || [],
          isActive,
        },
      },
      {
        onSuccess: (updated) => {
          toast.success(`“${updated.name}” updated successfully`);
          router.push('/items/manage');
        },
        onError: (error) => {
          const msg = axios.isAxiosError(error)
            ? ((error.response?.data as { message?: string })?.message ??
              'Failed to update product')
            : 'Failed to update product';
          toast.error(msg);
        },
      },
    );
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Modify product details, pricing, and stock.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload value={images} onChange={setImages} />
            {imageError ? <p className="text-destructive mt-2 text-sm">{imageError}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input id="name" placeholder="Classic Cotton Tee" {...register('name')} />
              {errors.name ? (
                <p className="text-destructive text-sm">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe the product…"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                {...register('description')}
              />
              {errors.description ? (
                <p className="text-destructive text-sm">{errors.description.message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  {...register('category')}
                >
                  <option value="">Select a category…</option>
                  {(categories ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category ? (
                  <p className="text-destructive text-sm">{errors.category.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="TEE-001" {...register('sku')} />
                {errors.sku ? (
                  <p className="text-destructive text-sm">{errors.sku.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="24.99"
                  {...register('price')}
                />
                {errors.price ? (
                  <p className="text-destructive text-sm">{errors.price.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare-at ($)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="34.99"
                  {...register('compareAtPrice')}
                />
                {errors.compareAtPrice ? (
                  <p className="text-destructive text-sm">{errors.compareAtPrice.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" min="0" placeholder="50" {...register('stock')} />
                {errors.stock ? (
                  <p className="text-destructive text-sm">{errors.stock.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" placeholder="tshirt, cotton, summer" {...register('tags')} />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold">Available Sizes</h3>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Adult Sizes</Label>
                  <div className="flex flex-wrap gap-3">
                    {ADULT_SIZES.map((sz) => (
                      <label key={sz} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                        <input
                          type="checkbox"
                          value={sz}
                          className="border-input h-4 w-4 rounded accent-primary cursor-pointer"
                          {...register('sizes')}
                        />
                        {sz}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Kids Sizes</Label>
                  <div className="flex flex-wrap gap-3">
                    {KIDS_SIZES.map((sz) => (
                      <label key={sz} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                        <input
                          type="checkbox"
                          value={sz}
                          className="border-input h-4 w-4 rounded accent-primary cursor-pointer"
                          {...register('sizes')}
                        />
                        {sz}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="border-input h-4 w-4 rounded accent-primary"
                    {...register('isFeatured')}
                  />
                  Feature on homepage
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="border-input h-4 w-4 rounded accent-primary"
                    {...register('isNewArrival')}
                  />
                  Mark as New Arrival
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="border-input h-4 w-4 rounded accent-primary"
                    {...register('isBestSeller')}
                  />
                  Mark as Best Seller
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="border-input h-4 w-4 rounded accent-primary"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Publish (make active on storefront)
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateProduct.isPending}>
            {updateProduct.isPending ? <Loader2 className="animate-spin mr-1.5" /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}

function EditProductLoader({ id }: { id: string }) {
  const { data: product, isLoading, isError } = useProduct(id);

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
          The product you are trying to edit does not exist or may have been deleted.
        </p>
      </div>
    );
  }

  return <EditProductForm product={product} />;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Next 16 dynamic route params are a Promise
  const { id } = React.use(params);

  return (
    <RequireAuth role="admin">
      <EditProductLoader id={id} />
    </RequireAuth>
  );
}
