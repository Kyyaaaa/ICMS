import { Edit, Trash2, Globe, Users, BookOpen, CalendarClock, User } from 'lucide-react';
import type { Announcement, TargetAudience, AudienceScope } from '../types/announcement';

interface AnnouncementCardProps {
    announcement: Announcement;
    availableClasses: { id: string; name: string }[];
    onEdit: (announcement: Announcement) => void;
    onDelete: (id: string) => void;
}

import { formatDateTime } from '../../../shared/utils/date';

export const AnnouncementCard = ({ announcement, availableClasses, onEdit, onDelete }: AnnouncementCardProps) => {
    const formatAudienceText = (audience: TargetAudience) => {
        if (audience.scope === 'System Wide') return "All Users (System Wide)";
        if (audience.scope === 'Specific Roles') return audience.roles.length > 0 ? `Roles: ${audience.roles.join(', ')}` : "All Roles";
        if (audience.scope === 'Specific Classes') {
            if (audience.classes.length === 0) return "All Classes";
            const classNames = audience.classes.map(cid => availableClasses.find(c => c.id === cid)?.name).filter(Boolean);
            return `Classes: ${classNames.join(', ')}`;
        }
        if (audience.scope === 'Specific Users') {
            if (audience.userNames && audience.userNames.length > 0) {
                return audience.userNames.join(', ');
            }
            return `Specific Users (${audience.users?.length || 0})`;
        }
        return "Unknown";
    };

    const getAudienceIcon = (scope: AudienceScope) => {
        if (scope === 'System Wide') return <Globe className="w-5 h-5 text-green-600" />;
        if (scope === 'Specific Roles') return <Users className="w-5 h-5 text-blue-600" />;
        if (scope === 'Specific Classes') return <BookOpen className="w-5 h-5 text-purple-600" />;
        return <User className="w-5 h-5 text-purple-600" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 hover:border-[#c4c6cf] transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        announcement.audience.scope === 'System Wide' ? 'bg-green-100' :
                        announcement.audience.scope === 'Specific Roles' ? 'bg-blue-100' : 
                        announcement.audience.scope === 'Specific Classes' ? 'bg-purple-100' : 'bg-purple-50'
                    }`}>
                        {getAudienceIcon(announcement.audience.scope)}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-[#181c1e]">{announcement.title}</h3>
                        <p className="text-sm text-[#43474e] mt-2 max-w-4xl leading-relaxed whitespace-pre-wrap">
                            {announcement.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-bold">
                            {announcement.status === 'Scheduled' ? (
                                <span className="text-[#854c0e] bg-[#fef08a] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <CalendarClock size={14} /> Scheduled for: {formatDateTime(announcement.scheduledFor)}
                                </span>
                            ) : (
                                <span className="text-[#74777f] bg-[#f1f4f6] px-3 py-1.5 rounded-lg">Posted: {formatDateTime(announcement.date)}</span>
                            )}
                            <span className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                                announcement.audience.scope === 'System Wide' ? 'text-green-700 bg-green-50 border border-green-200' :
                                announcement.audience.scope === 'Specific Roles' ? 'text-blue-700 bg-blue-50 border border-blue-200' : 
                                announcement.audience.scope === 'Specific Classes' ? 'text-purple-700 bg-purple-50 border border-purple-200' :
                                'text-[#5a3b7c] bg-[#f5ecff] border border-[#dcb8ff]'
                            }`}>
                                Target: {formatAudienceText(announcement.audience)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 shrink-0 md:pl-4 mt-4 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#e0e3e5]">
                    <button onClick={() => onEdit(announcement)} className="px-4 py-2 md:p-2.5 text-[#0061a5] bg-[#e6f0fa] hover:bg-[#cce0f5] rounded-xl transition-colors flex items-center gap-2" title="Edit Announcement">
                        <Edit size={18} /> <span className="md:hidden font-bold text-xs">Edit</span>
                    </button>
                    <button onClick={() => onDelete(announcement.id)} className="px-4 py-2 md:p-2.5 text-[#ba1a1a] bg-[#ffebed] hover:bg-[#ffd6da] rounded-xl transition-colors flex items-center gap-2" title="Delete Announcement">
                        <Trash2 size={18} /> <span className="md:hidden font-bold text-xs">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
