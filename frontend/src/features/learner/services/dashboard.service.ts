import axiosClient from '@/shared/services/axiosClient';
import type { LearnerDashboardStats, LearnerUpcomingClass, LearnerAnnouncement, LearnerPendingTask } from '../types/dashboard';

export const LearnerDashboardService = {
    getStats: async (): Promise<LearnerDashboardStats> => {
        try {
            const response = await axiosClient.get('/dashboard/learner/stats');
            return response as any;
        } catch {
            return { activeClasses: 0, attendanceRate: 100, completedLessons: 0 };
        }
    },
    getUpcomingClasses: async (): Promise<LearnerUpcomingClass[]> => {
        try {
            const response = await axiosClient.get('/dashboard/learner/upcoming-classes');
            return response as any;
        } catch {
            return [];
        }
    },
    getAnnouncements: async (): Promise<LearnerAnnouncement[]> => {
        return [];
    },
    getPendingTasks: async (): Promise<LearnerPendingTask[]> => {
        try {
            const response = await axiosClient.get('/dashboard/learner/pending-tasks');
            return response as any;
        } catch {
            return [];
        }
    }
};
