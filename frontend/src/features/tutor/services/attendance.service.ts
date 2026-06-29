import axiosClient from '@/shared/services/axiosClient';
import type { AttendanceClass } from '../types/attendance';
import Cookies from 'js-cookie';

export const AttendanceService = {
    getClasses: async (): Promise<AttendanceClass[]> => {
        try {
            const userInfoStr = Cookies.get('user_info');
            if (!userInfoStr) return [];
            const user = JSON.parse(userInfoStr);
            const res = await axiosClient.get(`/staff/classes`, { params: { tutor_id: user.id } });
            const data = (res as unknown as { data?: { id: string, name?: string, class_code?: string, capacity?: number, students?: { status: string }[] }[] }).data || [];
            return data.map(cls => ({
                id: cls.id,
                name: cls.name || `Class ${cls.class_code || ''}`,
                students: cls.students?.filter(s => s.status === 'ACTIVE').length || 0
            }));
        } catch (error) {
            console.error('Failed to get tutor classes:', error);
            return [];
        }
    },
    getAttendanceBySession: async (sessionId: string) => {
        try {
            const res = await axiosClient.get<{success: boolean, data: unknown[]}>(`/sessions/${sessionId}/attendance`);
            return (res as unknown as { data?: unknown[] }).data || [];
        } catch (error) {
            console.error('Failed to get attendance:', error);
            return [];
        }
    },
    
    submitAttendance: async (sessionId: string, records: { learner_id: string, status: string, notes?: string }[]) => {
        try {
            const res = await axiosClient.put<{success: boolean, data: unknown[]}>(`/sessions/${sessionId}/attendance`, records);
            return (res as unknown as { data?: unknown }).data;
        } catch (error) {
            console.error('Failed to submit attendance:', error);
            throw error;
        }
    }
};
