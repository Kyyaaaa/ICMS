export interface LearnerDashboardStats {
    activeClasses: number;
    unpaidInvoices: number;
    upcomingSessions: number;
}

export interface LearnerUpcomingClass {
    id: string;
    month: string;
    day: string;
    name: string;
    time: string;
    room: string;
    tutor: string;
}

export interface LearnerAnnouncement {
    id: string;
    title: string;
    content: string;
    timeAgo: string;
    isUnread: boolean;
}
