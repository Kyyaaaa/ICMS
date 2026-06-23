export interface AvailabilityShift {
    id: string;
    label: string;
    time: string;
}

export type AvailabilityStatus = 'draft' | 'submitted';
