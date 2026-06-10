import type { TutorAvailabilityProfile } from '../types/tutor-availability';

const MOCK_TUTORS: TutorAvailabilityProfile[] = [
    { id: 'T001', name: 'John Doe', status: 'submitted', slots: ['Monday-E1', 'Wednesday-E1', 'Friday-E1', 'Saturday-M1', 'Saturday-M2'], avatar_url: '' },
    { id: 'T002', name: 'Jane Smith', status: 'draft', slots: ['Tuesday-A1', 'Thursday-A1'], avatar_url: '' },
    { id: 'T003', name: 'Emily Chen', status: 'submitted', slots: ['Monday-M1', 'Wednesday-M1', 'Friday-M1'], avatar_url: '' },
    { id: 'T004', name: 'Michael Brown', status: 'submitted', slots: ['Saturday-E1', 'Saturday-E2', 'Sunday-E1', 'Sunday-E2'], avatar_url: '' },
];

export const TutorAvailabilityService = {
    getTutors: async (): Promise<TutorAvailabilityProfile[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_TUTORS]), 200));
    },

    updateTutor: async (_updatedTutor: TutorAvailabilityProfile): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 200));
    }
};
