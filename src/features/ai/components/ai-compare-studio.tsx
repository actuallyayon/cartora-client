'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  X,
  Check,
  AlertCircle,
  Trophy,
  ShoppingCart,
  Loader2,
  RefreshCw,
  Search,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Star,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts, useCategories } from '@/features/catalog/use-catalog';
import { useCompareProducts } from '@/features/ai/use-ai';
import { useAddToCart } from '@/features/cart/use-cart';
import { useAuth } from '@/features/auth/use-auth';
import type { Product } from '@/features/catalog/catalog.types';
import type {
  AiComparisonProduct,
  AiProductComparisonResponse,
} from '@/features/ai/ai.types';
import { toast } from 'sonner';

interface AiCompareStudioProps {
  initialProductIds?: string[];
}

export function AiCompareStudio({ initialProductIds = [] }: AiCompareStudioProps) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const compareMutation = useCompareProducts();

  const { data: categoriesData } = useCategories();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [userPriority, setUserPriority] = React.useState('');
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>(initialProductIds);
  const [showPickerSlot, setShowPickerSlot] = React.useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = React.useState<AiProductComparisonResponse | null>(null);

  // Fetch catalog products to pick from
  const { data: productsData, isLoading: isLoadingCatalog } = useProducts({
    limit: 60,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery || undefined,
  });

  const availableProducts = productsData?.items || [];

  // Initialize comparison if initialProductIds provided
  const hasInitializedRef = React.useRef(false);
  React.useEffect(() => {
    if (
      !hasInitializedRef.current &&
      initialProductIds.length > 0 &&
      selectedProductIds.length > 0
    ) {
      hasInitializedRef.current = true;
      runComparison(initialProductIds);
    }
  }, [initialProductIds]);

  const handleSelectProduct = (product: Product) => {
    if (selectedProductIds.includes(product.id) || selectedProductIds.includes(product.slug)) {
      toast.info('Product is already in the comparison list');
      return;
    }
    if (selectedProductIds.length >= 4) {
      toast.error('You can compare a maximum of 4 products at once');
      return;
    }
    setSelectedProductIds((prev) => [...prev, product.id]);
    setShowPickerSlot(false);
  };

  const handleRemoveProduct = (productIdOrSlug: string) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productIdOrSlug));
    if (comparisonResult) {
      // Clear or update results if items change
      setComparisonResult(null);
    }
  };

  const handleQuickPreset = (presetIds: string[]) => {
    setSelectedProductIds(presetIds);
    setShowPickerSlot(false);
    runComparison(presetIds);
  };

  const runComparison = (idsToCompare = selectedProductIds) => {
    if (idsToCompare.length < 2) {
      toast.error('Please select at least 2 products to compare');
      return;
    }

    compareMutation.mutate(
      {
        productIds: idsToCompare,
        userPriority: userPriority.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          setComparisonResult(data);
          toast.success('AI Comparison Matrix ready!');
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to generate comparison');
        },
      },
    );
  };

  const handleAddToCart = (product: AiComparisonProduct) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to cart');
      return;
    }
    addToCart.add(product.id, 1);
  };

  // Find badge for a product
  const getBadgeForProduct = (productId: string) => {
    if (!comparisonResult?.winnerBadges) return null;
    return comparisonResult.winnerBadges.find((b) => b.productId === productId);
  };

  // Find breakdown for a product
  const getBreakdownForProduct = (productId: string) => {
    if (!comparisonResult?.productBreakdowns) return null;
    return comparisonResult.productBreakdowns.find((b) => b.productId === productId);
  };

  return (
    <div className="space-y-10">
      {/* Selection Control Bar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Sparkles className="h-5 w-5 text-primary" />
              Selected Items for Comparison
              <span className="text-xs font-normal text-muted-foreground">
                ({selectedProductIds.length}/4 selected)
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Select 2 to 4 products to compare specs, value, customer sentiment, and AI winner breakdown.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Auto-pick 3 diverse items from available products
                if (availableProducts.length >= 2) {
                  const sample = availableProducts.slice(0, 3).map((p) => p.id);
                  handleQuickPreset(sample);
                } else {
                  toast.info('Not enough catalog products found for preset');
                }
              }}
              className="text-xs"
            >
              <Flame className="mr-1.5 h-3.5 w-3.5 text-orange-500" />
              Auto-Select Bestsellers
            </Button>
            {selectedProductIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProductIds([]);
                  setComparisonResult(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Selected Product Slots */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[0, 1, 2, 3].map((index) => {
            const currentId = selectedProductIds[index];
            const product =
              comparisonResult?.products.find(
                (p) => p.id === currentId || p.slug === currentId,
              ) ||
              availableProducts.find(
                (p) => p.id === currentId || p.slug === currentId,
              );

            if (product) {
              return (
                <div
                  key={currentId || index}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/50"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(currentId)}
                    className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted border border-border/50">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground truncate">
                        {'categoryName' in product && product.categoryName
                          ? product.categoryName
                          : 'category' in product && (product as Product).category?.name
                            ? (product as Product).category.name
                            : 'General'}
                      </p>
                      <h4 className="text-xs font-semibold text-foreground line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="mt-1 text-xs font-bold text-primary">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => setShowPickerSlot(true)}
                className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Add Product {index + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Priority Filter / Custom Prompt */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={userPriority}
              onChange={(e) => setUserPriority(e.target.value)}
              placeholder="What matters most to you? (e.g. durability, gym use, best value under $50...)"
              className="pl-9 text-xs"
            />
          </div>
          <Button
            size="default"
            disabled={selectedProductIds.length < 2 || compareMutation.isPending}
            onClick={() => runComparison()}
            className="bg-primary text-primary-foreground font-semibold shadow-md hover:opacity-95"
          >
            {compareMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating with AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Run AI Versus Matrix
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Selection Drawer / Catalog Modal */}
      {showPickerSlot && (
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-lg animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Browse & Add Products to Compare
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPickerSlot(false)}
              className="text-muted-foreground hover:text-foreground text-xs font-semibold px-2 py-1 rounded hover:bg-muted"
            >
              Close
            </button>
          </div>

          {/* Filter Bar */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or tag..."
                className="pl-8 text-xs h-9"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-full border font-medium transition-colors',
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border',
                )}
              >
                All
              </button>
              {categoriesData?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-full border font-medium transition-colors',
                    selectedCategory === cat.slug
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border',
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-4 max-h-80 overflow-y-auto pr-1">
            {isLoadingCatalog ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-xs">Loading store catalog...</span>
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No products found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {availableProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id) || selectedProductIds.includes(p.slug);
                  return (
                    <div
                      key={p.id}
                      onClick={() => !isSelected && handleSelectProduct(p)}
                      className={cn(
                        'group flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 opacity-60 cursor-not-allowed'
                          : 'border-border bg-background hover:border-primary/60 hover:shadow-sm',
                      )}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image src={p.thumbnail} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium text-foreground truncate group-hover:text-primary">
                          {p.name}
                        </p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          {formatPrice(p.price, p.currency)}
                        </p>
                        {isSelected && (
                          <span className="inline-flex items-center text-[10px] text-primary font-medium">
                            <Check className="h-3 w-3 mr-0.5" /> Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Scanning Pulse Animation */}
      {compareMutation.isPending && (
        <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/5 via-card to-background p-10 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">
            Gemini AI is analyzing specifications & real customer reviews...
          </h3>
          <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
            Cross-referencing build materials, value propositions, sizing metrics, and verified feedback across {selectedProductIds.length} items.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResult && !compareMutation.isPending && (
        <div className="space-y-10 animate-in fade-in-50 duration-300">
          {/* Executive Verdict Glow Card */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-6 md:p-8 shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  AI Executive Comparison Summary
                </div>
                <h3 className="text-lg font-bold text-foreground md:text-xl">
                  {comparisonResult.verdict}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comparisonResult.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Product Cards Grid */}
          <div>
            <h3 className="mb-4 text-base font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Side-by-Side Product Overview
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {comparisonResult.products.map((product) => {
                const badge = getBadgeForProduct(product.id);
                const breakdown = getBreakdownForProduct(product.id);

                return (
                  <div
                    key={product.id}
                    className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    {/* Winner Badge */}
                    {badge && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Trophy className="h-3.5 w-3.5" />
                          {badge.badgeTitle}
                        </span>
                        <p className="mt-1 text-[11px] text-muted-foreground">{badge.reason}</p>
                      </div>
                    )}

                    {/* Image & Main Info */}
                    <div>
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted border border-border/50">
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                        <Link
                          href={`/products/${product.slug}`}
                          className="mt-1 font-bold text-foreground hover:text-primary line-clamp-2 transition-colors text-sm"
                        >
                          {product.name}
                        </Link>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-extrabold text-foreground">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price ? (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice, product.currency)}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* AI Overall Score */}
                      {breakdown?.overallScore ? (
                        <div className="mt-4 rounded-lg bg-muted/40 p-3 border border-border/40">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-muted-foreground">AI Match Score</span>
                            <span className="text-primary font-bold">{breakdown.overallScore}/100</span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                              style={{ width: `${breakdown.overallScore}%` }}
                            />
                          </div>
                          {breakdown.bestFor && (
                            <p className="mt-2 text-[11px] text-muted-foreground">
                              <span className="font-semibold text-foreground">Ideal for: </span>
                              {breakdown.bestFor}
                            </p>
                          )}
                        </div>
                      ) : null}

                      {/* Pros & Cons */}
                      {breakdown && (
                        <div className="mt-4 space-y-3 text-xs">
                          <div>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Key Strengths:
                            </span>
                            <ul className="mt-1 space-y-1">
                              {breakdown.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                                  <Check className="h-3 w-3 flex-shrink-0 text-emerald-500 mt-0.5" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {breakdown.cons.length > 0 && (
                            <div>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                Considerations:
                              </span>
                              <ul className="mt-1 space-y-1">
                                {breakdown.cons.map((con, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                                    <AlertCircle className="h-3 w-3 flex-shrink-0 text-amber-500 mt-0.5" />
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <Button
                        size="sm"
                        className="w-full text-xs font-semibold"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dimensional Matrix Scorecard */}
          {comparisonResult.dimensions.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Dimensional Feature & Performance Matrix
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                In-depth scores (1-10) calculated based on hardware specifications, material tiers, and customer feedback.
              </p>

              <div className="mt-6 space-y-6">
                {comparisonResult.dimensions.map((dim, i) => (
                  <div key={i} className="rounded-xl bg-muted/20 p-4 border border-border/60">
                    <div className="mb-3">
                      <h4 className="text-xs font-bold text-foreground">{dim.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{dim.description}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {dim.scores.map((s) => {
                        const product = comparisonResult.products.find((p) => p.id === s.productId);
                        return (
                          <div key={s.productId} className="rounded-lg bg-background p-3 border border-border/50">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-semibold text-foreground truncate max-w-[130px]">
                                {product?.name || 'Product'}
                              </span>
                              <span className="font-extrabold text-primary">{s.score}/10</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(s.score / 10) * 100}%` }}
                              />
                            </div>
                            {s.note && (
                              <p className="mt-2 text-[10px] text-muted-foreground">{s.note}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Differences Bullet Points */}
          {comparisonResult.keyDifferences.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Key Deciding Factors & Trade-offs
              </h3>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                {comparisonResult.keyDifferences.map((diff, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
