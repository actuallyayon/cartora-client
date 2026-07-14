'use client';

import * as React from 'react';
import Link from 'next/link';
import { Star, Loader2, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/use-auth';
import {
  useProductReviews,
  useCreateReview,
  useDeleteReview,
} from '@/features/reviews/use-reviews';
import { toast } from 'sonner';
import axios from 'axios';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = React.useState(1);

  // Form states
  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState<string>('');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Query reviews
  const { data, isLoading, isError } = useProductReviews(productId, { page, limit: 5 });
  
  // Mutations
  const createReviewMutation = useCreateReview(productId);
  const deleteReviewMutation = useDeleteReview(productId);

  const reviews = data?.items ?? [];
  const meta = data?.meta;

  // Check if current user has already left a review
  const hasReviewed = React.useMemo(() => {
    if (!user || !data?.items) return false;
    return data.items.some((r) => r.user.id === user.id);
  }, [data, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.length < 3) {
      toast.error('Please enter a review comment (minimum 3 characters).');
      return;
    }

    createReviewMutation.mutate(
      {
        product: productId,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          toast.success('Thank you! Review submitted successfully.');
          setComment('');
          setRating(5);
        },
        onError: (err) => {
          const msg = axios.isAxiosError(err)
            ? ((err.response?.data as { message?: string })?.message ?? 'Failed to submit review')
            : 'Failed to submit review';
          toast.error(msg);
        },
      }
    );
  };

  const handleDelete = (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setDeletingId(reviewId);
    deleteReviewMutation.mutate(reviewId, {
      onSuccess: () => {
        toast.success('Review deleted successfully.');
        setDeletingId(null);
      },
      onError: (err) => {
        const msg = axios.isAxiosError(err)
          ? ((err.response?.data as { message?: string })?.message ?? 'Failed to delete review')
          : 'Failed to delete review';
        toast.error(msg);
        setDeletingId(null);
      },
    });
  };

  const renderStars = (score: number, size = 4) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-${size} w-${size} ${
              i < score ? 'fill-yellow-400 text-yellow-400' : 'text-muted/60 fill-muted/20'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        Customer reviews
      </h2>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Column: write a review */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card/40 backdrop-blur-sm p-6">
            <h3 className="text-base font-semibold mb-2">Share your thoughts</h3>
            <p className="text-muted-foreground text-xs mb-4">
              If you own or have experienced this product, let others know what you think.
            </p>

            {isAuthenticated ? (
              hasReviewed ? (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-500 text-xs flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>You have already submitted a review for this product. Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Rating</label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1;
                        const isFilled = hoverRating !== null ? starVal <= hoverRating : starVal <= rating;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="transition-transform active:scale-95"
                            aria-label={`Rate ${starVal} out of 5 stars`}
                          >
                            <Star
                              className={`h-6 w-6 ${
                                isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-muted/60 fill-muted/20'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment input */}
                  <div className="space-y-1.5">
                    <label htmlFor="review-comment" className="text-xs font-semibold text-foreground">Review comments</label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike? Write a review..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-xs h-9"
                    disabled={createReviewMutation.isPending}
                  >
                    {createReviewMutation.isPending ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit review'
                    )}
                  </Button>
                </form>
              )
            ) : (
              <div className="rounded-lg bg-muted/60 border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-3">You must be logged in to leave reviews.</p>
                <Button asChild size="sm" variant="secondary" className="text-xs">
                  <Link href={`/login?redirect=/products/${productId}`}>Sign in to Review</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: reviews feed */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="py-12 flex justify-center border rounded-lg bg-card/25">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="py-6 text-center text-xs text-muted-foreground border rounded-lg bg-card/25">
              Error fetching reviews. Please reload.
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center border border-dashed rounded-lg bg-card/20 flex flex-col items-center justify-center">
              <MessageSquare className="text-muted-foreground h-8 w-8 mb-2" />
              <h4 className="text-sm font-semibold">No reviews yet</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Be the first to share your experience with this item!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-border border rounded-lg overflow-hidden bg-card/20">
                {reviews.map((r) => {
                  const dateStr = new Date(r.createdAt).toLocaleDateString('en-US', {
                    dateStyle: 'medium',
                  });
                  const showDelete = user && (user.role === 'admin' || user.id === r.user.id);

                  return (
                    <div key={r.id} className="p-5 flex gap-4 items-start hover:bg-muted/10 transition-colors">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                            <span>{r.user.name}</span>
                            <span className="text-muted-foreground font-normal">&bull;</span>
                            <span className="text-muted-foreground font-normal text-xxs">{dateStr}</span>
                          </div>
                          {renderStars(r.rating, 3.5)}
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
                          {r.comment}
                        </p>
                      </div>

                      {showDelete && (
                        <div className="shrink-0 self-center">
                          {deletingId === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/5 transition-colors"
                              aria-label="Delete review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 ? (
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-muted-foreground">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      disabled={page >= meta.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
