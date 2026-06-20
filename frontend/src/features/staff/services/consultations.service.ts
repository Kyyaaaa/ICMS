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
    getConsultations: async (status?: string): Promise<ConsultationRequest[]> => {
        try {
            const res = await axiosClient.get<GetConsultationsResponse>('/consultations/staff', {
                params: { status }
            });
            // axiosClient interceptor returns response.data directly
            return (res as unknown as GetConsultationsResponse).data || (res as unknown as ConsultationRequest[]);
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

    createPublicConsultation: async (data: { guest_name: string; guest_phone: string; guest_email?: string; inquiry_details: string }): Promise<void> => {
        try {
            await axiosClient.post('/consultations', data);
        } catch (error) {
            console.error('Error creating public consultation', error);
            throw new Error('Error creating public consultation', { cause: error });
        }
    }
};
