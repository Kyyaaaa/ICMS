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
    paidAmount?: number;
    status: string;
    isInstallment?: boolean;
}
