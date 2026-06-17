import { MapPin, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TutorScheduleSession } from '../types/schedule';

interface ScheduleGridProps {
    weekDates: Date[];
    schedule: TutorScheduleSession[];
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SHIFTS = [
    { id: 'S1', label: 'Slot 1', time: '07:30 - 09:30', startTime: '07:30' },
    { id: 'S2', label: 'Slot 2', time: '09:30 - 11:30', startTime: '09:30' },
    { id: 'S3', label: 'Slot 3', time: '13:30 - 15:30', startTime: '13:30' },
    { id: 'S4', label: 'Slot 4', time: '15:30 - 17:30', startTime: '15:30' },
    { id: 'S5', label: 'Slot 5', time: '18:00 - 20:00', startTime: '18:00' },
    { id: 'S6', label: 'Slot 6', time: '20:00 - 22:00', startTime: '20:00' },
];

const attendanceBadge = (status: string) => {
    switch (status) {
        case 'taken':
            return (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 w-fit shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Taken</span>
                </div>
            );
        case 'pending':
        default:
            return (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1 py-0.5 w-fit shrink-0">
                    <AlertCircle className="w-3 h-3" />
                    <span>Pending</span>
                </div>
            );
    }
};



export const ScheduleGrid = ({ weekDates, schedule }: ScheduleGridProps) => {
    const navigate = useNavigate();

    const daysWithSessions = weekDates.map((date, dayIndex) => {
        const sessionsForDay = schedule.filter(s => s.dayIndex === dayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime));
        return { date, dayIndex, sessions: sessionsForDay };
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden overflow-x-auto relative min-h-100">
            <table className="w-full text-left border-collapse min-w-200">
                <thead>
                    <tr className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-35">Date</th>
                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-32.5">Time</th>
                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5]">Class</th>
                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-40">Room</th>
                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-35">Learners</th>
                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider w-35">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3e5]">
                    {daysWithSessions.map(({ date, dayIndex, sessions }) => {
                        const isToday = new Date().toDateString() === date.toDateString();
                        const dayName = DAY_NAMES[dayIndex];
                        const dateStr = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0');

                        if (sessions.length === 0) {
                            return (
                                <tr key={`empty-${dayIndex}`} className="bg-[#fafbfc]">
                                    <td className="p-4 border-r border-[#e0e3e5] align-middle text-center w-35 bg-white">
                                        <div className={`font-bold ${isToday ? 'text-[#0061a5]' : 'text-[#181c1e]'}`}>
                                            {dayName}
                                        </div>
                                        <div className={`text-xs ${isToday ? 'text-[#0061a5]' : 'text-[#74777f]'}`}>
                                            {dateStr}
                                        </div>
                                    </td>
                                    <td colSpan={5} className="p-4 align-middle text-center text-[#74777f] text-xs">
                                        No classes scheduled
                                    </td>
                                </tr>
                            );
                        }

                        return sessions.map((session, sIndex) => {
                            const shift = SHIFTS.find(s => s.startTime === session.startTime);
                            return (
                                <tr 
                                    key={session.id} 
                                    onClick={() => navigate(`/tutor/classes/${session.classId}/attendance?sessionId=${session.sessionId}`)}
                                    className="hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                                >
                                    {sIndex === 0 && (
                                        <td rowSpan={sessions.length} className="p-4 border-r border-[#e0e3e5] align-middle text-center bg-white w-35">
                                            <div className={`font-bold ${isToday ? 'text-[#0061a5]' : 'text-[#181c1e]'}`}>
                                                {dayName}
                                            </div>
                                            <div className={`text-xs ${isToday ? 'text-[#0061a5]' : 'text-[#74777f]'}`}>
                                                {dateStr}
                                            </div>
                                        </td>
                                    )}
                                    <td className="p-4 border-r border-[#e0e3e5] align-middle w-32.5">
                                        <div className="font-bold text-[#002045] text-xs">{shift?.label}</div>
                                        <div className="text-xs text-[#74777f] mt-0.5">{shift?.time}</div>
                                    </td>
                                    <td className="p-4 border-r border-[#e0e3e5] align-middle">
                                        <div className="font-bold text-[#002045] text-sm">{session.class}</div>
                                        <div className="text-xs font-bold text-[#0061a5] bg-[#e6f0fa] px-1.5 py-0.5 rounded w-fit mt-1">
                                            {session.session}
                                        </div>
                                    </td>
                                    <td className="p-4 border-r border-[#e0e3e5] align-middle w-40">
                                        <div className="flex items-center gap-1.5 text-xs text-[#43474e]">
                                            <MapPin className="w-3.5 h-3.5 text-[#74777f]" />
                                            <span className="font-medium">{session.room}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 border-r border-[#e0e3e5] align-middle w-35">
                                        <div className="flex items-center gap-1.5 text-xs text-[#43474e]">
                                            <Users className="w-3.5 h-3.5 text-[#74777f]" />
                                            <span className="font-medium">{session.students} Learners</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle w-35">
                                        {attendanceBadge(session.attendance)}
                                    </td>
                                </tr>
                            );
                        });
                    })}
                </tbody>
            </table>
        </div>
    );
};
