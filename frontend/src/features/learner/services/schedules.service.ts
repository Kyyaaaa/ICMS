import axiosClient from '../../../shared/services/axiosClient';
import type { LearnerSession } from '../types/schedule';

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

export const LearnerSchedulesService = {
    getWeeklySchedule: async (date: Date): Promise<LearnerSession[]> => {
        // Calculate the Monday and Sunday of the week for the given date
        const monday = new Date(date);
        const day = monday.getDay();
        const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const startStr = monday.toISOString().split('T')[0];
        const endStr = sunday.toISOString().split('T')[0];

        try {
            const res = await axiosClient.get(`/sessions/my-schedule?start_date=${startStr}&end_date=${endStr}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (res as any)?.data || [];
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return data.map((s: any) => {
                const times = getSlotTimes(s.slot);
                const d = new Date(s.date);
                let dayIndex = d.getDay() - 1;
                if (dayIndex === -1) dayIndex = 6; // Sunday

                // map learner_attendance or fallback
                const attStatus = s.learner_attendance === 'PRESENT' ? 'present' : 
                                  s.learner_attendance === 'ABSENT' ? 'absent' : 'not_yet';

                return {
                    id: s.id,
                    class: s.class ? `${s.class.course?.title || 'Unknown Course'} - ${s.class.name || 'Unknown Class'}` : 'Unknown Class',
                    session: `Session ${s.session_number}`,
                    tutor: s.tutor?.full_name || 'Unassigned',
                    room: s.classroom?.room_name || 'Unassigned',
                    dayIndex,
                    startTime: times.startTime,
                    endTime: times.endTime,
                    attendance: attStatus
                };
            });
        } catch (error) {
            console.error("Failed to fetch learner schedule:", error);
            return [];
        }
    }
};
