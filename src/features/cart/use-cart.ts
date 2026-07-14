'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartApi } from '@/features/cart/cart.api';
import type { Cart } from '@/features/cart/cart.types';
import { useAuth } from '@/features/auth/use-auth';

const cartKey = ['cart'] as const;

/** Cart query — only runs for authenticated users (the cart is private). */
export function useCart() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: cartKey,
    queryFn: () => cartApi.get(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

function useCartMutation<TArgs extends unknown[]>(fn: (...args: TArgs) => Promise<Cart>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: TArgs) => fn(...args),
    onSuccess: (cart) => queryClient.setQueryData(cartKey, cart),
  });
}

export function useAddToCart() {
  const m = useCartMutation(
    (productId: string, quantity?: number, selectedVariant?: { name: string; value: string }) =>
      cartApi.addItem(productId, quantity, selectedVariant),
  );
  return {
    ...m,
    add: (productId: string, quantity = 1, selectedVariant?: { name: string; value: string }) =>
      m.mutate([productId, quantity, selectedVariant], {
        onSuccess: () => toast.success('Added to cart'),
        onError: () => toast.error('Could not add to cart'),
      }),
  };
}

export function useUpdateCartItem() {
  return useCartMutation((productId: string, quantity: number) =>
    cartApi.updateItem(productId, quantity),
  );
}

export function useRemoveCartItem() {
  return useCartMutation((productId: string) => cartApi.removeItem(productId));
}

export function useClearCart() {
  return useCartMutation(() => cartApi.clear());
}
