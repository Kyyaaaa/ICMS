import type { RegistrationClassOption, RegistrationInvoicePreview } from '../types/registration';
import axiosClient from '@/shared/services/axiosClient';
import { getSlotLabel } from '@/shared/lib/utils';

interface StaffClassResponse {
    id: string;
    name: string;
    class_code?: string;
    capacity: number;
    current_enrollments?: number;
    class_sessions?: { slot: string; date: string }[];
    sessions?: { slot: string; date: string }[];
    classroom?: { room_name: string };
    status?: string;
    start_date?: string;
}

export const LearnerRegistrationService = {
    getAvailableClasses: async (courseId: string): Promise<RegistrationClassOption[]> => {
        try {
            // Fetch upcoming classes for this course
            const res = await axiosClient.get<unknown, {success: boolean, data: StaffClassResponse[]}>('/staff/classes', {
                params: { course_id: courseId, status: 'UPCOMING' }
            });
            const classes = res.data || [];
            
            const todayStr = new Date().toLocaleDateString('en-CA');
            const validClasses = classes.filter((cls) => {
                if (cls.status && String(cls.status).toUpperCase() !== 'UPCOMING') return false;
                if (cls.start_date && String(cls.start_date).slice(0, 10) < todayStr) return false;
                return true;
            });
            
            // Map to RegistrationClassOption
            return validClasses.map((cls) => {
                const sessions = cls.class_sessions || cls.sessions || [];
                const sessionsCount = sessions.length > 0 ? sessions.length : 24;
                
                let scheduleStr = 'TBD';
                let timeStr = 'TBD';
                
                if (sessions.length > 0) {
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const slotToDays = new Map<string, Set<number>>();
                    
                    sessions.forEach((s) => {
                        const day = new Date(s.date).getDay();
                        const slot = s.slot || 'TBA';
                        if (!slotToDays.has(slot)) {
                            slotToDays.set(slot, new Set());
                        }
                        slotToDays.get(slot)!.add(day);
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
                    
                    const schedules: string[] = [];
                    scheduleObjects.sort((a, b) => a.minDay - b.minDay).forEach(obj => {
                        schedules.push(obj.text);
                    });
                    
                    scheduleStr = schedules.join(' | ');
                    timeStr = 'Detailed in schedule';
                }

                const activeStudentsCount = Array.isArray((cls as any).students)
                    ? (cls as any).students.filter((s: any) => s.status === 'ACTIVE' || !s.status).length
                    : ((cls as any).current_enrollments || 0);
                const availableSeats = Math.max(0, (cls.capacity || 15) - activeStudentsCount);

                return {
                    id: cls.id, // This is a valid UUID
                    name: cls.name || `Class ${cls.class_code || 'Unknown'}`,
                    availableSeats: availableSeats,
                    schedule: scheduleStr,
                    time: timeStr,
                    room: cls.classroom?.room_name || 'TBD',
                    sessions: sessionsCount,
                    sessionList: cls.sessions || []
                };
            });
        } catch (error) {
            console.error('Failed to fetch available classes:', error);
            return [];
        }
    },

    getInvoicePreview: async (_courseId: string, _classId: number | string): Promise<RegistrationInvoicePreview> => {
        return new Promise(resolve => setTimeout(() => resolve({
            courseFee: 450000,
            discount: 0,
            totalDue: 450000
        }), 200));
    },

    confirmRegistration: async (_courseId: string, classId: number | string): Promise<boolean> => {
        await axiosClient.post('/enrollments', { class_id: classId });
        return true;
    },

    validateDiscountCode: async (code: string) => {
        const res = await axiosClient.get(`/public/discount-codes/validate/${code}`) as any;
        return res;
    },

    createInvoice: async (_courseId: string, classId: number | string, discountCode?: string): Promise<string> => {
        const res = await axiosClient.post('/invoices/checkout', { class_id: classId, payment_plan: 'full', discount_code: discountCode }) as any;
        const invoiceId = res?.data?.data?.invoice_code || res?.data?.data?.id || res?.data?.id;
        return invoiceId || '';
    }
};
