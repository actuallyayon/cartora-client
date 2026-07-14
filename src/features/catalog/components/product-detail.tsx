'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, Heart, Loader2, Minus, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatPrice, discountPercent } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/use-auth';
import { useAddToCart } from '@/features/cart/use-cart';
import { useToggleWishlist, useWishlistIds } from '@/features/wishlist/use-wishlist';
import { ProductCard } from '@/features/catalog/components/product-card';
import { useRelatedProducts } from '@/features/catalog/use-catalog';
import type { Product } from '@/features/catalog/catalog.types';
import { ProductReviews } from '@/features/reviews/components/product-reviews';

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: wishlistIds } = useWishlistIds();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();
  const { data: related } = useRelatedProducts(product.slug);

  const gallery = [product.thumbnail, ...product.images.filter((u) => u !== product.thumbnail)];
  const [active, setActive] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [showChart, setShowChart] = React.useState(false);

  const categoryName = product.category?.name?.toLowerCase() || '';
  const categorySlug = product.category?.slug?.toLowerCase() || '';
  const isKids = categoryName.includes('kids') || categorySlug.includes('kids') || product.tags.includes('kids');
  const isClothing = isKids || ['mens', 'womens'].includes(categorySlug) || 
    product.tags.some(tag => ['tshirt', 'jacket', 'pants', 'hoodie', 'sweater', 'top', 'dress', 'clothing', 'apparel'].includes(tag.toLowerCase()));

  // Admin's explicitly selected sizes
  const availableSizes = product.variants
    ?.filter((v) => v.name.toLowerCase() === 'size')
    .map((v) => v.value) || [];
  
  // All possible sizes to render
  const allSizes = isClothing
    ? isKids
      ? ['Age 10-11', 'Age 11-12', 'Age 13-14', 'Age 15-16']
      : ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
    : [];

  const [selectedSize, setSelectedSize] = React.useState<string | null>(
    availableSizes.length > 0 ? availableSizes[0] : (allSizes[0] || null)
  );

  const wished = wishlistIds?.includes(product.id) ?? false;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      toast.info('Please sign in to continue');
      router.push(`/login?redirect=/products/${product.slug}`);
      return false;
    }
    return true;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="border-border bg-muted relative aspect-square overflow-hidden rounded-xl border">
            <Image
              src={gallery[active]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {discount > 0 ? (
              <span className="bg-destructive text-destructive-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-sm font-semibold">
                -{discount}%
              </span>
            ) : null}
          </div>
          {gallery.length > 1 ? (
            <div className="mt-3 flex gap-2">
              {gallery.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    'relative h-16 w-16 overflow-hidden rounded-md border-2',
                    active === i ? 'border-primary' : 'border-transparent',
                  )}
                >
                  <Image
                    src={url}
                    alt={`View ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div>
          <p className="text-muted-foreground text-sm">{product.category?.name}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {product.rating.count > 0 ? (
              <span className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {product.rating.average.toFixed(1)}
                <span className="text-muted-foreground">({product.rating.count})</span>
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">No reviews yet</span>
            )}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">{product.soldCount} sold</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(product.price, product.currency)}
            </span>
            {discount > 0 && product.compareAtPrice ? (
              <span className="text-muted-foreground text-lg line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            ) : null}
          </div>

          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            {outOfStock ? (
              <span className="text-destructive font-medium">Out of stock</span>
            ) : (
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-500">
                <Check className="h-4 w-4" /> In stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Size Selector */}
          {allSizes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Size</h2>
                <button
                  type="button"
                  onClick={() => setShowChart(true)}
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Size Chart
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {allSizes.map((sz) => {
                  const isAvailable = availableSizes.length === 0 || availableSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(sz)}
                      className={cn(
                        'border-border relative flex min-w-[3rem] h-11 items-center justify-center rounded-md border px-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                        isAvailable ? 'hover:bg-muted' : 'opacity-40 cursor-not-allowed line-through',
                        selectedSize === sz && isAvailable
                          ? 'border-primary ring-2 ring-primary ring-offset-2 bg-primary/5 text-primary font-semibold'
                          : 'bg-background text-foreground'
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="border-border flex items-center rounded-md border">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="text-muted-foreground hover:text-foreground flex h-11 w-11 items-center justify-center disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={qty >= product.stock}
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="text-muted-foreground hover:text-foreground flex h-11 w-11 items-center justify-center disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              disabled={outOfStock || addToCart.isPending}
              onClick={() => {
                if (!requireAuth()) return;
                addToCart.add(
                  product.id,
                  qty,
                  selectedSize ? { name: 'Size', value: selectedSize } : undefined
                );
              }}
            >
              {addToCart.isPending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
              Add to cart
            </Button>

            <Button
              size="lg"
              variant="outline"
              aria-label="Toggle wishlist"
              onClick={() => {
                if (!requireAuth()) return;
                toggleWishlist.mutate({ productId: product.id, wished });
              }}
            >
              <Heart className={cn('h-5 w-5', wished && 'fill-destructive text-destructive')} />
            </Button>
          </div>

          <div className="border-border bg-card text-muted-foreground mt-6 flex items-center gap-2 rounded-lg border p-3 text-sm">
            <Truck className="h-4 w-4" />
            Free delivery on orders over $50 · easy 30-day returns
          </div>

          {/* Specs */}
          {product.specs.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold">Specifications</h2>
              <dl className="divide-border border-border mt-2 divide-y rounded-lg border">
                {product.specs.map((spec) => (
                  <div key={spec.key} className="flex justify-between px-4 py-2 text-sm">
                    <dt className="text-muted-foreground">{spec.key}</dt>
                    <dd className="font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related */}
      {related && related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Size Chart Modal */}
      {showChart && (
        <div 
          onClick={() => setShowChart(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-xl bg-card shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-4 bg-muted/20">
              <h3 className="text-lg font-semibold text-foreground">
                {isKids ? "Kids T-shirt Size Chart (Age 10-16)" : "Size Chart Reference (Inches)"}
              </h3>
              <button
                type="button"
                onClick={() => setShowChart(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-all"
              >
                &times;
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid gap-6 md:grid-cols-2 items-center">
                <div className="order-2 md:order-1 overflow-x-auto">
                  {isKids ? (
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="p-3 font-semibold">Size (Age)</th>
                          <th className="p-3 font-semibold">Chest (in)</th>
                          <th className="p-3 font-semibold">Length (in)</th>
                          <th className="p-3 font-semibold">Shoulder (in)</th>
                          <th className="p-3 font-semibold">Sleeve (Half)</th>
                          <th className="p-3 font-semibold">Sleeve (Full)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">Age 10-11</td>
                          <td className="p-3">31</td>
                          <td className="p-3">23</td>
                          <td className="p-3">13.5</td>
                          <td className="p-3">6</td>
                          <td className="p-3">18</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">Age 11-12</td>
                          <td className="p-3">32</td>
                          <td className="p-3">25</td>
                          <td className="p-3">14</td>
                          <td className="p-3">6.5</td>
                          <td className="p-3">18.5</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">Age 13-14</td>
                          <td className="p-3">34</td>
                          <td className="p-3">26</td>
                          <td className="p-3">14.5</td>
                          <td className="p-3">7</td>
                          <td className="p-3">18.5</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">Age 15-16</td>
                          <td className="p-3">36</td>
                          <td className="p-3">27</td>
                          <td className="p-3">15</td>
                          <td className="p-3">7</td>
                          <td className="p-3">19</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="p-3 font-semibold">Size</th>
                          <th className="p-3 font-semibold">Chest (in)</th>
                          <th className="p-3 font-semibold">Length (in)</th>
                          <th className="p-3 font-semibold">Sleeve (in)</th>
                          <th className="p-3 font-semibold">Shoulder (in)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">XS (34)</td>
                          <td className="p-3">34</td>
                          <td className="p-3">24</td>
                          <td className="p-3">7.5</td>
                          <td className="p-3">15.5</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">S (36)</td>
                          <td className="p-3">36</td>
                          <td className="p-3">25</td>
                          <td className="p-3">8</td>
                          <td className="p-3">16</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">M (38)</td>
                          <td className="p-3">38</td>
                          <td className="p-3">26</td>
                          <td className="p-3">8</td>
                          <td className="p-3">17</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">L (40)</td>
                          <td className="p-3">40</td>
                          <td className="p-3">27</td>
                          <td className="p-3">8.5</td>
                          <td className="p-3">17.5</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">XL (42)</td>
                          <td className="p-3">42</td>
                          <td className="p-3">28</td>
                          <td className="p-3">8.5</td>
                          <td className="p-3">18</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">2XL (44)</td>
                          <td className="p-3">44</td>
                          <td className="p-3">29</td>
                          <td className="p-3">9</td>
                          <td className="p-3">19</td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="p-3 font-medium">3XL (46)</td>
                          <td className="p-3">46</td>
                          <td className="p-3">30</td>
                          <td className="p-3">10</td>
                          <td className="p-3">20</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* SVG Illustration */}
                <div className="order-1 md:order-2 flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
                  <svg width="180" height="180" viewBox="0 0 200 200" className="text-muted-foreground fill-none stroke-current" strokeWidth="2">
                    {/* T-shirt path */}
                    <path d="M 50,40 C 65,37 80,45 100,45 C 120,45 135,37 150,40 L 190,70 L 165,95 L 150,90 L 150,170 L 50,170 L 50,90 L 35,95 L 10,70 Z" className="stroke-foreground/30 fill-muted/10" />
                    
                    {/* Shoulder Line */}
                    <line x1="50" y1="40" x2="150" y2="40" stroke="#f97316" strokeDasharray="3,3" />
                    <text x="100" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f97316">Shoulder</text>
                    
                    {/* Chest Line */}
                    <line x1="50" y1="85" x2="150" y2="85" stroke="#f97316" strokeDasharray="3,3" />
                    <text x="100" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f97316">Chest</text>
                    
                    {/* Length Line */}
                    <line x1="156" y1="40" x2="156" y2="170" stroke="#f97316" strokeDasharray="3,3" />
                    <text x="168" y="110" textAnchor="start" fontSize="10" fontWeight="bold" fill="#f97316">Length</text>
                    
                    {/* Sleeve Line */}
                    <line x1="50" y1="40" x2="30" y2="80" stroke="#f97316" strokeDasharray="3,3" />
                    <text x="23" y="55" textAnchor="end" fontSize="10" fontWeight="bold" fill="#f97316">Sleeve</text>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Note: +/- 3% measurement tolerance is permissible. All measurements are in inches.
              </p>
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end border-t p-4 bg-muted/20">
              <Button type="button" onClick={() => setShowChart(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

