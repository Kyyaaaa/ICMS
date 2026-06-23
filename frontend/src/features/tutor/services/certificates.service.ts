import type { Certificate } from '../types/certificate';

import axiosClient from '../../../shared/services/axiosClient';

interface CertificateResponse {
    id: number | string;
    name: string;
    issuer: string;
    issue_date: string;
    expiration_date?: string | null;
    status: 'Verified' | 'Pending Verification' | 'Rejected';
    rejection_reason?: string | null;
    file_url: string;
    created_at: string;
}

// Map backend response to frontend interface
const mapCertificate = (data: unknown): Certificate => {
    const d = data as CertificateResponse;
    return {
        id: d.id,
        name: d.name,
        issuer: d.issuer,
        issueDate: d.issue_date,
        expDate: d.expiration_date || 'No Expiration',
        status: d.status,
        file: d.file_url,
        rejection_reason: d.rejection_reason,
        created_at: d.created_at,
    };
};

export const CertificatesService = {
    getMyCertificates: async (): Promise<Certificate[]> => {
        const response = await axiosClient.get('/Certificates') as { data: unknown[] };
        return response.data.map(mapCertificate);
    },
    
    uploadFile: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosClient.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }) as { url: string };
        return response.url;
    },

    addCertificate: async (data: { name: string; issuer: string; issueDate: string; expDate?: string; fileUrl: string }): Promise<Certificate> => {
        const payload = {
            name: data.name,
            issuer: data.issuer,
            issue_date: data.issueDate,
            expiration_date: data.expDate || null,
            file_url: data.fileUrl
        };
        const response = await axiosClient.post('/Certificates', payload) as { data: unknown };
        return mapCertificate(response.data);
    },

    updateCertificate: async (id: string, data: { name?: string; issuer?: string; issueDate?: string; expDate?: string | null; fileUrl?: string }): Promise<Certificate> => {
        const payload: Record<string, unknown> = {};
        if (data.name) payload.name = data.name;
        if (data.issuer) payload.issuer = data.issuer;
        if (data.issueDate) payload.issue_date = data.issueDate;
        if (data.expDate !== undefined) payload.expiration_date = data.expDate;
        if (data.fileUrl) payload.file_url = data.fileUrl;

        const response = await axiosClient.put(`/Certificates/${id}`, payload) as { data: unknown };
        return mapCertificate(response.data);
    },

    deleteCertificate: async (id: string): Promise<void> => {
        await axiosClient.delete(`/Certificates/${id}`);
    }
};
