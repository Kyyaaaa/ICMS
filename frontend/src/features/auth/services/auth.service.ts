import axiosClient from '@/shared/services/axiosClient';

export const AuthService = {
    login: (data: Record<string, unknown>): Promise<unknown> => {
        return axiosClient.post('/auth/login', data);
    },
    register: (data: Record<string, unknown>): Promise<unknown> => {
        return axiosClient.post('/auth/register', data);
    },
    forgotPassword: (data: Record<string, unknown>): Promise<unknown> => {
        return axiosClient.post('/auth/forgot-password', data);
    },
    verifyOtp: (data: Record<string, unknown>): Promise<unknown> => {
        return axiosClient.post('/auth/verify-otp', data);
    },
    resetPassword: (data: Record<string, unknown>): Promise<unknown> => {
        return axiosClient.post('/auth/reset-password', data);
    }
};
