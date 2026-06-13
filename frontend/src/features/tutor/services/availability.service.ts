import type { AvailabilityShift, AvailabilityStatus } from '../types/availability';
import axiosClient from '../../../shared/services/axiosClient';

export const SHIFTS: AvailabilityShift[] = [
    { id: 'M1', label: 'Slot 1', time: '07:30 - 09:30' },
    { id: 'M2', label: 'Slot 2', time: '09:30 - 11:30' },
    { id: 'A1', label: 'Slot 3', time: '13:30 - 15:30' },
    { id: 'A2', label: 'Slot 4', time: '15:30 - 17:30' },
    { id: 'E1', label: 'Slot 5', time: '18:00 - 20:00' },
    { id: 'E2', label: 'Slot 6', time: '20:00 - 22:00' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface AvailabilityResponse {
    data: {
        status: AvailabilityStatus;
        slots: string[];
    }
}

// Gi? l?i cache d? kh�ng ph?i g?i API 2 l?n trong useEffect
let cachedAvailability: AvailabilityResponse['data'] | null = null;
let isFetching = false;
let fetchPromise: Promise<AvailabilityResponse['data']> | null = null;

const fetchAvailability = async (): Promise<AvailabilityResponse['data']> => {
    if (cachedAvailability) return cachedAvailability;
    if (isFetching && fetchPromise) return fetchPromise;

    isFetching = true;
    fetchPromise = axiosClient.get('/available-time-slots/my-availability')
        .then((res) => {
            const data = (res as AvailabilityResponse).data;
            cachedAvailability = data;
            return data;
        })
        .finally(() => {
            isFetching = false;
            fetchPromise = null;
        });

    return fetchPromise;
};

export const AvailabilityService = {
    getInitialSlots: async (): Promise<Set<string>> => {
        const data = await fetchAvailability();
        return new Set(data.slots || []);
    },
    getInitialStatus: async (): Promise<AvailabilityStatus> => {
        const data = await fetchAvailability();
        return data.status || 'draft';
    },
    submitAvailability: async (slots: Set<string>, status: AvailabilityStatus = 'submitted'): Promise<void> => {
        const slotsArray = Array.from(slots);
        await axiosClient.post('/available-time-slots/submit', { slots: slotsArray, status });
        // C?p nh?t l?i cache sau khi submit th�nh c�ng
        if (cachedAvailability) {
            cachedAvailability.status = status;
            cachedAvailability.slots = slotsArray;
        }
    }
};

