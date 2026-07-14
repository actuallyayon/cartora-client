'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/features/address/address.api';
import type { CreateAddressPayload, UpdateAddressPayload } from '@/features/address/address.types';

export const addressKeys = {
  all: ['addresses'] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: () => addressApi.getAddresses(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => addressApi.createAddress(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAddressPayload }) =>
      addressApi.updateAddress(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressApi.deleteAddress(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressApi.setDefaultAddress(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}
