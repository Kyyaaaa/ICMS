import type { DashboardStatsData, DashboardTransaction } from '../types/dashboard';
import { FinanceService } from './finance.service';
import axiosClient from '@/shared/services/axiosClient';



export const DashboardService = {
    getStats: async (): Promise<DashboardStatsData> => {
        try {
            const response = await axiosClient.get('/dashboard/admin/stats');
            return response as any;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalRevenue: 0,
                totalLearners: 0,
                totalCourses: 0,
                totalClasses: 0,
                totalClassrooms: 0
            };
        }
    },
    getRecentTransactions: async (): Promise<DashboardTransaction[]> => {
        try {
            const transactions = await FinanceService.getTransactions();

            // Sort by date descending and take top 5
            const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return sortedTransactions.slice(0, 5).map(txn => ({
                id: txn.id,
                type: txn.type,
                category: txn.category,
                description: txn.description,
                user: { name: txn.user.name, role: txn.user.role },
                date: txn.date,
                amount: txn.amount,
                status: txn.status
            }));
        } catch (error) {
            console.error('Error fetching recent transactions:', error);
            return [];
        }
    }
};
