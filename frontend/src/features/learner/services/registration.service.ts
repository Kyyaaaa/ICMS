import type { RegistrationClassOption, RegistrationInvoicePreview } from '../types/registration';
import axiosClient from '@/shared/services/axiosClient';

export const LearnerRegistrationService = {
    getAvailableClasses: async (courseId: string): Promise<RegistrationClassOption[]> => {
        try {
            // Fetch upcoming classes for this course
            const res = await axiosClient.get<{success: boolean, data: any[]}>('/staff/classes', {
                params: { course_id: courseId, status: 'UPCOMING' }
            });
            const classes = (res as any).data || [];
            
            // Map to RegistrationClassOption
            return classes.map((cls: any) => {
                const sessionsCount = cls.sessions ? cls.sessions.length : 24; // fallback to 24 if no sessions array
                
                // Estimate schedule from sessions if available
                let scheduleStr = 'TBD';
                if (cls.sessions && cls.sessions.length > 0) {
                    const uniqueDays = Array.from(new Set(cls.sessions.map((s: any) => s.slot)));
                    if (uniqueDays.length > 0) {
                        scheduleStr = uniqueDays.slice(0, 2).join(', ') + (uniqueDays.length > 2 ? '...' : '');
                    }
                }

                return {
                    id: cls.id, // This is a valid UUID
                    name: cls.name || `Class ${cls.class_code || 'Unknown'}`,
                    availableSeats: Math.max(0, (cls.capacity || 15) - (cls.current_enrollments || 0)),
                    schedule: scheduleStr,
                    time: 'TBD', // We'll just say TBD if not available
                    room: cls.classroom?.name || 'TBD',
                    sessions: sessionsCount
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
        try {
            await axiosClient.post('/enrollments', { class_id: classId });
            return true;
        } catch (error: any) {
            // Throw the actual error so the UI can display it
            throw error;
        }
    }
};
