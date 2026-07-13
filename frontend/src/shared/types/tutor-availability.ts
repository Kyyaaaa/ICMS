export interface Shift {
    id: string;
    label: string;
    time: string;
}

export interface TutorAvailabilityProfile {
    id: string;
    account_code: string;
    name: string;
    status: 'unregistered' | 'draft' | 'submitted';
    slots: string[];
    avatar_url: string | null;
}

export const SHIFTS: Shift[] = [
    { id: 'slot1', label: 'Slot 1', time: '07:30 - 09:30' },
    { id: 'slot2', label: 'Slot 2', time: '09:30 - 11:30' },
    { id: 'slot3', label: 'Slot 3', time: '13:30 - 15:30' },
    { id: 'slot4', label: 'Slot 4', time: '15:30 - 17:30' },
    { id: 'slot5', label: 'Slot 5', time: '18:00 - 20:00' },
    { id: 'slot6', label: 'Slot 6', time: '20:00 - 22:00' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export type AvailabilityStatus = 'draft' | 'submitted';
