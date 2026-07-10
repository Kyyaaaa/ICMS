import { Link } from 'react-router-dom';
import { User, Clock, MapPin, CalendarDays } from 'lucide-react';
import { getSlotLabel } from '@/shared/lib/utils';
import type { Class } from '../types/class';

interface ClassCardProps {
    cls: Class;
}

export const ClassCard = ({ cls }: ClassCardProps) => {
    const extendedCls = cls as Class & { class_sessions?: { date: string, slot?: string }[], sessions?: { date: string, slot?: string }[] };
    const sessions = extendedCls.class_sessions || extendedCls.sessions || [];
    const schedules: string[] = [];
    if (sessions.length > 0) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Group days by slot to make it compact
        const slotToDays = new Map<string, Set<number>>();
        
        sessions.forEach((s) => {
            const day = new Date(s.date).getDay();
            const slot = s.slot || 'TBA';
            if (!slotToDays.has(slot)) {
                slotToDays.set(slot, new Set());
            }
            slotToDays.get(slot)!.add(day);
        });

        const scheduleObjects: { minDay: number; text: string }[] = [];
        Array.from(slotToDays.entries()).forEach(([slot, daysSet]) => {
            const days = Array.from(daysSet).sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
            const daysString = days.map(d => dayNames[d]).join(', ');
            
            const label = getSlotLabel(slot);
            scheduleObjects.push({
                minDay: days[0] === 0 ? 7 : days[0],
                text: `${daysString} (${label})`
            });
        });
        
        scheduleObjects.sort((a, b) => a.minDay - b.minDay).forEach(obj => {
            schedules.push(obj.text);
        });
    }

    return (
        <Link to={`/staff/classes/${cls.id}`} className="block group h-full">
            <div className="border border-[#e0e3e5] rounded-xl p-5 hover:border-[#0061a5] hover:shadow-md transition-all h-full bg-white relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0061a5] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-[#002045] group-hover:text-[#0061a5] transition-colors">{cls.name}</h3>
                    </div>
                    <span className="px-3 py-1 text-[11px] sm:text-xs font-bold rounded-full bg-blue-50 text-[#0061a5] whitespace-nowrap">
                        {cls.students?.filter((s: { status: string }) => s.status === 'ACTIVE').length || 0}/{cls.capacity} Students
                    </span>
                </div>
                
                <div className="flex flex-col flex-1">
                    <div className="flex flex-col gap-3 text-[#43474e] text-sm mt-2 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0061a5] flex items-center justify-center shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="truncate"><span className="text-[#74777f]">Tutor:</span> <span className="font-semibold text-[#181c1e]">{cls.tutor?.full_name || 'TBA'}</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="truncate"><span className="text-[#74777f]">Status:</span> <span className="font-semibold text-[#181c1e]">{cls.status}</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <span className="truncate"><span className="text-[#74777f]">Room:</span> <span className="font-semibold text-[#181c1e]">{cls.classroom?.room_name || 'TBA'}</span></span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-3 border-t border-[#f0f4f8] mt-auto">
                        <div className="flex items-center gap-1.5 text-[#74777f]">
                            <CalendarDays className="w-4 h-4 shrink-0" />
                            <span className="font-medium text-[#181c1e] text-sm">Schedule</span>
                        </div>
                        {schedules.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 pl-0 sm:pl-2">
                                {schedules.map((schedule, idx) => {
                                    const match = schedule.match(/^(.*?) \((.*)\)$/);
                                    if (match) {
                                        const slotMatch = match[2].match(/(Slot \d+) \((.*)\)/);
                                        const isLong = match[1].includes(',');
                                        if (slotMatch) {
                                            return (
                                                <div key={idx} className={`flex flex-col bg-blue-50/50 border border-blue-100 rounded-md px-2 py-1.5 w-full min-w-0 ${isLong ? 'col-span-2' : 'col-span-1'}`}>
                                                    <span className="text-xs font-bold text-[#0061a5]">{match[1]} • {slotMatch[1]}</span>
                                                    <span className="text-[11px] font-medium tracking-tight text-[#0061a5]/80 mt-0.5 whitespace-nowrap">
                                                        {slotMatch[2]}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={idx} className={`flex flex-col bg-blue-50/50 border border-blue-100 rounded-md px-2 py-1.5 w-full min-w-0 ${isLong ? 'col-span-2' : 'col-span-1'}`}>
                                                <span className="text-[13px] font-bold text-[#0061a5]">{match[1]}</span>
                                                <span className="text-[11.5px] font-medium tracking-tight text-[#0061a5]/80 mt-0.5">
                                                    {match[2]}
                                                </span>
                                            </div>
                                        );
                                    }
                                    const isLong = schedule.length > 15;
                                    return (
                                        <div key={idx} className={`bg-blue-50/50 border border-blue-100 rounded-md px-2.5 py-1.5 text-xs text-[#0061a5] w-full min-w-0 ${isLong ? 'col-span-2' : 'col-span-1'}`}>
                                            {schedule}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <span className="text-sm text-[#43474e] pl-5">TBA</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
