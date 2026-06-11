import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LearnerUpcomingClass } from '../types/dashboard';

interface DashboardUpcomingClassesProps {
    classes: LearnerUpcomingClass[];
}

export const DashboardUpcomingClasses = ({ classes }: DashboardUpcomingClassesProps) => {
    return (
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] p-8">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-extrabold text-[#002045]">Next Classes</h2>
                    <p className="text-sm text-slate-500 mt-1">Your upcoming schedule</p>
                </div>
                <Link to="/learner/schedules" className="text-[#0061a5] text-sm font-bold hover:underline flex items-center gap-1.5 transition-colors">
                    View all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="space-y-4">
                {classes.map(cls => (
                    <div key={cls.id} className="group flex flex-col sm:flex-row sm:items-center gap-5 p-5 border border-[#eef0f4] rounded-2xl hover:border-[#0061a5]/30 hover:shadow-md transition-all duration-300 bg-white cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-16 h-16 shrink-0 bg-linear-to-br from-[#e3f2fd] to-[#cce5ff] text-[#0061a5] rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <span className="text-[11px] font-black uppercase tracking-wider">{cls.month}</span>
                            <span className="text-2xl font-black leading-none">{cls.day}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-extrabold text-[16px] text-[#002045] group-hover:text-[#0061a5] transition-colors">{cls.name}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0061a5]"></span>
                                    {cls.time}
                                </p>
                                <p className="text-sm font-medium text-slate-500">{cls.room}</p>
                            </div>
                            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">Tutor: <span className="text-slate-600">{cls.tutor}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
