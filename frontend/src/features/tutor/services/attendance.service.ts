import axiosClient from '@/shared/services/axiosClient';
import type { AttendanceClass, AttendanceSession, AttendanceStudent, AttendanceRecordMap } from '../types/attendance';
import Cookies from 'js-cookie';

export const AttendanceService = {
    getClasses: async (): Promise<AttendanceClass[]> => {
        try {
            const userInfoStr = Cookies.get('user_info');
            if (!userInfoStr) return [];
            const user = JSON.parse(userInfoStr);
            const res = await axiosClient.get(`/staff/classes`, { params: { tutor_id: user.id } });
            const data = (res as any).data || [];
            return data.map((cls: any) => ({
                id: cls.id,
                name: cls.name || `Class ${cls.class_code || ''}`,
                students: cls.capacity || 0
            }));
        } catch (error) {
            console.error('Failed to get tutor classes:', error);
            return [];
        }
    },
    getAttendanceBySession: async (sessionId: string) => {
        try {
            const res = await axiosClient.get<{success: boolean, data: any[]}>(`/sessions/${sessionId}/attendance`);
            return (res as any).data || [];
        } catch (error) {
            console.error('Failed to get attendance:', error);
            return [];
        }
    },
    
    submitAttendance: async (sessionId: string, records: any[]) => {
        try {
            const res = await axiosClient.put<{success: boolean, data: any[]}>(`/sessions/${sessionId}/attendance`, records);
            return (res as any).data;
        } catch (error) {
            console.error('Failed to submit attendance:', error);
            throw error;
        }
    }
};
