import type { TutorDashboardStats, TutorPendingTask, TutorUpcomingClass } from '../types/dashboard';

const MOCK_STATS: TutorDashboardStats = {
    activeClasses: 4,
    upcomingSessions: 12,
    pendingRequests: 2,
    totalStudents: 86
};

const MOCK_TASKS: TutorPendingTask[] = [
    { title: 'Mark Attendance for IE1601', type: 'Class IE1601', time: '1 hour ago', iconType: 'CheckSquare', bg: 'bg-blue-50', color: 'text-blue-600', link: '/tutor/attendance' },
    { title: 'Complete Session Report', type: 'Class TOEIC-B12', time: '3 hours ago', iconType: 'FileText', bg: 'bg-purple-50', color: 'text-purple-600', link: '/tutor/dashboard' },
    { title: 'Confirm Rescheduled Session', type: 'Class ENG401', time: '1 day ago', iconType: 'Calendar', bg: 'bg-amber-50', color: 'text-amber-600', link: '/tutor/change-requests' },
];

const MOCK_CLASSES: TutorUpcomingClass[] = [
    { time: '08:00 - 10:00', name: 'IE1601 (IELTS Mastery)', room: 'Room 301', status: 'In Progress' },
    { time: '14:00 - 16:00', name: 'TOEIC-B12', room: 'Room 202', status: 'Upcoming' },
];

export const TutorDashboardService = {
    getStats: async (): Promise<TutorDashboardStats> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 200));
    },
    getPendingTasks: async (): Promise<TutorPendingTask[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_TASKS), 200));
    },
    getUpcomingClasses: async (): Promise<TutorUpcomingClass[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLASSES), 200));
    }
};
