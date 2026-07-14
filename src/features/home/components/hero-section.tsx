'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  tag: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  gradient: string;
  highlight?: string;
  displayTitle?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'New season styles just dropped',
    title: 'Discover. Compare. Shop Smarter.',
    description: "Thoughtfully curated apparel for Men, Women, and Kids — plus the accessories that finish the look. Quality you can feel, prices you'll love.",
    primaryCtaText: 'Shop the collection',
    primaryCtaLink: '/explore',
    secondaryCtaText: 'Browse categories',
    secondaryCtaLink: '#categories',
    gradient: 'from-primary/10 via-accent/15 to-transparent',
  },
  {
    id: 2,
    tag: 'Limited Time Coupon offer',
    title: 'Unlock Extra Savings — Up to 15% Off!',
    description: "Apply active promo codes like SAVE10 or FLAT15 during checkout. Enjoy free shipping on all orders over $150.",
    primaryCtaText: 'Explore featured items',
    primaryCtaLink: '/explore?featured=true',
    secondaryCtaText: 'View catalog',
    secondaryCtaLink: '/explore',
    gradient: 'from-emerald-500/10 via-teal-500/10 to-transparent',
    highlight: '15%',
    displayTitle: 'Unlock Extra Savings Up to 15% Off!',
  },
  {
    id: 3,
    tag: 'Premium Quality Essentials',
    title: 'Elevate Your Wardrobe Basics',
    description: 'Discover minimal designs crafted with heavy-cotton fabric and comfortable tailoring. Built to survive seasons.',
    primaryCtaText: 'Shop best sellers',
    primaryCtaLink: '/explore?sort=popular',
    secondaryCtaText: 'Shop categories',
    secondaryCtaLink: '#categories',
    gradient: 'from-amber-500/10 via-orange-500/10 to-transparent',
  },
].filter((slide) => slide.title !== 'Discover. Compare. Shop Smarter.');

export function HeroSection() {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1); // 1 = forward, -1 = backward
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
  }, []);

  React.useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
    startTimer();
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    startTimer();
  };

  const activeSlide = slides[index];
  const slide = {
    ...activeSlide,
    title: activeSlide.displayTitle ?? activeSlide.title,
  };

  return (
    <section className="border-border relative overflow-hidden border-b min-h-[65vh] flex items-center bg-background">
      {/* Decorative gradient wash using current slide's style */}
      <div className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-1000">
        <div className={`absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-br ${slide.gradient} opacity-80`} />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 relative group">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl text-foreground">
              {slide.title === 'Unlock Extra Savings â€” Up to 15% Off!' ? (
                <>
                  Unlock Extra Savings â€” Up to <span className="text-orange-500">15%</span> Off!
                </>
              ) : (
                slide.highlight ? (
                  <>
                    {(slide.displayTitle ?? slide.title).split(slide.highlight)[0]}
                    <span className="text-orange-500">{slide.highlight}</span>
                    {(slide.displayTitle ?? slide.title).split(slide.highlight)[1]}
                  </>
                ) : (
                  slide.title
                )
              )}
            </h1>

            <p className="text-muted-foreground mt-5 max-w-xl text-lg text-pretty leading-relaxed">
              {slide.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row select-none">
              <Button asChild size="lg">
                <Link href={slide.primaryCtaLink}>
                  {slide.primaryCtaText}
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={slide.secondaryCtaLink}>{slide.secondaryCtaText}</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border p-2 rounded-full hidden md:group-hover:flex items-center justify-center transition-all shadow hover:scale-105 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border p-2 rounded-full hidden md:group-hover:flex items-center justify-center transition-all shadow hover:scale-105 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
                startTimer();
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-primary' : 'w-2 bg-muted hover:bg-muted-foreground/30'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
