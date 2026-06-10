import { BookOpen, Calendar, DollarSign } from 'lucide-react';
import type { LearnerDashboardStats } from '../types/dashboard';

interface DashboardStatsProps {
    stats: LearnerDashboardStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            <div className="bg-white p-[24px] rounded-[12px] shadow-sm border border-[#e0e3e5] flex items-center gap-[16px]">
                <div className="w-12 h-12 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[14px] text-[#43474e] font-medium">Active Classes</p>
                    <p className="text-[24px] font-bold text-[#181c1e]">{stats.activeClasses}</p>
                </div>
            </div>
            <div className="bg-white p-[24px] rounded-[12px] shadow-sm border border-[#e0e3e5] flex items-center gap-[16px]">
                <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[14px] text-[#43474e] font-medium">Unpaid Invoices</p>
                    <p className="text-[24px] font-bold text-[#ba1a1a]">{stats.unpaidInvoices}</p>
                </div>
            </div>
            <div className="bg-white p-[24px] rounded-[12px] shadow-sm border border-[#e0e3e5] flex items-center gap-[16px]">
                <div className="w-12 h-12 rounded-full bg-[#e5e9eb] flex items-center justify-center text-[#43474e]">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[14px] text-[#43474e] font-medium">Upcoming Sessions</p>
                    <p className="text-[24px] font-bold text-[#181c1e]">{stats.upcomingSessions} this week</p>
                </div>
            </div>
        </div>
    );
};
