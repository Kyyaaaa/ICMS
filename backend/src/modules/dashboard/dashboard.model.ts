export interface LearnerDashboardStats {
    activeClasses: number;
    attendanceRate: number;
    completedLessons: number;
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

export interface LearnerPendingTask {
    id: string;
    title: string;
    courseName?: string;
    dueDate: string;
    iconType: string;
    bg: string;
    color: string;
    link: string;
}

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
    iconType: string;
    bg: string;
    color: string;
}

export interface TutorUpcomingClass {
    time: string;
    name: string;
    room: string;
    status: string;
}

export interface StaffDashboardStats {
    totalLearners: number;
    activeClasses: number;
    pendingInvoices: number;
    openTickets: number;
}

export interface StaffPendingTask {
    title: string;
    type: string;
    time: string;
    link: string;
    iconType: string;
    bg: string;
    color: string;
}

export interface StaffUpcomingClass {
    time: string;
    name: string;
    room: string;
    tutor: string;
    status: string;
}

export interface AdminDashboardStats {
    totalRevenue: number;
    totalLearners: number;
    totalCourses: number;
    totalClasses: number;
    totalClassrooms: number;
}

export interface AdminDashboardTransaction {
    id: string;
    type: string;
    category: string;
    description: string;
    user: {
        name: string;
        role: string;
    };
    date: string;
    amount: number;
    status: string;
}
