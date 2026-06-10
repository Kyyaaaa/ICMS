import { Clock, MapPin, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TutorScheduleSession } from '../types/schedule';

interface ScheduleGridProps {
    weekDates: Date[];
    schedule: TutorScheduleSession[];
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const attendanceBadge = (status: string) => {
    switch (status) {
        case 'taken':
            return (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1 w-fit mt-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Attendance Taken
                </div>
            );
        case 'pending':
        default:
            return (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 w-fit mt-3">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Attendance Pending
                </div>
            );
    }
};

export const ScheduleGrid = ({ weekDates, schedule }: ScheduleGridProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden overflow-x-auto">
            <div className="min-w-[900px]">
                {/* Header */}
                <div className="grid grid-cols-7 border-b border-[#e0e3e5] bg-[#f7fafc]">
                    {DAY_NAMES.map((dayName, i) => {
                        const d = weekDates[i];
                        const isToday = new Date().toDateString() === d.toDateString();
                        return (
                            <div key={dayName} className={`py-[12px] text-center border-r border-[#e0e3e5] last:border-0 ${isToday ? 'bg-[#e6f0fa]' : ''}`}>
                                <span className={`text-[12px] font-bold uppercase tracking-wider ${isToday ? 'text-[#0061a5]' : 'text-[#74777f]'}`}>{dayName}</span>
                                <span className={`block text-[20px] font-bold mt-1 ${isToday ? 'text-[#0061a5]' : 'text-[#181c1e]'}`}>{String(d.getDate()).padStart(2, '0')}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 min-h-[500px]">
                    {DAY_NAMES.map((_, dayIdx) => (
                        <div key={dayIdx} className="border-r border-[#e0e3e5] last:border-0 p-2 space-y-3 bg-gray-50/30">
                            {schedule.filter(s => s.dayIndex === dayIdx).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(session => (
                                <div 
                                    key={session.id} 
                                    onClick={() => navigate(`/tutor/attendance?classId=${session.classId}&sessionId=${session.sessionId}`)}
                                    className="p-3 bg-white rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow hover:-translate-y-0.5 transform duration-200 flex flex-col cursor-pointer"
                                >
                                    <div>
                                        <h4 className="font-extrabold text-[#002045] text-[15px] leading-tight mb-1">{session.class}</h4>
                                        <div className="text-[12px] font-bold text-[#0061a5] mb-3">{session.session}</div>
                                        
                                        <div className="space-y-2 mb-2">
                                            <div className="flex items-center gap-2 text-[12px] text-[#43474e] font-medium">
                                                <Clock className="w-3.5 h-3.5 text-[#74777f] shrink-0" />
                                                <span>{session.startTime} - {session.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-[#43474e] font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-[#74777f] shrink-0" />
                                                <span>{session.room}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-[#43474e] font-medium">
                                                <Users className="w-3.5 h-3.5 text-[#74777f] shrink-0" />
                                                <span>{session.students} Students</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {attendanceBadge(session.attendance)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
