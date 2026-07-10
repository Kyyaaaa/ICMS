import { Users, BookOpen, DollarSign, MonitorPlay, BookMarked } from 'lucide-react';
import type { DashboardStatsData } from '../types/dashboard';

interface DashboardStatsProps {
    stats: DashboardStatsData;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    const statsList = [
        { title: 'Total Revenue', value: `${stats.totalRevenue.toLocaleString()} VND`, icon: DollarSign, colorClass: 'bg-[#d2e4ff] text-[#0061a5]' },
        { title: 'Total Learners', value: stats.totalLearners.toLocaleString(), icon: Users, colorClass: 'bg-[#e8def8] text-[#6750a4]' },
        { title: 'Total Courses', value: stats.totalCourses.toString(), icon: BookOpen, colorClass: 'bg-[#fceeee] text-[#ba1a1a]' },
        { title: 'Total Classes', value: stats.totalClasses.toString(), icon: BookMarked, colorClass: 'bg-[#e6f0fa] text-[#0061a5]' },
        { title: 'Classrooms', value: stats.totalClassrooms.toString(), icon: MonitorPlay, colorClass: 'bg-[#e6f4ea] text-[#137333]' }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {statsList.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index}
                        className="bg-white p-5 rounded-xl shadow-sm border border-[#e0e3e5]"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className={`w-10 h-10 rounded-full ${stat.colorClass} flex items-center justify-center`}>
                                <Icon size={20} />
                            </div>
                        </div>
                        <h3 className="text-[#43474e] text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
                        <p className="text-xl font-extrabold text-[#181c1e]">{stat.value}</p>
                    </div>
                );
            })}
        </div>
    );
};
