import type { RegistrationClassOption, RegistrationInvoicePreview } from '../types/registration';

const MOCK_CLASS_OPTIONS: RegistrationClassOption[] = [
    {
        id: 1,
        name: 'Class A - Evening',
        availableSeats: 10,
        schedule: 'Mon, Wed',
        time: '19:00 - 21:00',
        room: 'Room 305',
        sessions: 24
    },
    {
        id: 2,
        name: 'Class B - Weekend',
        availableSeats: 2,
        schedule: 'Sat, Sun',
        time: '09:00 - 11:00',
        room: 'Room 102',
        sessions: 24
    }
];

import axiosClient from '@/shared/services/axiosClient';

export const LearnerRegistrationService = {
    getAvailableClasses: async (_courseId: string): Promise<RegistrationClassOption[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_CLASS_OPTIONS]), 200));
    },

    getInvoicePreview: async (_courseId: string, _classId: number): Promise<RegistrationInvoicePreview> => {
        return new Promise(resolve => setTimeout(() => resolve({
            courseFee: 450000,
            discount: 0,
            totalDue: 450000
        }), 200));
    },

    confirmRegistration: async (_courseId: string, _classId: number | string): Promise<boolean> => {
        try {
            await axiosClient.post('/enrollments', { class_id: _classId });
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    }
};
