import type { LearnerDashboardStats, LearnerUpcomingClass, LearnerAnnouncement } from '../types/dashboard';

const MOCK_STATS: LearnerDashboardStats = {
    activeClasses: 2,
    unpaidInvoices: 1,
    upcomingSessions: 4
};

const MOCK_CLASSES: LearnerUpcomingClass[] = [
    { id: '1', month: 'Oct', day: '12', name: 'IELTS Academic - Reading', time: '18:00 - 20:00', room: 'Room 302', tutor: 'Sarah Jenkins' }
];

const MOCK_ANNOUNCEMENTS: LearnerAnnouncement[] = [
    { id: '1', title: 'Class Reminder', content: 'Your Intensive Reading class starts in 1 hour.', timeAgo: '10 mins ago', isUnread: true },
    { id: '2', title: 'Assignment Graded', content: 'Your Writing Task 2 has been graded. Score: 7.5', timeAgo: '2 hours ago', isUnread: true },
    { id: '3', title: 'System Maintenance', content: 'ICMS platform will be down for maintenance this Sunday at 2 AM.', timeAgo: '1 day ago', isUnread: false },
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
    }
};
