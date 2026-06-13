import { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';
import type { ScheduleSession } from '../types/schedule';
import { ScheduleService } from '../services/schedule.service';
import { EditScheduleModal } from '../components/EditScheduleModal';

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
                <h1 className="text-2xl font-bold text-[#002045]">Master Schedule</h1>
                
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

            <div className="bg-white flex-1 rounded-2xl shadow-sm border border-[#e0e3e5] flex flex-col overflow-hidden overflow-x-auto">
                <div className="min-w-250 flex flex-col h-full">
                    <div className="grid grid-cols-8 border-b border-[#f1f4f6] bg-white">
                        <div className="p-4 border-r border-[#f1f4f6] flex items-center justify-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#74777f]">Shift / Time</span>
                        </div>
                        {DAY_NAMES.map((dayName, i) => {
                            const d = weekDates[i];
                            const isToday = new Date().toDateString() === d.toDateString();
                            return (
                                <div key={dayName} className={`p-4 text-center font-bold text-[#43474e] border-r last:border-r-0 border-[#f1f4f6] ${isToday ? 'bg-[#e6f0fa] text-[#0061a5]' : ''}`}>
                                    <div className="text-xs uppercase tracking-wider">{dayName}</div>
                                    <div className="text-xl">{String(d.getDate()).padStart(2, '0')}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="divide-y divide-[#f1f4f6] flex-1 overflow-y-auto">
                        {SHIFTS.map(shift => {
                            const hasSessionsInShift = DAY_NAMES.some((_, dayIdx) => 
                                schedule.some(s => s.dayIndex === dayIdx && s.startTime === shift.startTime)
                            );
                            
                            return (
                                <div key={shift.id} className={`grid grid-cols-8 group ${hasSessionsInShift ? 'min-h-17.5' : 'h-14'}`}>
                                    {/* Shift Info Column */}
                                    <div className="p-2 border-r border-[#f1f4f6] bg-[#fafbfc] flex flex-col justify-center items-center text-center shrink-0 transition-colors group-hover:bg-[#f1f4f6]">
                                        <span className="text-xs font-bold text-[#002045]">{shift.label}</span>
                                        <span className="text-xs font-medium text-[#74777f] mt-0.5">{shift.time}</span>
                                    </div>
                                    
                                    {DAY_NAMES.map((_, dayIdx) => {
                                        const sessions = schedule.filter(s => s.dayIndex === dayIdx && s.startTime === shift.startTime);
                                        const isToday = new Date().toDateString() === weekDates[dayIdx].toDateString();
                                        
                                        return (
                                            <div key={dayIdx} className={`border-r border-[#f1f4f6] last:border-0 p-1 flex flex-col gap-1 transition-colors ${isToday ? 'bg-[#f4f8fd]' : 'bg-white hover:bg-gray-50/50'}`}>
                                                {sessions.map(session => (
                                                    <div 
                                                        key={session.id} 
                                                        onClick={() => setSelectedSession(session)}
                                                        className={`p-2.5 rounded-md border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-2 ${session.color}`}
                                                    >
                                                        <h4 className="font-bold text-[#002045] text-xs leading-tight line-clamp-2">{session.class}</h4>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs text-[#43474e]">
                                                                <User className="w-3 h-3 text-[#74777f] shrink-0" />
                                                                <span className="truncate">{session.tutor}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-[#43474e]">
                                                                <MapPin className="w-3 h-3 text-[#74777f] shrink-0" />
                                                                <span className="truncate font-medium">{session.room}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
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
