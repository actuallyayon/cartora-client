import type { Metadata } from 'next';
import { HeroSection } from '@/features/home/components/hero-section';
import { ValueProps } from '@/features/home/components/value-props';
import { CategoryShowcase } from '@/features/home/components/category-showcase';
import { ProductSection } from '@/features/home/components/product-section';
import { PromoBanner } from '@/features/home/components/promo-banner';
import { Newsletter } from '@/features/home/components/newsletter';

export const metadata: Metadata = {
  title: 'Cartora — Discover. Compare. Shop Smarter.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueProps />
      <CategoryShowcase />
      <ProductSection
        title="Featured products"
        subtitle="Hand-picked favorites from the collection."
        params={{ featured: true, limit: 4 }}
        viewAllHref="/explore"
      />
      <PromoBanner />
      <ProductSection
        title="New arrivals"
        subtitle="Fresh off the rack."
        params={{ newArrival: true, limit: 4 }}
        viewAllHref="/explore?newArrival=true"
      />
      <ProductSection
        title="Best sellers"
        subtitle="What everyone's loving right now."
        params={{ bestSeller: true, limit: 4 }}
        viewAllHref="/explore?bestSeller=true"
      />
      <Newsletter />
    </>
  );
}
