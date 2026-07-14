import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Address, CreateAddressPayload, UpdateAddressPayload } from '@/features/address/address.types';

export const addressApi = {
  async getAddresses(): Promise<Address[]> {
    const { data } = await api.get<ApiResponse<Address[]>>('/addresses');
    return data.data;
  },

  async createAddress(payload: CreateAddressPayload): Promise<Address> {
    const { data } = await api.post<ApiResponse<Address>>('/addresses', payload);
    return data.data;
  },

  async updateAddress(id: string, payload: UpdateAddressPayload): Promise<Address> {
    const { data } = await api.patch<ApiResponse<Address>>(`/addresses/${id}`, payload);
    return data.data;
  },

  async deleteAddress(id: string): Promise<{ success: boolean }> {
    const { data } = await api.delete<ApiResponse<{ success: boolean }>>(`/addresses/${id}`);
    return data.data;
  },

  async setDefaultAddress(id: string): Promise<Address> {
    const { data } = await api.patch<ApiResponse<Address>>(`/addresses/${id}/default`);
    return data.data;
  },
};
