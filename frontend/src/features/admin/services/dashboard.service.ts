import type { DashboardStatsData, DashboardTransaction } from '../types/dashboard';
import { FinanceService } from './finance.service';
import axiosClient from '@/shared/services/axiosClient';

const extractTotal = (res: unknown): number => {
    if (!res || typeof res !== 'object') return 0;

    const obj = res as Record<string, unknown>;
    const data = obj.data as Record<string, unknown> | undefined;

    if (data && typeof data.total === 'number') return data.total;
    if (typeof obj.total === 'number') return obj.total;
    if (Array.isArray(res)) return res.length;
    if (Array.isArray(obj.data)) return obj.data.length;
    if (data && Array.isArray(data.data)) return data.data.length;

    return 0;
};

export const DashboardService = {
    getStats: async (): Promise<DashboardStatsData> => {
        try {
            const [transactions, accountsRes, coursesRes, classesRes, classroomsRes] = await Promise.all([
                FinanceService.getTransactions().catch(() => []),
                axiosClient.get('/accounts?role=LEARNER&page=1&limit=1').catch(() => null),
                axiosClient.get('/courses').catch(() => null),
                axiosClient.get('/staff/classes?page=1&limit=1').catch(() => null),
                axiosClient.get('/classrooms').catch(() => null)
            ]);

            // Calculate net balance for the current month
            const now = new Date();
            const currentMonthTransactions = transactions.filter(txn => {
                const txnDate = new Date(txn.date);
                return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
            });

            const totalIncome = currentMonthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + (t.paidAmount || 0), 0);

            const totalExpense = currentMonthTransactions
                .filter(t => t.type === 'expense' && (t.status === 'Completed' || t.status === 'Refunded'))
                .reduce((acc, t) => acc + t.amount, 0);

            const netRevenue = totalIncome - totalExpense;

            return {
                totalRevenue: netRevenue,
                totalLearners: extractTotal(accountsRes),
                totalCourses: extractTotal(coursesRes),
                totalClasses: extractTotal(classesRes),
                totalClassrooms: extractTotal(classroomsRes)
            };
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
