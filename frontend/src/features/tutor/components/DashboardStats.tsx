import { Users, BookOpen, Calendar, RefreshCcw } from 'lucide-react';
import type { TutorDashboardStats } from '../types/dashboard';

interface DashboardStatsProps {
    stats: TutorDashboardStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    const items = [
        { title: 'Active Classes', value: stats.activeClasses, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Upcoming Sessions', value: stats.upcomingSessions, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'Pending Requests', value: stats.pendingRequests, icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-100' },
        { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e5] flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-[#74777f] text-[13px] font-semibold">{stat.title}</p>
                        <h3 className="text-[24px] font-bold text-[#002045]">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};
