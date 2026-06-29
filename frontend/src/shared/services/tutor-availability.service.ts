import type { AvailabilityStatus, TutorAvailabilityProfile } from '../types/tutor-availability';
import axiosClient from './axiosClient';

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
const tutorsCache: Record<string, TutorAvailabilityProfile[]> = {};

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

export const TutorAvailabilityService = {
    // Cycles
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

    updateCycleStatus: async (cycleId: string, status: string): Promise<AvailabilityCycle> => {
        const res = await axiosClient.patch(`/available-time-slots/cycles/${cycleId}/status`, { status });
        const updatedCycle = (res as { data: AvailabilityCycle }).data;
        if (cachedCycles) {
            const idx = cachedCycles.findIndex(c => c.id === cycleId);
            if (idx !== -1) cachedCycles[idx] = updatedCycle;
        }
        return updatedCycle;
    },

    // Staff fetching tutor profiles
    getTutorProfiles: async (cycleId: string): Promise<TutorAvailabilityProfile[]> => {
        if (tutorsCache[cycleId]) return tutorsCache[cycleId];
        const res = await axiosClient.get(`/available-time-slots/staff/tutors?cycle_id=${cycleId}`);
        const data = (res as { data: TutorAvailabilityProfile[] }).data;
        tutorsCache[cycleId] = data;
        return data;
    },

    getTutorAvailability: async (cycleId: string, tutorId: string): Promise<string[]> => {
        const res = await axiosClient.get(`/available-time-slots/cycles/${cycleId}/tutors/${tutorId}`);
        return (res as { data: { slots: string[] } }).data.slots;
    },

    exportCycleToCSV: async (cycleId: string): Promise<Blob> => {
        const res = await axiosClient.get(`/available-time-slots/cycles/${cycleId}/export`, { responseType: 'blob' });
        return res as unknown as Blob;
    },

    updateTutor: async (cycleId: string, tutorId: string, slots: string[]): Promise<void> => {
        await axiosClient.put(`/available-time-slots/cycles/${cycleId}/tutors/${tutorId}`, { slots });
        // Invalidate cache
        delete tutorsCache[cycleId];
    },

    // Tutor submitting availability
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
