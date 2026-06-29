import axiosClient from '../../../shared/services/axiosClient';
import type { ScheduleSession } from '../types/schedule';

// Helper to extract time from slot
const getSlotTimes = (slot: string) => {
    const match = slot.toLowerCase().match(/slot\s*([1-6])/);
    const normalizedSlot = match ? `slot${match[1]}` : slot.toLowerCase();

    switch(normalizedSlot) {
        case 'slot1': return { startTime: '07:30', endTime: '09:30' };
        case 'slot2': return { startTime: '09:30', endTime: '11:30' };
        case 'slot3': return { startTime: '13:30', endTime: '15:30' };
        case 'slot4': return { startTime: '15:30', endTime: '17:30' };
        case 'slot5': return { startTime: '18:00', endTime: '20:00' };
        case 'slot6': return { startTime: '20:00', endTime: '22:00' };
        default: return { startTime: '00:00', endTime: '00:00' };
    }
};

// Colors for visual variety
const COLORS = [
    'bg-blue-50 border-blue-200 border-l-blue-600',
    'bg-emerald-50 border-emerald-200 border-l-emerald-600',
    'bg-purple-50 border-purple-200 border-l-purple-600',
    'bg-amber-50 border-amber-200 border-l-amber-600'
];

export const ScheduleService = {
    getSchedule: async (startDate: Date, endDate: Date): Promise<ScheduleSession[]> => {
        const startStr = startDate.toLocaleDateString('en-CA');
        const endStr = endDate.toLocaleDateString('en-CA');
        
        try {
            const res = await axiosClient.get(`/sessions/my-schedule?start_date=${startStr}&end_date=${endStr}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (res as any)?.data || [];
            
            return data.map((s: { id: string, date: string, slot: number | string, class?: { name: string, course?: { title?: string } }, tutor?: { full_name?: string }, classroom?: { room_name?: string } }, index: number) => {
                const times = getSlotTimes(String(s.slot));
                const d = new Date(s.date);
                let dayIndex = d.getDay() - 1;
                if (dayIndex === -1) dayIndex = 6; // Sunday

                return {
                    id: s.id,
                    class: s.class ? `${s.class.course?.title || 'Unknown Course'} - ${s.class.name}` : 'Unknown Class',
                    tutor: s.tutor?.full_name || 'Unassigned',
                    room: s.classroom?.room_name || 'Unassigned',
                    dayIndex,
                    startTime: times.startTime,
                    endTime: times.endTime,
                    color: COLORS[index % COLORS.length],
                    rawSession: s
                };
            });
        } catch (error) {
            console.error("Failed to fetch schedule:", error);
            return [];
        }
    }
};
