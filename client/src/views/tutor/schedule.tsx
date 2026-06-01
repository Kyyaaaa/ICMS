import { useState, useRef } from 'react';
import { Clock, MapPin, ChevronLeft, ChevronRight, User, CheckCircle, XCircle, AlertCircle, CalendarDays } from 'lucide-react';

const MOCK_TUTOR_SCHEDULE = [
    { id: 1, class: 'IELTS Mastery', session: 'Session 4', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 1, startTime: '18:00', endTime: '20:00', attendance: 'present' },
    { id: 2, class: 'IELTS Mastery', session: 'Session 5', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 3, startTime: '18:00', endTime: '20:00', attendance: 'upcoming' },
    { id: 3, class: 'TOEIC Prep', session: 'Session 12', tutor: 'Mr. John Doe', room: 'Room 305', dayIndex: 0, startTime: '19:00', endTime: '21:00', attendance: 'present' },
    { id: 4, class: 'TOEIC Prep', session: 'Session 13', tutor: 'Mr. John Doe', room: 'Room 305', dayIndex: 2, startTime: '19:00', endTime: '21:00', attendance: 'absent' },
    { id: 5, class: 'Communication Skills', session: 'Session 1', tutor: 'Ms. Emily Chen', room: 'Room 201', dayIndex: 5, startTime: '09:00', endTime: '11:00', attendance: 'upcoming' },
];

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

const attendanceBadge = (status: string) => {
    switch (status) {
        case 'present':
            return (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 w-fit">
                    <CheckCircle className="w-3 h-3" />
                    Present
                </div>
            );
        case 'absent':
            return (
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#ba1a1a] bg-red-50 border border-red-200 rounded-md px-1.5 py-0.5 w-fit">
                    <XCircle className="w-3 h-3" />
                    Absent
                </div>
            );
        case 'upcoming':
        default:
            return (
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#74777f] bg-gray-50 border border-gray-200 rounded-md px-1.5 py-0.5 w-fit">
                    <AlertCircle className="w-3 h-3" />
                    Upcoming
                </div>
            );
    }
};

const TeachingSchedule = () => {
    const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
    const dateInputRef = useRef<HTMLInputElement>(null);

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
        <div className="space-y-[24px] animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Teaching Schedule</h1>
                
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
                    <div className="grid grid-cols-7 min-h-[400px]">
                        {DAY_NAMES.map((_, dayIdx) => (
                            <div key={dayIdx} className="border-r border-[#e0e3e5] last:border-0 p-2 space-y-3 bg-gray-50/30">
                                {MOCK_TUTOR_SCHEDULE.filter(s => s.dayIndex === dayIdx).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(session => (
                                    <div 
                                        key={session.id} 
                                        className="p-3 bg-white rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:-translate-y-0.5 transform duration-200"
                                    >
                                        <h4 className="font-extrabold text-[#002045] text-[14px] leading-tight mb-0.5">{session.class}</h4>
                                        <div className="text-[12px] font-semibold text-[#0061a5] mb-2">{session.session}</div>
                                        
                                        <div className="space-y-1 mb-2">
                                            <div className="flex items-center gap-1.5 text-[12px] text-[#43474e]">
                                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                                <span>{session.startTime} - {session.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[12px] text-[#43474e]">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate font-semibold">{session.room}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[12px] text-[#43474e]">
                                                <User className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{session.tutor}</span>
                                            </div>
                                        </div>

                                        {attendanceBadge(session.attendance)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachingSchedule;
