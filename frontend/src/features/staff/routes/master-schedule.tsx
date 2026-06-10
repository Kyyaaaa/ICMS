import { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, User, Clock } from 'lucide-react';
import type { ScheduleSession } from '../types/schedule';
import { ScheduleService } from '../services/schedule.service';
import { EditScheduleModal } from '../components/EditScheduleModal';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
    return `${dd}-${mm}-${yyyy}`;
};

const MasterSchedule = () => {
    const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
    const [schedule, setSchedule] = useState<ScheduleSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ScheduleSession | null>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);

    const weekDates = DAY_NAMES.map((_, i) => {
        const d = new Date(currentMonday);
        d.setDate(d.getDate() + i);
        return d;
    });

    const sundayDate = weekDates[6];

    useEffect(() => {
        const loadSchedule = async () => {
            const data = await ScheduleService.getSchedule(currentMonday, sundayDate);
            setSchedule(data);
        };
        loadSchedule();
    }, [currentMonday, sundayDate]);

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

    const handleSaveSession = async (updatedSession: ScheduleSession) => {
        await ScheduleService.updateSession(updatedSession);
        setSchedule(schedule.map(s => s.id === updatedSession.id ? updatedSession : s));
        setSelectedSession(null);
    };

    const weekLabel = `${formatDate(currentMonday)} to ${formatDate(sundayDate)}`;

    return (
        <div className="space-y-6 animate-fade-in-up h-full flex flex-col pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <h1 className="text-[24px] font-bold text-[#002045]">Master Schedule</h1>
                
                <div className="flex flex-wrap items-center gap-3">
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

            <div className="bg-white flex-1 rounded-2xl shadow-sm border border-[#e0e3e5] flex flex-col overflow-hidden">
                <div className="grid grid-cols-7 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    {DAY_NAMES.map((dayName, i) => {
                        const d = weekDates[i];
                        const isToday = new Date().toDateString() === d.toDateString();
                        return (
                            <div key={dayName} className={`p-4 text-center font-bold text-[#43474e] border-r last:border-r-0 border-[#e0e3e5] ${isToday ? 'bg-[#e6f0fa] text-[#0061a5]' : ''}`}>
                                <div className="text-[13px] uppercase tracking-wider">{dayName}</div>
                                <div className="text-[20px]">{String(d.getDate()).padStart(2, '0')}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-7 flex-1 min-h-[600px] overflow-y-auto">
                    {DAY_NAMES.map((_, dayIdx) => (
                        <div key={dayIdx} className="border-r last:border-r-0 border-[#e0e3e5] p-2 space-y-3 bg-gray-50/30">
                            {schedule.filter(s => s.dayIndex === dayIdx).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(session => (
                                <div 
                                    key={session.id} 
                                    onClick={() => setSelectedSession(session)}
                                    className={`p-3 rounded-xl border ${session.color} shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:-translate-y-0.5 transform duration-200`}
                                >
                                    <div className="text-[12px] font-bold text-[#43474e] mb-1 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {session.startTime} - {session.endTime}
                                    </div>
                                    <h4 className="font-extrabold text-[#002045] text-[14px] leading-tight mb-2">{session.class}</h4>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-[12px] text-[#43474e]">
                                            <User className="w-3.5 h-3.5" />
                                            <span className="truncate">{session.tutor}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[12px] text-[#43474e]">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate font-semibold">{session.room}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {selectedSession && (
                <EditScheduleModal 
                    session={selectedSession} 
                    onClose={() => setSelectedSession(null)} 
                    onSave={handleSaveSession} 
                />
            )}
        </div>
    );
};

export default MasterSchedule;
