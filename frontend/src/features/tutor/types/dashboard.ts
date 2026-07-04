export interface TutorDashboardStats {
    activeClasses: number;
    upcomingSessions: number;
    pendingRequests: number;
    totalStudents: number;
}

export interface TutorPendingTask {
    title: string;
    type: string;
    time: string;
    link: string;
    iconType: 'CheckSquare' | 'FileText' | 'Calendar';
    bg: string;
    color: string;
}

export interface TutorUpcomingClass {
    time: string;
    name: string;
    courseName: string;
    sessionNumber: number;
    room: string;
    status: 'In Progress' | 'Upcoming';
}
