'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/features/catalog/use-catalog';

/** Fallbacks keep the storefront complete before category images are configured. */
const categoryImageFallbacks: Record<string, string> = {
  mens: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
  womens: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
  kids: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
  accessories: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
};

const fallbackCategories = [
  { name: "Men's", slug: 'mens' },
  { name: "Women's", slug: 'womens' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Sports', slug: 'sports' },
].map((category) => ({ ...category, image: categoryImageFallbacks[category.slug] }));

export function CategoryShowcase() {
  const { data } = useCategories();
  const categories = data?.length
    ? data.map((category) => ({
        ...category,
        image: category.image || categoryImageFallbacks[category.slug] || categoryImageFallbacks.accessories,
      }))
    : fallbackCategories;

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Shop by category</h2>
          <p className="text-muted-foreground mt-1 text-sm">Find your fit across the collection.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/explore?category=${cat.slug}`}
            className="group border-border relative aspect-[4/5] overflow-hidden rounded-xl border"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
              <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
              <Button variant="secondary" size="sm" className="w-fit">Shop now</Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
