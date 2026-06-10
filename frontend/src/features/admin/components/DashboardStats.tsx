import { Users, BookOpen, DollarSign, MonitorPlay, BookMarked } from 'lucide-react';
import type { DashboardStatsData } from '../types/dashboard';

interface DashboardStatsProps {
    stats: DashboardStatsData;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                        <DollarSign size={20} />
                    </div>
                </div>
                <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
                <p className="text-[20px] font-extrabold text-[#181c1e]">{stats.totalRevenue.toLocaleString()} đ</p>
            </div>

            <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#e8def8] flex items-center justify-center text-[#6750a4]">
                        <Users size={20} />
                    </div>
                </div>
                <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Learners</h3>
                <p className="text-[20px] font-extrabold text-[#181c1e]">{stats.totalLearners.toLocaleString()}</p>
            </div>

            <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#fceeee] flex items-center justify-center text-[#ba1a1a]">
                        <BookOpen size={20} />
                    </div>
                </div>
                <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Courses</h3>
                <p className="text-[20px] font-extrabold text-[#181c1e]">{stats.totalCourses}</p>
            </div>

            <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                        <BookMarked size={20} />
                    </div>
                </div>
                <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Classes</h3>
                <p className="text-[20px] font-extrabold text-[#181c1e]">{stats.totalClasses}</p>
            </div>

            <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#137333]">
                        <MonitorPlay size={20} />
                    </div>
                </div>
                <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Classrooms</h3>
                <p className="text-[20px] font-extrabold text-[#181c1e]">{stats.totalClassrooms}</p>
            </div>
        </div>
    );
};
