import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LearnerAnnouncement } from '../types/dashboard';

interface DashboardAnnouncementsProps {
    announcements: LearnerAnnouncement[];
}

export const DashboardAnnouncements = ({ announcements }: DashboardAnnouncementsProps) => {
    return (
        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
            <div className="flex justify-between items-center mb-[16px]">
                <h2 className="text-[18px] font-semibold text-[#181c1e]">Recent Announcements</h2>
                <Link to="/learner/notifications" className="text-[#0061a5] text-[14px] font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="space-y-[16px]">
                {announcements.map((ann, idx) => (
                    <div key={ann.id} className={`${idx < announcements.length - 1 ? 'border-b border-[#e0e3e5] pb-[12px]' : 'pb-[4px]'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-bold hover:text-[#0061a5] cursor-pointer transition-colors ${ann.isUnread ? 'text-[#002045]' : 'text-[#43474e]'}`}>
                                {ann.title}
                            </h3>
                            {ann.isUnread && <span className="w-2 h-2 bg-[#0061a5] rounded-full mt-1.5 shrink-0"></span>}
                        </div>
                        <p className="text-[14px] text-[#43474e] mt-1 line-clamp-2">{ann.content}</p>
                        <span className="text-[12px] text-[#74777f] mt-2 block">{ann.timeAgo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
