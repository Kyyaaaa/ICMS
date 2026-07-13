import { Users, BookOpen, Activity, FileText, PhoneCall } from 'lucide-react';
import type { StaffDashboardStats } from '../types/dashboard';

interface DashboardStatsProps {
    stats: StaffDashboardStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    const items = [
        { title: 'Total Learners', value: stats.totalLearners.toLocaleString('en-US'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Active Classes', value: stats.activeClasses, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'Change Requests', value: stats.pendingChangeRequests, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Consultations', value: stats.pendingConsultations, icon: PhoneCall, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { title: 'Open Tickets', value: stats.openTickets, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {items.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e5] flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-[#74777f] text-xs font-semibold whitespace-nowrap">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-[#002045]">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};
