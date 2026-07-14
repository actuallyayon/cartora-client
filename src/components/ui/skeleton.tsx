import { cn } from '@/lib/utils';

/** Shimmering placeholder used while data loads. */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('bg-muted animate-pulse rounded-md', className)} {...props} />;
}

export { Skeleton };
