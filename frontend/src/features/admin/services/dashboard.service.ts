import type { DashboardStatsData, DashboardTransaction, DashboardAuditLog } from '../types/dashboard';

const MOCK_STATS: DashboardStatsData = {
    totalRevenue: 124500000,
    totalLearners: 1240,
    totalCourses: 45,
    totalClasses: 128,
    totalClassrooms: 24
};

const MOCK_RECENT_TRANSACTIONS: DashboardTransaction[] = [
    { id: 'TXN-10293', type: 'income', category: 'Course Registration', description: 'IELTS Intensive Mastery', user: { name: 'Alex Johnson', role: 'Learner' }, date: '24-10-2026', amount: 500000, status: 'Completed' },
    { id: 'REF-10294', type: 'expense', category: 'Course Refund', description: 'Basic Communication', user: { name: 'Michael Smith', role: 'Learner' }, date: '25-10-2026', amount: 100000, status: 'Completed' },
    { id: 'PAY-1004', type: 'expense', category: 'Salary Payment', description: 'October 2026', user: { name: 'Sarah Jenkins', role: 'Tutor' }, date: '01-11-2026', amount: 12000000, status: 'Processing' },
    { id: 'TXN-10296', type: 'income', category: 'Course Registration', description: 'TOEIC Target 700+', user: { name: 'Emma Watson', role: 'Learner' }, date: '02-11-2026', amount: 300000, status: 'Completed' },
];

const MOCK_AUDIT_LOGS: DashboardAuditLog[] = [
    { id: '1', date: '30-10-2026', time: '14:23:01', adminName: 'Do Hong Vy', adminRole: 'Super Admin', adminInitials: 'DV', actionDetails: 'Approved refund REF-1002 for Learner: Alex Johnson', type: 'user' },
    { id: '2', date: '30-10-2026', time: '12:15:42', adminName: 'System Engine', adminRole: 'Automated Task', adminInitials: 'SYS', actionDetails: 'Daily automated database backup to cloud storage completed', type: 'system' },
    { id: '3', date: '30-10-2026', time: '09:05:11', adminName: 'Nguyen Van A', adminRole: 'Academic Admin', adminInitials: 'NA', actionDetails: 'Created new course IELTS Intensive Mastery (IEL-INT-01)', type: 'user' },
];

export const DashboardService = {
    getStats: async (): Promise<DashboardStatsData> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 300));
    },
    getRecentTransactions: async (): Promise<DashboardTransaction[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_RECENT_TRANSACTIONS), 300));
    },
    getAuditLogs: async (): Promise<DashboardAuditLog[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_AUDIT_LOGS), 300));
    }
};
