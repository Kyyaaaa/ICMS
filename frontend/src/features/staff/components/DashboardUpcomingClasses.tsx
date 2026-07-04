import { Link } from 'react-router-dom';
import type { StaffUpcomingClass } from '../types/dashboard';

interface DashboardUpcomingClassesProps {
    classes: StaffUpcomingClass[];
}

export const DashboardUpcomingClasses = ({ classes }: DashboardUpcomingClassesProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-[#002045]">Next Classes</h2>
                <p className="text-sm text-[#43474e] mt-1">Campus active sessions</p>
            </div>

            <div className="space-y-4 flex-1">
                {classes.map((cls, i) => (
                    <div key={i} className="relative pl-3 border-l-2 border-[#e0e3e5] pb-4 last:pb-0">
                        <div className={`absolute -left-1.25 top-1.5 w-2 h-2 rounded-full ${cls.status === 'In Progress' ? 'bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)]' : 'bg-[#c4c6cf]'}`}></div>
                        <div className="text-[11px] font-bold text-[#0061a5] mb-0.5 truncate" title={cls.courseName}>{cls.courseName}</div>
                        <h4 className="font-extrabold text-[#002045] text-[13px] leading-tight mb-1.5">
                            {cls.name} <span className="text-[#74777f] font-medium font-sans">· Session {cls.sessionNumber}</span>
                        </h4>
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#74777f]">
                            <span className="font-medium text-[#43474e] whitespace-nowrap">{cls.time}</span>
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="font-medium text-[#43474e] truncate max-w-22.5" title={cls.tutor}>{cls.tutor}</span>
                                <span className="w-1 h-1 rounded-full bg-[#c4c6cf] mx-0.5"></span>
                                <span className="font-semibold text-[#43474e] whitespace-nowrap">{cls.room}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {classes.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#e0e3e5] rounded-2xl bg-[#f8fafd]">
                        <p className="text-sm font-semibold text-[#181c1e] mb-1">No upcoming classes</p>
                        <p className="text-xs text-[#74777f]">There are no classes scheduled right now.</p>
                    </div>
                )}
            </div>
            
            <Link to="/staff/master-schedule" className="mt-6 w-full py-2.5 rounded-lg border border-[#c4c6cf] text-[#43474e] font-bold text-sm hover:bg-[#f8f9fa] transition-colors flex items-center justify-center gap-2">
                View Full Schedule
            </Link>
        </div>
    );
};
