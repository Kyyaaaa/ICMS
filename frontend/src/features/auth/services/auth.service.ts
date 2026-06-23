import axiosClient from '@/shared/services/axiosClient';

export const AuthService = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    login: (data: Record<string, unknown>): Promise<any> => {
        return axiosClient.post('/auth/login', data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: (data: Record<string, unknown>): Promise<any> => {
        return axiosClient.post('/auth/register', data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forgotPassword: (data: Record<string, unknown>): Promise<any> => {
        return axiosClient.post('/auth/forgot-password', data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verifyOtp: (data: Record<string, unknown>): Promise<any> => {
        return axiosClient.post('/auth/verify-otp', data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resetPassword: (data: Record<string, unknown>): Promise<any> => {
        return axiosClient.post('/auth/reset-password', data);
    }
};
