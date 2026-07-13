import axiosClient from './axiosClient';

export interface ProfileData {
    id: string;
    full_name: string;
    phone_number: string;
    date_of_birth: string;
    gender: string;
    email: string;
    role: string;
    account_code: string;
    created_at: string;
    avatar_url: string;
}

export const ProfileService = {
    getProfile: async (id: string): Promise<unknown> => {
        return axiosClient.get(`/accounts/${id}`);
    },

    updateProfile: async (id: string, data: Partial<ProfileData>): Promise<unknown> => {
        return axiosClient.patch(`/accounts/${id}`, data);
    },

    updatePassword: async (id: string, data: Record<string, string>): Promise<unknown> => {
        return axiosClient.patch(`/accounts/${id}`, data);
    },

    uploadAvatar: async (file: File): Promise<unknown> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'avatar');
        return axiosClient.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
