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
        let url = '/Certificates/all';
        if (status) {
            url += `?status=${encodeURIComponent(status)}`;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await axiosClient.get(url) as any;
        const items = Array.isArray(response) ? response : (Array.isArray(response?.data) ? response.data : []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return items.map((item: any) => ({
            ...item,
            account: item.tutor?.account || { full_name: 'Unknown', email: '' }
        })) as StaffCertificate[];
    },

    changeStatus: async (id: string, status: 'Verified' | 'Rejected', reject_reason?: string): Promise<void> => {
        await axiosClient.patch(`/Certificates/${id}/status`, { status, reject_reason });
    }
};
