export interface LearnerDashboardStats {
    activeClasses: number;
    attendanceRate: number;
    averageScore: number;
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

export interface LearnerPendingTask {
    id: string;
    title: string;
    courseName?: string;
    dueDate: string;
    iconType: 'FileText' | 'CreditCard' | 'AlertCircle';
    bg: string;
    color: string;
    link: string;
}
