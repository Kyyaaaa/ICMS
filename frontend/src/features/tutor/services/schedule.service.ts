import axiosClient from '../../../shared/services/axiosClient';
import type { TutorScheduleSession } from '../types/schedule';

// Helper to extract time from slot
const getSlotTimes = (slot: string | null | undefined) => {
    if (!slot) return { startTime: '00:00', endTime: '00:00' };
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

export const ScheduleService = {
    getSchedule: async (startDate?: Date, endDate?: Date): Promise<TutorScheduleSession[]> => {
        let url = '/sessions/my-schedule';
        if (startDate && endDate) {
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            url += `?start_date=${startStr}&end_date=${endStr}`;
        }
        
        try {
            const res = await axiosClient.get(url);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = Array.isArray((res as any)?.data?.data) ? (res as any).data.data : (Array.isArray((res as any)?.data) ? (res as any).data : (Array.isArray(res) ? res : []));
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return data.map((s: any) => {
                const times = getSlotTimes(s.slot);
                const d = new Date(s.date);
                let dayIndex = d.getDay() - 1;
                if (dayIndex === -1) dayIndex = 6; // Sunday

                let attendanceStatus: 'taken' | 'pending' | 'not_yet';
                if (s.is_attendance_taken) {
                    attendanceStatus = 'taken';
                } else {
                    const sessionDate = new Date(s.date);
                    const [startHour, startMinute] = times.startTime.split(':').map(Number);
                    sessionDate.setHours(startHour, startMinute, 0, 0);
                    if (new Date() >= sessionDate) {
                        attendanceStatus = 'pending';
                    } else {
                        attendanceStatus = 'not_yet';
                    }
                }

                return {
                    id: s.id,
                    classId: s.class_id,
                    sessionId: s.id,
                    class: s.class ? `${s.class.course?.title || 'Unknown Course'} - ${s.class.name || 'Unknown Class'}` : 'Unknown Class',
                    session: `Session ${s.session_number}`,
                    date: d,
                    room: s.classroom?.room_name || 'Unassigned',
                    tutor: s.tutor?.full_name || 'Unassigned',
                    students: s.class?.students?.length || 0,
                    dayIndex,
                    startTime: times.startTime,
                    endTime: times.endTime,
                    attendance: attendanceStatus
                };
            });
        } catch (error) {
            console.error("Failed to fetch tutor schedule:", error);
            return [];
        }
    }
};
