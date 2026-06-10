import { BookOpen, MapPin, Calendar, Clock, User, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LearnerClass } from '../types/class';

interface ClassCardProps {
    classItem: LearnerClass;
}

export const ClassCard = ({ classItem }: ClassCardProps) => {
    return (
        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="p-[24px] flex-1">
                <div className="flex justify-between items-start mb-[16px]">
                    <div className="w-12 h-12 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="px-[8px] py-[4px] bg-[#d2e4ff] text-[#0061a5] text-[12px] font-bold rounded uppercase tracking-wide">
                        {classItem.status}
                    </span>
                </div>
                <p className="text-[12px] font-semibold text-[#0061a5] mb-1 uppercase tracking-wide">Course: {classItem.courseName}</p>
                <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Class: {classItem.className} ({classItem.classCode})</h2>
                
                <div className="space-y-[8px] text-[14px] text-[#43474e]">
                    <div className="flex items-center gap-[8px]"><User className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Tutor:</span> {classItem.tutorName}</div>
                    <div className="flex items-center gap-[8px]"><MapPin className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Room:</span> {classItem.room}</div>
                    <div className="flex items-center gap-[8px]"><Calendar className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Schedule:</span> {classItem.schedule}</div>
                    <div className="flex items-center gap-[8px]"><Clock className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Time:</span> {classItem.time}</div>
                    <div className="flex items-center gap-[8px]"><CalendarDays className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Duration:</span> {classItem.startDate} - {classItem.endDate}</div>
                </div>
            </div>
            <div className="p-[16px] border-t border-[#e0e3e5] bg-[#f7fafc] grid grid-cols-2 gap-[16px]">
                <Link to={`/learner/classes/${classItem.id}`} className="text-center py-[8px] bg-[#002045] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#0061a5] transition-colors">Details</Link>
                <Link to={`/learner/classes/${classItem.id}/attendance`} className="text-center py-[8px] bg-white border border-[#002045] text-[#002045] rounded-[8px] text-[14px] font-semibold hover:bg-[#d2e4ff] transition-colors">Attendance</Link>
            </div>
        </div>
    );
};
