import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Stay up to date with the latest style tips, fabric guides, and Cartora announcements.',
};

const posts = [
  {
    slug: 'choosing-the-right-fabric',
    title: 'How to choose the right fabric for every season',
    excerpt:
      'From breathable linen in summer to insulating merino in winter — a practical breakdown of fabric types and when to wear them.',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-28',
    readTime: '6 min read',
    category: 'Style Guide',
  },
  {
    slug: 'sustainable-fashion-2026',
    title: 'Sustainable fashion in 2026: what actually matters',
    excerpt:
      'Greenwashing is everywhere. We cut through the noise and explain which certifications, materials, and supply chain practices genuinely reduce environmental impact.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-15',
    readTime: '8 min read',
    category: 'Industry',
  },
  {
    slug: 'capsule-wardrobe-essentials',
    title: '10 capsule wardrobe essentials you need this year',
    excerpt:
      'Build a versatile closet with just 10 thoughtfully chosen pieces. We cover colors, fits, and layering strategies that work for any body type.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-30',
    readTime: '5 min read',
    category: 'Tips',
  },
  {
    slug: 'cartora-summer-drop',
    title: 'Cartora Summer Drop: what we launched and why',
    excerpt:
      'A behind-the-scenes look at our newest collection — the design decisions, fabric sourcing, and pricing philosophy behind every piece.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-12',
    readTime: '4 min read',
    category: 'Announcements',
  },
  {
    slug: 'caring-for-premium-cotton',
    title: 'How to wash and care for premium cotton garments',
    excerpt:
      'Proper care doubles the lifespan of your clothes. Learn temperature settings, drying tips, and storage methods to keep your pieces looking fresh.',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
    date: '2026-04-22',
    readTime: '5 min read',
    category: 'Care Guide',
  },
  {
    slug: 'color-matching-guide',
    title: 'The definitive color matching guide for men and women',
    excerpt:
      'Stop guessing which colors go together. This guide covers complementary palettes, neutrals, and accent rules for effortlessly coordinated outfits.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    date: '2026-04-05',
    readTime: '7 min read',
    category: 'Style Guide',
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-14">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          The Cartora Blog
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Style guides, fabric deep-dives, and behind-the-scenes updates from our team.
        </p>
      </div>

      {/* Featured Post */}
      <section className="rounded-xl border bg-card/25 overflow-hidden hover:border-primary/20 transition-colors">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="relative aspect-[16/10] lg:aspect-auto">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10 space-y-4">
            <span className="bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded w-fit">
              {featured.category}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl leading-tight">
              {featured.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(featured.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {featured.readTime}
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-fit text-xs h-8 mt-1" disabled>
              Read Article
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Post Grid */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold tracking-tight text-foreground">Recent articles</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border bg-card/25 overflow-hidden flex flex-col hover:border-primary/20 transition-colors"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-primary font-semibold uppercase tracking-wider">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-2 border-t mt-auto">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(post.date)}
                  </span>
                  <Link
                    href="/blog"
                    className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                  >
                    Read more
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
