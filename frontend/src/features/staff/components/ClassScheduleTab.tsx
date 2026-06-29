import { Clock, Edit, Eye } from 'lucide-react';
import { getSlotLabel } from '@/shared/lib/utils';
import type { Session } from '../types/class';

interface ClassScheduleTabProps {
    scheduleData: Session[];
    onEditSession: (session: Session) => void;
}

export const ClassScheduleTab = ({ scheduleData, onEditSession }: ClassScheduleTabProps) => {


    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[dateObj.getDay()];
            return `${dayName}, ${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-[#43474e] text-sm">
                    <tr>
                        <th className="p-4 font-semibold w-24 text-center">Session</th>
                        <th className="p-4 font-semibold w-40">Date</th>
                        <th className="p-4 font-semibold w-48">Slot</th>
                        <th className="p-4 font-semibold w-32">Room</th>
                        <th className="p-4 font-semibold w-48">Tutor</th>
                        <th className="p-4 font-semibold w-24 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {scheduleData.map((item, index) => (
                        <tr key={index} className="border-b border-[#e0e3e5] hover:bg-[#f0f7ff]/50 transition-colors">
                            <td className="p-4 font-bold text-[#002045] text-center">{item.session_number}</td>
                            <td className="p-4">
                                <div className="font-semibold text-[#002045]">{formatDate(item.date)}</div>
                            </td>
                            <td className="p-4 text-[#43474e] font-medium whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-500" /> {getSlotLabel(item.slot)}
                                </div>
                            </td>
                            <td className="p-4 text-[#43474e] font-medium">{item.classroom?.room_name || 'Not Assigned'}</td>
                            <td className="p-4 text-[#43474e]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-blue-100 text-[#0061a5] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                        {item.tutor?.full_name?.charAt(0) || '?'}
                                    </div>
                                    <span className="truncate">{item.tutor?.full_name || 'Not Assigned'}</span>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                {(() => {
                                    const isPast = new Date(item.date) < new Date(new Date().setHours(0,0,0,0));
                                    return (
                                        <button 
                                            onClick={() => onEditSession(item)}
                                            className={`p-2 rounded-lg transition-colors tooltip-trigger ${isPast ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-blue-50 text-[#0061a5] hover:bg-blue-100'}`} 
                                            title={isPast ? "View Details" : "Edit Schedule"}
                                        >
                                            {isPast ? <Eye className="w-4 h-4"/> : <Edit className="w-4 h-4"/>}
                                        </button>
                                    );
                                })()}
                            </td>
                        </tr>
                    ))}
                    {scheduleData.length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-[#74777f]">No schedule data found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
