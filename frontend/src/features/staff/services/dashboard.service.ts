import type { StaffDashboardStats, StaffPendingTask, StaffUpcomingClass } from '../types/dashboard';

const MOCK_STATS: StaffDashboardStats = {
    totalLearners: 1234,
    activeClasses: 45,
    pendingInvoices: 12,
    openTickets: 8
};

const MOCK_TASKS: StaffPendingTask[] = [
    { title: 'Approve Tutor Profile: Alex Johnson', type: 'Profile Verification', time: '2 hours ago', iconType: 'FileText', bg: 'bg-blue-50', color: 'text-blue-600', link: '/staff/profiles' },
    { title: 'Assign Consultation: New IELTS Student', type: 'Consultation', time: '5 hours ago', iconType: 'MessageSquare', bg: 'bg-purple-50', color: 'text-purple-600', link: '/staff/consultations' },
    { title: 'Refund Request: INV-10025', type: 'Payment', time: '1 day ago', iconType: 'DollarSign', bg: 'bg-rose-50', color: 'text-rose-600', link: '/staff/invoices' },
];

const MOCK_CLASSES: StaffUpcomingClass[] = [
    { time: '08:00 - 10:00', name: 'IE1601', room: 'Room 301', tutor: 'Dr. Sarah Smith', status: 'In Progress' },
    { time: '10:30 - 12:30', name: 'COM202', room: 'Room 205', tutor: 'Ms. Emily Chen', status: 'Upcoming' },
    { time: '14:00 - 16:00', name: 'TOEIC-B12', room: 'Room 202', tutor: 'Mr. John Doe', status: 'Upcoming' },
    { time: '18:00 - 20:00', name: 'ENG401', room: 'Room 402', tutor: 'Mr. Alan Wake', status: 'Upcoming' },
];

export const StaffDashboardService = {
    getStats: async (): Promise<StaffDashboardStats> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 200));
    },
    getPendingTasks: async (): Promise<StaffPendingTask[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_TASKS), 200));
    },
    getUpcomingClasses: async (): Promise<StaffUpcomingClass[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLASSES), 200));
    }
};
