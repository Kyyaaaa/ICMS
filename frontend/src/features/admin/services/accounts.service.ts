import axiosClient from '@/shared/services/axiosClient';
import type { Account, GetAccountsParams } from '../types/account';

export const AccountsService = {
    getAccounts: async (params: GetAccountsParams) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', params.page.toString());
        queryParams.append('limit', params.limit.toString());
        if (params.role && params.role !== 'All') queryParams.append('role', params.role);
        if (params.search) queryParams.append('search', params.search);

        return axiosClient.get(`/accounts?${queryParams.toString()}`);
    },

    toggleBan: async (id: string, is_active: boolean) => {
        return axiosClient.patch(`/accounts/${id}/status`, { is_active });
    },

    createAccount: async (data: Partial<Account> & { password?: string }) => {
        return axiosClient.post('/accounts', data);
    },

    updateAccount: async (id: string, data: Partial<Account> & { password?: string }) => {
        return axiosClient.patch(`/accounts/${id}`, data);
    }
};
