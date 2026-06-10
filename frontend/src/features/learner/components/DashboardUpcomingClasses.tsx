import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LearnerUpcomingClass } from '../types/dashboard';

interface DashboardUpcomingClassesProps {
    classes: LearnerUpcomingClass[];
}

export const DashboardUpcomingClasses = ({ classes }: DashboardUpcomingClassesProps) => {
    return (
        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
            <div className="flex justify-between items-center mb-[16px]">
                <h2 className="text-[18px] font-semibold text-[#181c1e]">Next Classes</h2>
                <Link to="/learner/schedules" className="text-[#0061a5] text-[14px] font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="space-y-[16px]">
                {classes.map(cls => (
                    <div key={cls.id} className="flex gap-[16px] p-[12px] border border-[#e0e3e5] rounded-[8px] hover:bg-[#f7fafc] transition-colors">
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#d2e4ff] text-[#0061a5] rounded-[8px]">
                            <span className="text-[12px] font-semibold uppercase">{cls.month}</span>
                            <span className="text-[20px] font-bold">{cls.day}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-[#181c1e]">{cls.name}</h3>
                            <p className="text-[14px] text-[#43474e] mt-1">{cls.time} • {cls.room}</p>
                            <p className="text-[12px] text-[#74777f] mt-1">Tutor: {cls.tutor}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
