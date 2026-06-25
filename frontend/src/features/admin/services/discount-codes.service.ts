import type { DiscountCode } from '../types/discount-code';
import axiosClient from '@/shared/services/axiosClient';

export const AdminDiscountCodesService = {
    getDiscountCodes: async (): Promise<DiscountCode[]> => {
        try {
            const response = await axiosClient.get<unknown, { data: DiscountCode[] }>('/admin/discount-codes');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch discount codes', error);
            throw error;
        }
    },

    createDiscountCode: async (code: Omit<DiscountCode, 'id' | 'usageCount'>): Promise<DiscountCode> => {
        try {
            const response = await axiosClient.post<unknown, { data: DiscountCode }>('/admin/discount-codes', code);
            return response.data;
        } catch (error) {
            console.error('Failed to create discount code', error);
            throw error;
        }
    },

    updateDiscountCode: async (id: string, updates: Partial<DiscountCode>): Promise<DiscountCode> => {
        try {
            const response = await axiosClient.put<unknown, { data: DiscountCode }>(`/admin/discount-codes/${id}`, updates);
            return response.data;
        } catch (error) {
            console.error('Failed to update discount code', error);
            throw error;
        }
    },

    deleteDiscountCode: async (id: string): Promise<boolean> => {
        try {
            await axiosClient.delete(`/admin/discount-codes/${id}`);
            return true;
        } catch (error) {
            console.error('Failed to delete discount code', error);
            throw error;
        }
    }
};
