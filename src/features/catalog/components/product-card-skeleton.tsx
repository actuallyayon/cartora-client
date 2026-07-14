import { Skeleton } from '@/components/ui/skeleton';

/** Loading placeholder matching ProductCard's dimensions. */
export function ProductCardSkeleton() {
  return (
    <div className="border-border bg-card flex flex-col overflow-hidden rounded-xl border">
      <Skeleton className="aspect-square rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="mt-1 h-9 w-full" />
      </div>
    </div>
  );
}
