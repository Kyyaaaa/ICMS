import type { LearnerDashboardStats, LearnerUpcomingClass, LearnerAnnouncement, LearnerPendingTask } from '../types/dashboard';

const MOCK_STATS: LearnerDashboardStats = {
    activeClasses: 2,
    attendanceRate: 95,
    averageScore: 8.5
};

const MOCK_CLASSES: LearnerUpcomingClass[] = [
    { id: '1', month: 'Oct', day: '12', name: 'IELTS Academic - Reading', time: '18:00 - 20:00', room: 'Room 302', tutor: 'Sarah Jenkins' }
];

const MOCK_ANNOUNCEMENTS: LearnerAnnouncement[] = [
    { id: '1', title: 'Class Reminder', content: 'Your Intensive Reading class starts in 1 hour.', timeAgo: '10 mins ago', isUnread: true },
    { id: '2', title: 'Assignment Graded', content: 'Your Writing Task 2 has been graded. Score: 7.5', timeAgo: '2 hours ago', isUnread: true },
    { id: '3', title: 'System Maintenance', content: 'ICMS platform will be down for maintenance this Sunday at 2 AM.', timeAgo: '1 day ago', isUnread: false },
];

const MOCK_TASKS: LearnerPendingTask[] = [
    { id: '1', title: 'Complete Homework 3', courseName: 'IELTS Academic - Reading', dueDate: 'Due tomorrow', iconType: 'FileText', bg: 'bg-blue-50', color: 'text-blue-600', link: '/learner/classes/1' },
    { id: '2', title: 'Pay Tuition Fee', courseName: 'IELTS Academic - Reading', dueDate: 'Due in 3 days', iconType: 'CreditCard', bg: 'bg-amber-50', color: 'text-amber-600', link: '/learner/payments' },
];

export const LearnerDashboardService = {
    getStats: async (): Promise<LearnerDashboardStats> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 200));
    },
    getUpcomingClasses: async (): Promise<LearnerUpcomingClass[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLASSES), 200));
    },
    getAnnouncements: async (): Promise<LearnerAnnouncement[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_ANNOUNCEMENTS), 200));
    },
    getPendingTasks: async (): Promise<LearnerPendingTask[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_TASKS), 200));
    }
};
