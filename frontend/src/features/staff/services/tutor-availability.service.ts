import type { TutorAvailabilityProfile } from '../types/tutor-availability';
import axiosClient from '../../../shared/services/axiosClient';

export const TutorAvailabilityService = {
    getTutors: async (): Promise<TutorAvailabilityProfile[]> => {
        const response = await axiosClient.get('/available-time-slots/staff/tutors');
        const responseData = response as unknown as { data?: TutorAvailabilityProfile[] };
        const data = responseData.data || response;
        return data as TutorAvailabilityProfile[];
    },

    updateTutor: async (updatedTutor: TutorAvailabilityProfile): Promise<void> => {
        await axiosClient.put(`/available-time-slots/staff/tutors/${updatedTutor.id}`, {
            status: updatedTutor.status,
            slots: updatedTutor.slots
        });
    }
};
