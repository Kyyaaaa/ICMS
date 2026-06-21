import type { AvailabilityShift, AvailabilityStatus } from '../types/availability';
import axiosClient from '../../../shared/services/axiosClient';

export const SHIFTS: AvailabilityShift[] = [
    { id: 'slot1', label: 'Slot 1', time: '07:30 - 09:30' },
    { id: 'slot2', label: 'Slot 2', time: '09:30 - 11:30' },
    { id: 'slot3', label: 'Slot 3', time: '13:30 - 15:30' },
    { id: 'slot4', label: 'Slot 4', time: '15:30 - 17:30' },
    { id: 'slot5', label: 'Slot 5', time: '18:00 - 20:00' },
    { id: 'slot6', label: 'Slot 6', time: '20:00 - 22:00' },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface AvailabilityCycle {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: 'OPEN' | 'SCHEDULING' | 'ACTIVE' | 'COMPLETED';
}

interface AvailabilityResponse {
    data: {
        status: AvailabilityStatus;
        slots: string[];
    }
}

interface CyclesResponse {
    data: AvailabilityCycle[];
}

const cachedAvailabilities: Record<string, AvailabilityResponse['data']> = {};
const fetchPromises: Record<string, Promise<AvailabilityResponse['data']>> = {};
let cachedCycles: AvailabilityCycle[] | null = null;
let cyclesPromise: Promise<AvailabilityCycle[]> | null = null;

const fetchAvailability = async (cycleId: string): Promise<AvailabilityResponse['data']> => {
    if (cachedAvailabilities[cycleId]) return cachedAvailabilities[cycleId];
    if (cycleId in fetchPromises) return fetchPromises[cycleId];

    fetchPromises[cycleId] = axiosClient.get(`/available-time-slots/my-availability?cycle_id=${cycleId}`)
        .then((res) => {
            const data = (res as AvailabilityResponse).data;
            cachedAvailabilities[cycleId] = data;
            return data;
        })
        .finally(() => {
            delete fetchPromises[cycleId];
        });

    return fetchPromises[cycleId];
};

export const AvailabilityService = {
    getCycles: async (): Promise<AvailabilityCycle[]> => {
        if (cachedCycles) return cachedCycles;
        if (cyclesPromise) return cyclesPromise;

        cyclesPromise = axiosClient.get('/available-time-slots/cycles')
            .then((res) => {
                const data = (res as CyclesResponse).data;
                cachedCycles = data;
                return data;
            })
            .finally(() => {
                cyclesPromise = null;
            });
            
        return cyclesPromise;
    },

    getCycleByMonth: async (month: number, year: number): Promise<AvailabilityCycle> => {
        const res = await axiosClient.get(`/available-time-slots/cycles/by-month?month=${month}&year=${year}`);
        return (res as { data: AvailabilityCycle }).data;
    },

    getInitialSlots: async (cycleId: string): Promise<Set<string>> => {
        const data = await fetchAvailability(cycleId);
        return new Set(data.slots || []);
    },
    getInitialStatus: async (cycleId: string): Promise<AvailabilityStatus> => {
        const data = await fetchAvailability(cycleId);
        return data.status || 'draft';
    },
    submitAvailability: async (cycleId: string, slots: Set<string>, status: AvailabilityStatus = 'submitted'): Promise<void> => {
        const slotsArray = Array.from(slots);
        await axiosClient.post('/available-time-slots/submit', { cycle_id: cycleId, slots: slotsArray, status });
        
        if (cachedAvailabilities[cycleId]) {
            cachedAvailabilities[cycleId].status = status;
            cachedAvailabilities[cycleId].slots = slotsArray;
        } else {
            cachedAvailabilities[cycleId] = { status, slots: slotsArray };
        }
    }
};
