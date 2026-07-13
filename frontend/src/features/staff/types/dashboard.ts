export interface StaffDashboardStats {
    totalLearners: number;
    activeClasses: number;
    pendingInvoices: number;
    openTickets: number;
    pendingChangeRequests: number;
    pendingConsultations: number;
}

export interface StaffPendingTask {
    title: string;
    type: string;
    time: string;
    link: string;
    iconType: 'FileText' | 'MessageSquare' | 'DollarSign';
    bg: string;
    color: string;
}

export interface StaffUpcomingClass {
    time: string;
    name: string;
    room: string;
    tutor: string;
    status: 'In Progress' | 'Upcoming';
    courseName: string;
    sessionNumber: number;
}
