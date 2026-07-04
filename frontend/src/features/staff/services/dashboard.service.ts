import axiosClient from '@/shared/services/axiosClient';
import type { StaffDashboardStats, StaffPendingTask, StaffUpcomingClass } from '../types/dashboard';

export const StaffDashboardService = {
    getStats: async (): Promise<StaffDashboardStats> => {
        try {
            const response = await axiosClient.get('/dashboard/staff/stats');
            return response as any;
        } catch {
            return { totalLearners: 0, activeClasses: 0, pendingInvoices: 0, openTickets: 0 };
        }
    },
    getPendingTasks: async (): Promise<StaffPendingTask[]> => {
        try {
            const response = await axiosClient.get('/dashboard/staff/pending-tasks');
            return response as any;
        } catch {
            return [];
        }
    },
    getUpcomingClasses: async (): Promise<StaffUpcomingClass[]> => {
        try {
            const response = await axiosClient.get('/dashboard/staff/upcoming-classes');
            return response as any;
        } catch {
            return [];
        }
    }
};
