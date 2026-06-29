import axiosClient from '@/shared/services/axiosClient';
import type { AttendanceSession } from '../types/attendance';

export const LearnerAttendanceService = {
    getAttendanceByClassId: async (classId: string): Promise<AttendanceSession[]> => {
        try {
            const res = await axiosClient.get<{success: boolean, data: unknown[]}>(`/enrollments/${classId}/attendance`);
            return (res.data as unknown as AttendanceSession[]) || [];
        } catch (error) {
            console.error('Failed to get learner attendance:', error);
            return [];
        }
    }
};
