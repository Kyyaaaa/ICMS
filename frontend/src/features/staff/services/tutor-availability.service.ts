import type { TutorAvailabilityProfile } from '../types/tutor-availability';
import axiosClient from '../../../shared/services/axiosClient';

export interface AvailabilityCycle {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: 'OPEN' | 'SCHEDULING' | 'ACTIVE' | 'COMPLETED';
}

export const TutorAvailabilityService = {
    getCycles: async (): Promise<AvailabilityCycle[]> => {
        const response = await axiosClient.get('/available-time-slots/cycles');
        const responseData = response as unknown as { data?: AvailabilityCycle[] };
        return responseData.data || response as unknown as AvailabilityCycle[];
    },

    getCycleByMonth: async (month: number, year: number): Promise<AvailabilityCycle> => {
        const res = await axiosClient.get(`/available-time-slots/cycles/by-month?month=${month}&year=${year}`);
        return (res as { data: AvailabilityCycle }).data;
    },

    updateCycleStatus: async (cycleId: string, status: string): Promise<AvailabilityCycle> => {
        const res = await axiosClient.patch(`/available-time-slots/cycles/${cycleId}/status`, { status });
        return (res as { data: AvailabilityCycle }).data;
    },

    getTutors: async (cycleId: string): Promise<TutorAvailabilityProfile[]> => {
        const response = await axiosClient.get(`/available-time-slots/staff/tutors?cycle_id=${cycleId}`);
        const responseData = response as unknown as { data?: TutorAvailabilityProfile[] };
        const data = responseData.data || response;
        return data as TutorAvailabilityProfile[];
    },

    updateTutor: async (cycleId: string, updatedTutor: TutorAvailabilityProfile): Promise<void> => {
        await axiosClient.put(`/available-time-slots/staff/tutors/${updatedTutor.id}`, {
            cycle_id: cycleId,
            status: updatedTutor.status,
            slots: updatedTutor.slots
        });
    }
};
