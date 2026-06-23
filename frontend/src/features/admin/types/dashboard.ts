export interface DashboardStatsData {
    totalRevenue: number;
    totalLearners: number;
    totalCourses: number;
    totalClasses: number;
    totalClassrooms: number;
}

export interface DashboardTransaction {
    id: string;
    type: string;
    category: string;
    description: string;
    user: { name: string; role: string };
    date: string;
    amount: number;
    status: string;
}

export interface DashboardAuditLog {
    id: string;
    date: string;
    time: string;
    adminName: string;
    adminRole: string;
    adminInitials: string;
    actionDetails: string;
    type: 'system' | 'user';
}
