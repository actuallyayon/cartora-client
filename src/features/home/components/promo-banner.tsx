import Link from 'next/link';
import { Button } from '@/components/ui/button';

/** Sale CTA band linking to the discounted end of the catalog. */
export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="promo-banner bg-primary text-primary-foreground relative overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-12">
        <div className="promo-banner-orb promo-banner-orb-top pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="promo-banner-orb promo-banner-orb-bottom pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" />
        <p className="text-primary-foreground/80 text-sm font-medium tracking-wide uppercase">
          Limited time
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Seasonal sale — up to 33% off
        </h2>
        <p className="text-primary-foreground/90 mx-auto mt-3 max-w-lg">
          Refresh your wardrobe with markdowns across tees, hoodies, and accessories.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-6">
          <Link href="/explore?sort=price-asc">Shop the sale</Link>
        </Button>
      </div>
    </section>
  );
}
