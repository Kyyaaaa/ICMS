import { BookOpen, MapPin, Calendar, User, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LearnerClass } from '../types/class';

interface ClassCardProps {
    classItem: LearnerClass;
}

export const ClassCard = ({ classItem }: ClassCardProps) => {
    return (
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1.5 hover:border-[#0061a5]/30 transition-all duration-300 group">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#e3f2fd] to-[#cce5ff] flex items-center justify-center text-[#0061a5] shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <BookOpen className="w-7 h-7" />
                    </div>
                    <span className={`px-3 py-1.5 text-[11px] font-black rounded-lg uppercase tracking-widest ${classItem.status === 'Ongoing' ? 'bg-[#0061a5] text-white shadow-md' : 'bg-[#eef0f4] text-[#74777f]'}`}>
                        {classItem.status}
                    </span>
                </div>
                
                <p className="text-[12px] font-bold text-[#0061a5] mb-1.5 uppercase tracking-widest">{classItem.courseName}</p>
                <h2 className="text-[20px] font-extrabold text-[#002045] mb-6 leading-tight group-hover:text-[#0061a5] transition-colors">{classItem.className} <span className="text-[#74777f] font-semibold text-[16px]">({classItem.classCode})</span></h2>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[14px]">
                        <div className="w-8 h-8 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-[#0061a5]" />
                        </div>
                        <p className="font-semibold text-[#181c1e]">{classItem.tutorName}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[14px]">
                        <div className="w-8 h-8 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-[#0061a5]" />
                        </div>
                        <p className="font-medium text-[#43474e]">{classItem.room}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[14px]">
                        <div className="w-8 h-8 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-[#0061a5]" />
                        </div>
                        <p className="font-medium text-[#43474e]">{classItem.schedule} • {classItem.time}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[14px]">
                        <div className="w-8 h-8 rounded-full bg-[#f8f9fc] flex items-center justify-center shrink-0">
                            <CalendarDays className="w-4 h-4 text-[#0061a5]" />
                        </div>
                        <p className="font-medium text-[#43474e]">{classItem.startDate} - {classItem.endDate}</p>
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-t border-[#eef0f4] bg-white grid grid-cols-2 gap-3">
                <Link to={`/learner/classes/${classItem.id}`} className="flex items-center justify-center py-2.5 bg-[#002045] text-white rounded-xl text-[14px] font-bold hover:bg-[#0061a5] hover:shadow-md transition-all">
                    View Details
                </Link>
                <Link to={`/learner/classes/${classItem.id}/attendance`} className="flex items-center justify-center py-2.5 bg-white border border-[#002045] text-[#002045] rounded-xl text-[14px] font-bold hover:bg-[#e3f2fd] transition-all">
                    Attendance
                </Link>
            </div>
        </div>
    );
};
