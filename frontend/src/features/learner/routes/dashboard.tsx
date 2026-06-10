import { useState, useEffect } from 'react';
import { LearnerDashboardService } from '../services/dashboard.service';
import type { LearnerDashboardStats, LearnerUpcomingClass, LearnerAnnouncement } from '../types/dashboard';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardUpcomingClasses } from '../components/DashboardUpcomingClasses';
import { DashboardAnnouncements } from '../components/DashboardAnnouncements';

const LearnerDashboard = () => {
    const [stats, setStats] = useState<LearnerDashboardStats | null>(null);
    const [classes, setClasses] = useState<LearnerUpcomingClass[]>([]);
    const [announcements, setAnnouncements] = useState<LearnerAnnouncement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            const [statsData, classesData, announcementsData] = await Promise.all([
                LearnerDashboardService.getStats(),
                LearnerDashboardService.getUpcomingClasses(),
                LearnerDashboardService.getAnnouncements()
            ]);
            setStats(statsData);
            setClasses(classesData);
            setAnnouncements(announcementsData);
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-[24px] animate-fade-in-up pb-8">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Dashboard</h1>
            
            {loading || !stats ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-[12px] bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <DashboardStats stats={stats} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                        <DashboardUpcomingClasses classes={classes} />
                        <DashboardAnnouncements announcements={announcements} />
                    </div>
                </>
            )}
        </div>
    );
};

export default LearnerDashboard;
