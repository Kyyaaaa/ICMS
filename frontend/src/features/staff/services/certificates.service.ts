import axiosClient from '@/shared/services/axiosClient';

export interface StaffCertificate {
    id: string;
    tutor_id: string;
    name: string;
    issuer: string;
    issue_date: string;
    expiration_date: string | null;
    status: 'Pending Verification' | 'Verified' | 'Rejected';
    file_url: string;
    account: {
        full_name: string;
        email: string;
    };
    created_at: string;
}

export const StaffCertificatesService = {
    getAllCertificates: async (status?: string): Promise<StaffCertificate[]> => {
        let url = '/certificates/all';
        if (status) {
            url += `?status=${encodeURIComponent(status)}`;
        }
        const response = await axiosClient.get(url) as any;
        const items = Array.isArray(response) ? response : (Array.isArray(response?.data) ? response.data : []);
        return items.map((item: any) => ({
            ...item,
            account: item.tutor?.account || item.tutor || { full_name: 'Unknown', email: '' }
        })) as StaffCertificate[];
    },

    changeStatus: async (id: string, status: 'Verified' | 'Rejected', reject_reason?: string): Promise<void> => {
        await axiosClient.patch(`/certificates/${id}/status`, { status, reject_reason });
    }
};
