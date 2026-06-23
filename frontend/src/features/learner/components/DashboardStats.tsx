import { BookOpen, TrendingUp, Award } from 'lucide-react';
import type { LearnerDashboardStats } from '../types/dashboard';

interface DashboardStatsProps {
    stats: LearnerDashboardStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#f0f4f8] flex items-center justify-center text-[#0061a5]">
                    <BookOpen className="w-8 h-8" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Active Classes</p>
                    <div className="flex items-baseline gap-2 mb-1.5">
                        <p className="text-3xl font-black text-[#002045] tracking-tight leading-none">{stats.activeClasses}</p>
                        <p className="text-sm font-bold text-slate-400">classes</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] flex items-center justify-center text-[#22c55e]">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Attendance Rate</p>
                    <p className="text-3xl font-black text-[#002045] tracking-tight">{stats.attendanceRate}%</p>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#fff8f0] flex items-center justify-center text-[#f97316]">
                    <Award className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Average Band</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-[#002045] tracking-tight">{stats.averageScore.toFixed(1)}</p>
                        <p className="text-sm font-medium text-slate-400">/ 9.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
