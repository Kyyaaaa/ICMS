import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { ScheduleService } from '../services/schedule.service';
import type { TutorScheduleSession } from '../types/schedule';
import { ScheduleGrid } from '../components/ScheduleGrid';

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

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TeachingSchedule = () => {
    const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [schedule, setSchedule] = useState<TutorScheduleSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            const dEnd = new Date(currentMonday);
            dEnd.setDate(dEnd.getDate() + 6);
            const data = await ScheduleService.getSchedule(currentMonday, dEnd);
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
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Teaching Schedule</h1>
                    <p className="text-[#43474e] text-sm">View your assigned classes and attendance status.</p>
                </div>
                
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

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <ScheduleGrid weekDates={weekDates} schedule={schedule} />
            )}
        </div>
    );
};

export default TeachingSchedule;
