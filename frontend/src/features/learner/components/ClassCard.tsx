import { BookOpen, MapPin, Calendar, User, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LearnerClass } from '../types/class';

interface ClassCardProps {
    classItem: LearnerClass;
}

export const ClassCard = ({ classItem }: ClassCardProps) => {
    return (
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1.5 hover:border-[#0061a5]/30 transition-all duration-300 group">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#e3f2fd] to-[#cce5ff] flex items-center justify-center text-[#0061a5] shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-7 h-7" />
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-widest ${classItem.status === 'Ongoing' ? 'bg-[#0061a5] text-white shadow-md' : 'bg-[#eef0f4] text-[#74777f]'}`}>
                        {classItem.status}
                    </span>
                </div>
                
                <p className="text-xs font-bold text-[#0061a5] mb-1.5 uppercase tracking-widest">{classItem.courseName}</p>
                <h2 className="text-xl font-extrabold text-[#002045] mb-6 leading-tight group-hover:text-[#0061a5] transition-colors">{classItem.className} <span className="text-[#74777f] font-semibold text-base">({classItem.classCode})</span></h2>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0061a5] flex items-center justify-center shrink-0">
                            <User className="w-4 h-4" />
                        </div>
                        <p className="font-semibold text-[#181c1e]">{classItem.tutorName}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <p className="font-medium text-[#43474e]">{classItem.room}</p>
                    </div>
                    <div className="flex flex-col gap-2 pt-3 border-t border-[#eef0f4]">
                        <div className="flex items-center gap-1.5 text-[#74777f]">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="font-medium text-[#181c1e] text-sm">Schedule</span>
                        </div>
                        {classItem.schedules && classItem.schedules.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {classItem.schedules.map((schedule, idx) => {
                                    const match = schedule.match(/^(.*?) \((.*)\)$/);
                                    if (match) {
                                        return (
                                            <div key={idx} className="flex flex-col bg-blue-50/50 border border-blue-100 rounded-md px-2.5 py-1.5 w-full sm:w-auto">
                                                <span className="text-[13px] font-bold text-[#0061a5]">{match[1]}</span>
                                                <span className="text-xs text-[#0061a5]/80 mt-0.5">{match[2]}</span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={idx} className="bg-blue-50/50 border border-blue-100 rounded-md px-2.5 py-1.5 text-xs text-[#0061a5] w-full sm:w-auto">
                                            {schedule}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <span className="text-sm text-[#43474e]">TBA</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-sm pt-3 border-t border-[#eef0f4]">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-4 h-4" />
                        </div>
                        <p className="font-medium text-[#43474e]">{classItem.startDate} - {classItem.endDate}</p>
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-t border-[#eef0f4] bg-white grid grid-cols-2 gap-3">
                <Link to={`/learner/classes/${classItem.id}`} className="flex items-center justify-center py-2.5 bg-[#002045] text-white rounded-xl text-sm font-bold hover:bg-[#0061a5] hover:shadow-md transition-all">
                    View Details
                </Link>
                <Link to={`/learner/classes/${classItem.id}/attendance`} className="flex items-center justify-center py-2.5 bg-white border border-[#002045] text-[#002045] rounded-xl text-sm font-bold hover:bg-[#e3f2fd] transition-all">
                    Attendance
                </Link>
            </div>
        </div>
    );
};
