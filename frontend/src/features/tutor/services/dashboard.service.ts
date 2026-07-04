import axiosClient from '@/shared/services/axiosClient';
import type { TutorDashboardStats, TutorPendingTask, TutorUpcomingClass } from '../types/dashboard';

export const TutorDashboardService = {
    getStats: async (): Promise<TutorDashboardStats> => {
        try {
            const response = await axiosClient.get('/dashboard/tutor/stats');
            return response as any;
        } catch {
            return { activeClasses: 0, upcomingSessions: 0, pendingRequests: 0, totalStudents: 0 };
        }
    },
    getPendingTasks: async (): Promise<TutorPendingTask[]> => {
        try {
            const response = await axiosClient.get('/dashboard/tutor/pending-tasks');
            return response as any;
        } catch {
            return [];
        }
    },
    getUpcomingClasses: async (): Promise<TutorUpcomingClass[]> => {
        try {
            const response = await axiosClient.get('/dashboard/tutor/upcoming-classes');
            return response as any;
        } catch {
            return [];
        }
    }
};
