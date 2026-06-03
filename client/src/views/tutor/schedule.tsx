import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, CalendarDays, Users } from 'lucide-react';

const MOCK_TUTOR_SCHEDULE = [
    { id: 1, classId: 'c1', sessionId: 's1', class: 'IELTS Mastery', session: 'Session 1', room: 'Room 302', students: 15, dayIndex: 0, startTime: '18:00', endTime: '20:00', attendance: 'taken' },
    { id: 2, classId: 'c1', sessionId: 's2', class: 'IELTS Mastery', session: 'Session 2', room: 'Room 302', students: 15, dayIndex: 2, startTime: '18:00', endTime: '20:00', attendance: 'pending' },
    { id: 3, classId: 'c2', sessionId: 's4', class: 'TOEIC Prep', session: 'Session 1', room: 'Room 305', students: 20, dayIndex: 1, startTime: '19:00', endTime: '21:00', attendance: 'taken' },
    { id: 4, classId: 'c2', sessionId: 's5', class: 'TOEIC Prep', session: 'Session 2', room: 'Room 305', students: 20, dayIndex: 3, startTime: '19:00', endTime: '21:00', attendance: 'pending' },
    { id: 5, classId: 'c3', sessionId: 's6', class: 'Communication Skills', session: 'Session 1', room: 'Room 201', students: 12, dayIndex: 5, startTime: '09:00', endTime: '11:00', attendance: 'pending' },
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

const TeachingSchedule = () => {
    const navigate = useNavigate();
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
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Teaching Schedule</h1>
                    <p className="text-[#43474e] text-[14px]">View your assigned classes and attendance status.</p>
                </div>
                
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
                    <div className="grid grid-cols-7 min-h-[500px]">
                        {DAY_NAMES.map((_, dayIdx) => (
                            <div key={dayIdx} className="border-r border-[#e0e3e5] last:border-0 p-2 space-y-3 bg-gray-50/30">
                                {MOCK_TUTOR_SCHEDULE.filter(s => s.dayIndex === dayIdx).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(session => (
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
        </div>
    );
};

export default TeachingSchedule;
