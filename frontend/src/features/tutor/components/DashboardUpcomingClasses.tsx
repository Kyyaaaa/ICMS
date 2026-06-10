import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import type { TutorUpcomingClass } from '../types/dashboard';

interface DashboardUpcomingClassesProps {
    classes: TutorUpcomingClass[];
}

export const DashboardUpcomingClasses = ({ classes }: DashboardUpcomingClassesProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] font-bold text-[#002045] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#0061a5]" /> Today's Schedule
                </h2>
            </div>
            
            <div className="space-y-4">
                {classes.map((cls, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-[#e0e3e5] pb-4 last:pb-0">
                        <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${cls.status === 'In Progress' ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]' : 'bg-[#c4c6cf]'}`}></div>
                        <div className="text-[12px] font-bold text-[#0061a5] mb-1">{cls.time}</div>
                        <h4 className="font-extrabold text-[#002045] text-[14px] leading-tight mb-1">{cls.name}</h4>
                        <div className="flex items-center gap-2 text-[12px] text-[#74777f]">
                            <MapPin className="w-3 h-3" />
                            <span className="font-semibold text-[#43474e]">{cls.room}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <Link to="/tutor/schedule" className="mt-6 w-full py-2.5 rounded-lg border border-[#c4c6cf] text-[#43474e] font-bold text-[14px] hover:bg-[#f8f9fa] transition-colors flex items-center justify-center gap-2">
                View Full Schedule
            </Link>
        </div>
    );
};
