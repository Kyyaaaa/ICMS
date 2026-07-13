import axiosClient from '@/shared/services/axiosClient';
import type { ConsultationRequest } from '../types/consultation';

interface GetConsultationsResponse {
    success: boolean;
    data: ConsultationRequest[];
    total: number;
}

interface UpdateConsultationData {
    status?: string;
    call_notes?: string;
}

export const ConsultationsService = {
    getConsultations: async (params?: { status?: string; page?: number; limit?: number }): Promise<GetConsultationsResponse> => {
        try {
            const res = await axiosClient.get<GetConsultationsResponse>('/consultations/staff', {
                params: { 
                    status: params?.status === 'All' ? undefined : params?.status,
                    page: params?.page || 1,
                    limit: params?.limit || 10
                }
            });
            // axiosClient interceptor returns response.data directly
            return res as unknown as GetConsultationsResponse;
        } catch (error) {
            console.error('Error fetching consultations', error);
            throw new Error('Error fetching consultations', { cause: error });
        }
    },

    updateConsultation: async (id: string, data: UpdateConsultationData): Promise<ConsultationRequest> => {
        try {
            const res = await axiosClient.patch<{success: boolean, data: ConsultationRequest}>(`/consultations/staff/${id}`, data);
            return (res as unknown as { data: ConsultationRequest }).data;
        } catch (error) {
            console.error('Error updating consultation', error);
            throw new Error('Error updating consultation', { cause: error });
        }
    },

    createPublicConsultation: async (data: { guest_name: string; guest_phone: string; guest_email: string; course_of_interest?: string; course?: string; inquiry_details: string }): Promise<void> => {
        try {
            await axiosClient.post('/consultations', data);
        } catch (error) {
            console.error('Error creating public consultation', error);
            throw new Error('Error creating public consultation', { cause: error });
        }
    }
};
