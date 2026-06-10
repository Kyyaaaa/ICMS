import type { AvailabilityShift, AvailabilityStatus } from '../types/availability';

export const SHIFTS: AvailabilityShift[] = [
    { id: 'M1', label: 'Morning 1', time: '07:30 - 09:30' },
    { id: 'M2', label: 'Morning 2', time: '09:30 - 11:30' },
    { id: 'A1', label: 'Afternoon 1', time: '13:30 - 15:30' },
    { id: 'A2', label: 'Afternoon 2', time: '15:30 - 17:30' },
    { id: 'E1', label: 'Evening 1', time: '18:00 - 20:00' },
    { id: 'E2', label: 'Evening 2', time: '20:00 - 22:00' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AvailabilityService = {
    getInitialSlots: async (): Promise<Set<string>> => {
        return new Promise(resolve => setTimeout(() => {
            resolve(new Set(['Monday-E1', 'Wednesday-E1', 'Friday-E1', 'Saturday-M1', 'Saturday-M2']));
        }, 200));
    },
    getInitialStatus: async (): Promise<AvailabilityStatus> => {
        return new Promise(resolve => setTimeout(() => resolve('draft'), 200));
    },
    submitAvailability: async (_slots: Set<string>): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 800));
    }
};
