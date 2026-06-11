import { useState, useEffect } from 'react';
import { LearnerDashboardService } from '../services/dashboard.service';
import type { LearnerDashboardStats, LearnerUpcomingClass, LearnerPendingTask } from '../types/dashboard';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardUpcomingClasses } from '../components/DashboardUpcomingClasses';

import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { DashboardPendingTasks } from '../components/DashboardPendingTasks';

const LearnerDashboard = () => {
    const [stats, setStats] = useState<LearnerDashboardStats | null>(null);
    const [classes, setClasses] = useState<LearnerUpcomingClass[]>([]);
    const [pendingTasks, setPendingTasks] = useState<LearnerPendingTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            const [statsData, classesData, tasksData] = await Promise.all([
                LearnerDashboardService.getStats(),
                LearnerDashboardService.getUpcomingClasses(),
                LearnerDashboardService.getPendingTasks()
            ]);
            setStats(statsData);
            setClasses(classesData);
            setPendingTasks(tasksData);
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in-up pb-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#002045] leading-tight">
                        Dashboard
                    </h1>
                </div>
            </div>
            
            {loading || !stats ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-[12px] bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <DashboardStats stats={stats} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <DashboardUpcomingClasses classes={classes} />
                        <DashboardPendingTasks tasks={pendingTasks} />
                    </div>

                    <DashboardQuickActions />
                </>
            )}
        </div>
    );
};

export default LearnerDashboard;
