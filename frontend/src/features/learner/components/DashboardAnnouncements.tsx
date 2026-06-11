import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LearnerAnnouncement } from '../types/dashboard';

interface DashboardAnnouncementsProps {
    announcements: LearnerAnnouncement[];
}

export const DashboardAnnouncements = ({ announcements }: DashboardAnnouncementsProps) => {
    return (
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] p-8">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-extrabold text-[#002045]">Announcements</h2>
                    <p className="text-sm text-slate-500 mt-1">Updates from your center</p>
                </div>
                <Link to="/learner/notifications" className="text-[#0061a5] text-sm font-bold hover:underline flex items-center gap-1.5 transition-colors">
                    View all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="space-y-4">
                {announcements.map((ann, idx) => (
                    <div key={ann.id} className={`group cursor-pointer p-4 rounded-2xl hover:bg-[#f8f9fc] transition-colors ${ann.isUnread ? 'bg-[#fcfdfd]' : ''} ${idx < announcements.length - 1 ? 'border-b border-[#eef0f4]' : ''}`}>
                        <div className="flex justify-between items-start mb-1.5">
                            <h3 className={`font-bold text-[15px] group-hover:text-[#0061a5] transition-colors ${ann.isUnread ? 'text-[#002045]' : 'text-slate-600'}`}>
                                {ann.title}
                            </h3>
                            {ann.isUnread && (
                                <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0061a5] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0061a5]"></span>
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>
                        <span className="text-[11px] font-bold text-slate-400 mt-3 block uppercase tracking-widest">{ann.timeAgo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
