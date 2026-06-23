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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getProfile: async (id: string): Promise<any> => {
        return axiosClient.get(`/accounts/${id}`);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateProfile: async (id: string, data: Partial<ProfileData>): Promise<any> => {
        return axiosClient.patch(`/accounts/${id}`, data);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePassword: async (id: string, data: Record<string, string>): Promise<any> => {
        return axiosClient.patch(`/accounts/${id}`, data);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadAvatar: async (file: File): Promise<any> => {
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
