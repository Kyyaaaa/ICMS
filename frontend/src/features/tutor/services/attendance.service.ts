import axiosClient from '@/shared/services/axiosClient';
import type { AttendanceClass, AttendanceSession, AttendanceStudent, AttendanceRecordMap } from '../types/attendance';

export const AttendanceService = {
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
