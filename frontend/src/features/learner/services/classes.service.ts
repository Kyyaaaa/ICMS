import type { LearnerClass } from '../types/class';

import axiosClient from '@/shared/services/axiosClient';
import { getSlotLabel } from '@/shared/lib/utils';

interface EnrollmentResponse {
    classes: {
        id: string;
        name: string;
        start_date?: string;
        end_date?: string;
        status: string;
        courses?: {
            title: string;
            code?: string;
        };
        tutor?: {
            full_name: string;
        };
        classroom?: {
            room_name: string;
        };
        class_sessions?: { slot: string; date: string }[];
        sessions?: { slot: string; date: string }[];
    };
}

export const ClassesService = {
    getMyClasses: async (): Promise<LearnerClass[]> => {
        try {
            const res = await axiosClient.get<unknown, { data: EnrollmentResponse[] }>('/enrollments');
            const data = res.data || [];
            
            return data.map((enrollment) => {
                const cls = enrollment.classes;
                if (!cls) return null;
                const course = cls.courses || { title: 'Unknown Course' };
                
                const sessions = cls.class_sessions || cls.sessions || [];
                const schedules: string[] = [];
                if (sessions.length > 0) {
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const slotToDays = new Map<string, Set<number>>();
                    
                    sessions.forEach((s) => {
                        if (s.date) {
                            const day = new Date(s.date).getDay();
                            const slot = s.slot || 'TBA';
                            if (!slotToDays.has(slot)) {
                                slotToDays.set(slot, new Set());
                            }
                            slotToDays.get(slot)!.add(day);
                        }
                    });
                    
                    const scheduleObjects: { minDay: number; text: string }[] = [];
                    slotToDays.forEach((days, slot) => {
                        const sortedDays = Array.from(days).sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
                        const dayList = sortedDays.map(d => dayNames[d]).join(', ');
                        const timeStr = getSlotLabel(slot);
                        scheduleObjects.push({
                            minDay: sortedDays[0] === 0 ? 7 : sortedDays[0],
                            text: `${dayList} (${timeStr})`
                        });
                    });
                    
                    scheduleObjects.sort((a, b) => a.minDay - b.minDay).forEach(obj => {
                        schedules.push(obj.text);
                    });
                }

                return {
                    id: cls.id,
                    courseName: course.title || 'Unknown Course',
                    className: cls.name || `Class ${course.code || ''}`,
                    classCode: course.code || 'Unknown',
                    tutorName: cls.tutor?.full_name || 'TBA',
                    room: cls.classroom?.room_name || 'TBA',
                    schedules: schedules.length > 0 ? schedules : [],
                    startDate: cls.start_date ? new Date(cls.start_date).toLocaleDateString('en-GB') : 'TBD',
                    endDate: cls.end_date ? new Date(cls.end_date).toLocaleDateString('en-GB') : 'TBD',
                    status: cls.status === 'COMPLETED' ? 'Completed' : 'Ongoing'
                };
            }).filter(Boolean) as LearnerClass[];
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
            return [];
        }
    }
};
