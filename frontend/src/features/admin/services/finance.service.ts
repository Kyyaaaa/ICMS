import type { Transaction } from '../types/finance';
import axiosClient from '@/shared/services/axiosClient';

export const FinanceService = {
    getTransactions: async (): Promise<Transaction[]> => {
        const response = await axiosClient.get<unknown, { data: Transaction[] }>('/admin/finance/transactions');
        return response.data;
    }
};
