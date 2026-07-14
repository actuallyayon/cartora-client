import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Cartora, our mission, values, and team.',
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Uncompromised quality',
    description: 'We source only premium long-staple cotton and heavy blend fibers, ensuring everything in our collection survives seasons.',
  },
  {
    icon: Heart,
    title: 'Customer-first comparison',
    description: 'We enable shoppers to benchmark metrics, ratings, prices, and specifications to select exactly what works.',
  },
  {
    icon: Sparkles,
    title: 'Ethical manufacturing',
    description: 'Our partner mills follow strict safety audits and pay living wages, ensuring our apparel feels good in every way.',
  },
  {
    icon: Award,
    title: 'Radical pricing transparency',
    description: 'By selling directly online, we skip retail markups, bringing you top-tier quality at fair margins.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12">
      {/* Intro Hero Section */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Discover. Compare. <span className="text-primary">Shop Smarter.</span>
        </h1>
        <p className="text-muted-foreground mt-5 text-base sm:text-lg leading-relaxed text-pretty">
          At Cartora, we believe buying everyday apparel should be direct, straightforward, and satisfying.
          We bridge the gap between premium multi-vendor catalogs and customers, giving you a beautiful marketplace to compare, choose, and love what you wear.
        </p>
      </section>

      {/* Brand Story */}
      <section className="bg-muted/30 border-y border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Cartora design workshop brainstorming session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6">
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">Our Story</span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Redefining the online closet
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Cartora was founded in 2026 out of frustration with modern fast-fashion.
                We noticed e-commerce stores were either filled with cheap fabrics that disintegrated after three washes, or high-end brands hiding their production margins.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We set out to build a clean multi-vendor dashboard with zero placeholder codes, real checkout integrations, transparent user reviews, and durable specifications.
                Every piece in our catalog goes through structural inspection before reaching your closet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Our core values</h2>
          <p className="text-muted-foreground text-sm">
            What guides our design and vendor decisions day in and day out.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="rounded-xl border bg-card/45 p-6 hover:border-primary/20 transition-colors space-y-4">
                <div className="bg-primary/10 p-2.5 rounded-lg text-primary w-fit">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{v.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-primary-foreground rounded-2xl px-6 py-12 text-center sm:px-12 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Experience the Cartora difference
          </h2>
          <p className="text-primary-foreground/90 mx-auto mt-3 max-w-lg text-sm">
            Browse our catalog, check ratings, specify your colors, and order today with secure checkout.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6 text-xs h-9">
            <Link href="/explore">
              Start Shopping
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
