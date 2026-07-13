import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LearnerUpcomingClass } from '../types/dashboard';

interface DashboardUpcomingClassesProps {
    classes: LearnerUpcomingClass[];
}

export const DashboardUpcomingClasses = ({ classes }: DashboardUpcomingClassesProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 h-full flex flex-col">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[#002045]">Next Classes</h2>
                    <p className="text-sm text-slate-500 mt-1">Your upcoming schedule</p>
                </div>
                <Link to="/learner/schedules" className="text-[#0061a5] text-sm font-bold hover:underline flex items-center gap-1.5 transition-colors">
                    View all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            <div className="space-y-4 flex-1">
                {classes.map(cls => (
                    <div key={cls.id} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-[#e0e3e5] rounded-xl hover:border-[#0061a5]/30 hover:shadow-sm transition-all duration-300 bg-white cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 bg-linear-to-br from-[#e3f2fd] to-[#cce5ff] text-[#0061a5] rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <span className="text-[10px] font-black uppercase tracking-wider">{cls.month}</span>
                            <span className="text-xl font-black leading-none">{cls.day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-[#0061a5] mb-0.5 truncate" title={cls.courseName}>{cls.courseName}</div>
                            <h3 className="font-extrabold text-sm text-[#002045] group-hover:text-[#0061a5] transition-colors truncate">
                                {cls.name} <span className="text-[#74777f] font-medium font-sans">· Session {cls.sessionNumber}</span>
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0061a5]"></span>
                                    {cls.time}
                                </p>
                                <p className="text-xs font-medium text-slate-500 shrink-0">{cls.room}</p>
                            </div>
                            <p className="text-[11px] font-semibold text-slate-400 mt-1.5 uppercase tracking-widest truncate">Tutor: <span className="text-slate-600">{cls.tutor}</span></p>
                        </div>
                    </div>
                ))}
                {classes.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#e0e3e5] rounded-2xl bg-[#f8fafd]">
                        <p className="text-sm font-semibold text-[#181c1e] mb-1">No upcoming classes</p>
                        <p className="text-xs text-[#74777f]">You don't have any classes scheduled right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
