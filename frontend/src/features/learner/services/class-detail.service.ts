import type { ClassDetailData } from '../types/class-detail';
import axiosClient from '@/shared/services/axiosClient';
import { getSlotLabel } from '@/shared/lib/utils';

export const LearnerClassDetailService = {
    getClassDetail: async (id: string): Promise<ClassDetailData | undefined> => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = await axiosClient.get(`/staff/classes/${id}`) as { data?: { data?: any } | any };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = res.data && typeof res.data === 'object' && 'data' in res.data ? res.data.data : res.data;
            if (!data) return undefined;

            const sessions = data.sessions || [];
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const curriculum = sessions.map((session: any) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const sDate = new Date(session.date);
                sDate.setHours(0, 0, 0, 0);
                
                const status: 'completed' | 'ongoing' | 'upcoming' = 
                    sDate.getTime() < today.getTime() ? 'completed' 
                    : sDate.getTime() === today.getTime() ? 'ongoing' 
                    : 'upcoming';

                return {
                    sessionNumber: session.session_number,
                    title: session.title || `Session ${session.session_number}`,
                    description: '', // Will be filled below
                    status
                };
            });

            // Map descriptions from course's syllabus (sessions_list)
            const courseSessions = data.courses?.sessions_list || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            curriculum.forEach((c: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cSession = courseSessions.find((cs: any) => cs.session_number === c.sessionNumber || cs.title === c.title);
                if (cSession && cSession.description) {
                    c.description = cSession.description;
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const completed = curriculum.filter((c: any) => c.status === 'completed').length;
            const percentage = sessions.length ? Math.round((completed / sessions.length) * 100) : 0;

            const tutorName = data.tutor?.full_name || 'TBA';
            const initials = tutorName !== 'TBA' 
                ? tutorName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                : 'TB';

            const schedules: string[] = [];
            const times: string[] = [];
            if (sessions.length > 0) {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const slotToDays = new Map<string, Set<number>>();
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sessions.forEach((s: any) => {
                    if (s.date) {
                        const day = new Date(s.date).getDay();
                        const slot = s.slot || 'TBA';
                        if (!slotToDays.has(slot)) {
                            slotToDays.set(slot, new Set());
                        }
                        slotToDays.get(slot)!.add(day);
                    }
                });
                
                slotToDays.forEach((days, slot) => {
                    const sortedDays = Array.from(days).sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
                    const dayList = sortedDays.map(d => dayNames[d]).join(', ');
                    schedules.push(dayList);
                    times.push(getSlotLabel(slot));
                });
            }

            return {
                id: data.id,
                courseName: data.courses?.title || 'Unknown Course',
                status: data.status === 'COMPLETED' ? 'Completed' : 'Ongoing',
                description: data.courses?.description || '',
                schedule: schedules.length > 0 ? Array.from(new Set(schedules)).join(' & ') : 'TBA',
                time: times.length > 0 ? Array.from(new Set(times)).join(' & ') : 'TBA',
                classroom: data.classroom?.room_name || 'TBA',
                totalSessions: sessions.length || 0,
                tutor: {
                    name: tutorName,
                    title: 'Tutor',
                    rating: 5.0, // Assuming static for now or fetched if available
                    initials
                },
                progress: {
                    completed,
                    percentage
                },
                curriculum
            };
        } catch (error) {
            console.error('Error fetching class details:', error);
            return undefined;
        }
    }
};
