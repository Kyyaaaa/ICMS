import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight, User, CheckCircle, XCircle, AlertCircle, CalendarDays } from 'lucide-react';
import type { LearnerSession } from '../types/schedule';
import { LearnerSchedulesService } from '../services/schedules.service';
import { SessionDetailModal } from '@/shared/components/ui/SessionDetailModal';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SHIFTS = [
    { id: 'S1', label: 'Slot 1', time: '07:30 - 09:30', startTime: '07:30' },
    { id: 'S2', label: 'Slot 2', time: '09:30 - 11:30', startTime: '09:30' },
    { id: 'S3', label: 'Slot 3', time: '13:30 - 15:30', startTime: '13:30' },
    { id: 'S4', label: 'Slot 4', time: '15:30 - 17:30', startTime: '15:30' },
    { id: 'S5', label: 'Slot 5', time: '18:00 - 20:00', startTime: '18:00' },
    { id: 'S6', label: 'Slot 6', time: '20:00 - 22:00', startTime: '20:00' },
];

const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

const formatDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

const attendanceBadge = (status: string) => {
    switch (status) {
        case 'present':
            return (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 w-fit shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    <span>Present</span>
                </div>
            );
        case 'absent':
            return (
                <div className="flex items-center gap-1 text-xs font-bold text-[#ba1a1a] bg-red-50 border border-red-200 rounded px-1 py-0.5 w-fit shrink-0">
                    <XCircle className="w-3 h-3" />
                    <span>Absent</span>
                </div>
            );
        case 'not_yet':
        default:
            return (
                <div className="flex items-center gap-1 text-xs font-bold text-[#74777f] bg-gray-50 border border-gray-200 rounded px-1 py-0.5 w-fit shrink-0">
                    <AlertCircle className="w-3 h-3" />
                    <span>Not Yet</span>
                </div>
            );
    }
};



const LearnerSchedules = () => {
    const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
    const [schedule, setSchedule] = useState<LearnerSession[]>([]);
    const [loading, setLoading] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [selectedSession, setSelectedSession] = useState<LearnerSession | null>(null);
    const [selectedDateStr, setSelectedDateStr] = useState<string>('');

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            const data = await LearnerSchedulesService.getWeeklySchedule(currentMonday);
            setSchedule(data);
            setLoading(false);
        };
        fetchSchedule();
    }, [currentMonday]);

    const goToPrevWeek = () => {
        setCurrentMonday(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return d;
        });
    };

    const goToNextWeek = () => {
        setCurrentMonday(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return d;
        });
    };

    const handleDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val) {
            setCurrentMonday(getMonday(new Date(val)));
        }
    };

    const weekDates = DAY_NAMES.map((_, i) => {
        const d = new Date(currentMonday);
        d.setDate(d.getDate() + i);
        return d;
    });

    const sundayDate = weekDates[6];
    const weekLabel = `${formatDate(currentMonday)} to ${formatDate(sundayDate)}`;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">My Schedules</h1>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-white rounded-lg border border-[#c4c6cf] overflow-hidden shadow-sm">
                        <button onClick={goToPrevWeek} className="p-2 hover:bg-[#f8f9fa] transition-colors border-r border-[#c4c6cf]">
                            <ChevronLeft className="w-5 h-5 text-[#43474e]" />
                        </button>
                        <button 
                            onClick={() => dateInputRef.current?.showPicker()}
                            className="px-4 py-2 font-bold text-[#181c1e] flex items-center gap-2 hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                        >
                            <CalendarDays className="w-4 h-4 text-[#74777f]" />
                            {weekLabel}
                        </button>
                        <input 
                            ref={dateInputRef}
                            type="date" 
                            className="absolute opacity-0 w-0 h-0 pointer-events-none" 
                            onChange={handleDatePick}
                        />
                        <button onClick={goToNextWeek} className="p-2 hover:bg-[#f8f9fa] transition-colors border-l border-[#c4c6cf]">
                            <ChevronRight className="w-5 h-5 text-[#43474e]" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden overflow-x-auto relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                <div className="min-h-100">
                    {(() => {
                        const daysWithSessions = weekDates.map((date, dayIndex) => {
                            const sessionsForDay = schedule.filter(s => s.dayIndex === dayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime));
                            return { date, dayIndex, sessions: sessionsForDay };
                        });

                        if (daysWithSessions.length === 0 && !loading) {
                            return (
                                <div className="h-full flex flex-col items-center justify-center text-[#74777f] py-20">
                                    <CalendarDays className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="font-bold text-lg text-[#181c1e]">No classes scheduled</p>
                                    <p className="text-sm mt-1">Enjoy your free time!</p>
                                </div>
                            );
                        }

                        return (
                            <table className="w-full text-left border-collapse min-w-200">
                                <thead>
                                    <tr className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-35">Date</th>
                                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-32.5">Time</th>
                                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5]">Class</th>
                                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-40">Room</th>
                                        <th className="p-4 font-bold text-[#43474e] text-xs uppercase tracking-wider border-r border-[#e0e3e5] w-45">Tutor</th>
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
                                                    className="hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedSession(session);
                                                        setSelectedDateStr(dateStr);
                                                    }}
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
                                                    <td className="p-4 border-r border-[#e0e3e5] align-middle w-45">
                                                        <div className="flex items-center gap-1.5 text-xs text-[#43474e]">
                                                            <User className="w-3.5 h-3.5 text-[#74777f]" />
                                                            <span className="truncate max-w-35">{session.tutor}</span>
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
                        );
                    })()}
                </div>
            </div>

            <SessionDetailModal 
                isOpen={!!selectedSession}
                onClose={() => setSelectedSession(null)}
                session={selectedSession}
                dateStr={selectedDateStr}
            />
        </div>
    );
};

export default LearnerSchedules;

