'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Tag,
  Truck,
  Plus,
  Loader2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { useOptimizeCart } from '@/features/ai/use-ai';
import { useAddToCart } from '@/features/cart/use-cart';
import type { CartItem } from '@/features/cart/cart.types';
import type { AiCartOptimizerResponse, AiProductRecommendation } from '@/features/ai/ai.types';
import { toast } from 'sonner';

interface AiCartOptimizerProps {
  items: CartItem[];
  subtotal: number;
}

export function AiCartOptimizer({ items, subtotal }: AiCartOptimizerProps) {
  const optimizeMutation = useOptimizeCart();
  const addToCart = useAddToCart();
  const [result, setResult] = React.useState<AiCartOptimizerResponse | null>(null);

  const handleOptimize = () => {
    if (items.length === 0) return;

    const payloadItems = items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    optimizeMutation.mutate(
      { items: payloadItems },
      {
        onSuccess: (data) => {
          setResult(data);
          toast.success('Cart optimized with AI insights!');
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to optimize cart');
        },
      },
    );
  };

  const handleAddComplement = (product: AiProductRecommendation) => {
    addToCart.add(product.id, 1);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-5 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Cartora AI Cart Advisor & Synergy Engine
            </h3>
            <p className="text-xs text-muted-foreground">
              Analyze cart synergy, unlock savings promos, and get curated complement recommendations.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleOptimize}
          disabled={optimizeMutation.isPending}
          className="bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-95 text-xs h-9"
        >
          {optimizeMutation.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Analyzing Cart...
            </>
          ) : (
            <>
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              {result ? 'Re-Analyze Cart' : 'Optimize My Cart'}
            </>
          )}
        </Button>
      </div>

      {/* Optimization Result View */}
      {result && !optimizeMutation.isPending && (
        <div className="mt-5 space-y-4 pt-4 border-t border-border animate-in fade-in-50 duration-300">
          {/* Top Score & Vibe Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-background p-3 border border-border flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-extrabold text-sm">
                {result.cartScore}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Synergy Score
                </span>
                <p className="text-xs font-bold text-foreground truncate">
                  {result.cartScore >= 90 ? 'High Cohesion' : 'Good Match'}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-background p-3 border border-border flex items-center gap-3 sm:col-span-2">
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Haul Theme: {result.vibeTitle}
                </span>
                <p className="text-xs text-foreground line-clamp-1">{result.vibeSummary}</p>
              </div>
            </div>
          </div>

          {/* Delivery & Promo Alert */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-muted/40 p-3 border border-border/70 flex items-start gap-2.5 text-xs">
              <Truck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Delivery Status</span>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  {result.freeShippingStatus.tip}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 p-3 border border-border/70 flex items-start gap-2.5 text-xs">
              <Tag className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Savings Tip</span>
                <p className="text-muted-foreground text-[11px] mt-0.5">{result.savingsAdvice}</p>
              </div>
            </div>
          </div>

          {/* Recommended Complements */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    AI Recommended Complements & Pairings
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{result.pairReasoning}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {result.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="group relative flex items-center gap-3 rounded-xl border border-border bg-background p-2.5 transition-all hover:border-primary/50"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40">
                      <Image src={rec.thumbnail} alt={rec.name} fill className="object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${rec.slug}`}
                        className="text-xs font-semibold text-foreground hover:text-primary truncate block transition-colors"
                      >
                        {rec.name}
                      </Link>
                      <p className="text-xs font-bold text-primary">
                        {formatPrice(rec.price, rec.currency)}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleAddComplement(rec)}
                      aria-label="Add complement to cart"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
