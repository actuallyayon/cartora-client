'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wishlistApi } from '@/features/wishlist/wishlist.api';
import { useAuth } from '@/features/auth/use-auth';

const idsKey = ['wishlist', 'ids'] as const;
const productsKey = ['wishlist', 'products'] as const;

/** Set of wishlisted product ids — drives the heart state on every card. */
export function useWishlistIds() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: idsKey,
    queryFn: () => wishlistApi.getIds(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/** Full products for the wishlist page. */
export function useWishlistProducts() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: productsKey,
    queryFn: () => wishlistApi.getProducts(),
    enabled: isAuthenticated,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, wished }: { productId: string; wished: boolean }) =>
      wished ? wishlistApi.remove(productId) : wishlistApi.add(productId),
    onSuccess: (ids, { wished }) => {
      queryClient.setQueryData(idsKey, ids);
      void queryClient.invalidateQueries({ queryKey: productsKey });
      toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist');
    },
    onError: () => toast.error('Could not update wishlist'),
  });
}
