'use client';

import * as React from 'react';
import Image from 'next/image';
import { Loader2, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/features/catalog/components/image-upload';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useCategories, useUpdateCategory } from '@/features/catalog/use-catalog';
import type { Category } from '@/features/catalog/catalog.types';

function CategoryEditor({ category }: { category: Category }) {
  const updateCategory = useUpdateCategory();
  const [image, setImage] = React.useState(category.image ? [category.image] : []);

  const save = () => {
    if (!image[0]) {
      toast.error('Please upload a category image first.');
      return;
    }

    updateCategory.mutate(
      { id: category.id, payload: { image: image[0] } },
      {
        onSuccess: () => toast.success(`${category.name} image updated.`),
        onError: (error) => {
          const message = axios.isAxiosError(error)
            ? ((error.response?.data as { message?: string })?.message ?? 'Unable to update category image.')
            : 'Unable to update category image.';
          toast.error(message);
        },
      },
    );
  };

  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <div className="relative aspect-[16/7] bg-muted">
        {image[0] ? <Image src={image[0]} alt={category.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : null}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <h2 className="font-semibold">{category.name}</h2>
          <p className="text-muted-foreground text-sm">{category.description || 'No description'}</p>
        </div>
        <ImageUpload value={image} onChange={setImage} max={1} />
        <Button onClick={save} disabled={updateCategory.isPending} className="w-full">
          {updateCategory.isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Save image
        </Button>
      </div>
    </article>
  );
}

function ManageCategoriesContent() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Manage category images</h1>
        <p className="text-muted-foreground mt-1 text-sm">Upload an image and save it to change the corresponding homepage category card.</p>
      </div>
      {isLoading ? <div className="flex min-h-64 items-center justify-center"><Loader2 className="text-primary h-8 w-8 animate-spin" /></div> : null}
      {isError ? <p className="rounded-lg border p-6 text-muted-foreground">Could not load categories. Please try again.</p> : null}
      {categories?.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <CategoryEditor key={`${category.id}-${category.image || ''}`} category={category} />)}</div> : null}
    </div>
  );
}

export default function ManageCategoriesPage() {
  return <RequireAuth role="admin"><ManageCategoriesContent /></RequireAuth>;
}
