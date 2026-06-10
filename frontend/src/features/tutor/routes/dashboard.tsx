import { useState, useEffect } from 'react';
import { TutorDashboardService } from '../services/dashboard.service';
import type { TutorDashboardStats, TutorPendingTask, TutorUpcomingClass } from '../types/dashboard';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardPendingTasks } from '../components/DashboardPendingTasks';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { DashboardUpcomingClasses } from '../components/DashboardUpcomingClasses';

const TutorDashboard = () => {
    const [stats, setStats] = useState<TutorDashboardStats | null>(null);
    const [tasks, setTasks] = useState<TutorPendingTask[]>([]);
    const [classes, setClasses] = useState<TutorUpcomingClass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            const [statsData, tasksData, classesData] = await Promise.all([
                TutorDashboardService.getStats(),
                TutorDashboardService.getPendingTasks(),
                TutorDashboardService.getUpcomingClasses()
            ]);
            setStats(statsData);
            setTasks(tasksData);
            setClasses(classesData);
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Tutor Dashboard</h1>
            
            {loading || !stats ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-[12px] bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <DashboardStats stats={stats} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <DashboardPendingTasks tasks={tasks} />
                            <DashboardQuickActions />
                        </div>

                        <DashboardUpcomingClasses classes={classes} />
                    </div>
                </>
            )}
        </div>
    );
};

export default TutorDashboard;
