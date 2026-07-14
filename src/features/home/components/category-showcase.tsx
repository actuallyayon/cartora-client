import Image from 'next/image';
import Link from 'next/link';

/** The four apparel categories with real imagery, deep-linking into Explore. */
const categories = [
  {
    name: "Men's",
    slug: 'mens',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: "Women's",
    slug: 'womens',
    image:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kids',
    slug: 'kids',
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image:
      'https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sports',
    slug: 'sports',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  },
];

export function CategoryShowcase() {
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
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
              <span className="text-sm text-white/80 group-hover:underline">Shop now →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
