import { BookOpen, TrendingUp, Award } from 'lucide-react';
import type { LearnerDashboardStats } from '../types/dashboard';

interface DashboardStatsProps {
    stats: LearnerDashboardStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e0e3e5] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0f4f8] flex items-center justify-center text-[#0061a5]">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Active Classes</p>
                    <div className="flex items-baseline gap-1.5 mb-1">
                        <p className="text-2xl font-black text-[#002045] tracking-tight leading-none">{stats.activeClasses}</p>
                        <p className="text-xs font-bold text-slate-400">classes</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e0e3e5] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[#22c55e]">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Attendance Rate</p>
                    <p className="text-2xl font-black text-[#002045] tracking-tight leading-none">{stats.attendanceRate}%</p>
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e0e3e5] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#fff8f0] flex items-center justify-center text-[#f97316]">
                    <Award className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">Completed Lessons</p>
                    <div className="flex items-baseline gap-1.5 mb-1">
                        <p className="text-2xl font-black text-[#002045] tracking-tight leading-none">{stats.completedLessons}</p>
                        <p className="text-xs font-medium text-slate-400">lessons</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
