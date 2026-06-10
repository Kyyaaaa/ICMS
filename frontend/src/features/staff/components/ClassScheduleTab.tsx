import { Clock, CheckCircle, Edit } from 'lucide-react';
import type { ClassSession } from '../types/class-detail';

interface ClassScheduleTabProps {
    scheduleData: ClassSession[];
    onEditSession: (session: ClassSession) => void;
}

export const ClassScheduleTab = ({ scheduleData, onEditSession }: ClassScheduleTabProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-[#43474e] text-sm">
                    <tr>
                        <th className="p-4 font-semibold w-24">Session</th>
                        <th className="p-4 font-semibold w-40">Date & Time</th>
                        <th className="p-4 font-semibold w-32">Room</th>
                        <th className="p-4 font-semibold w-48">Tutor</th>
                        <th className="p-4 font-semibold">Lesson Topic</th>
                        <th className="p-4 font-semibold w-32">Status</th>
                        <th className="p-4 font-semibold w-24 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {scheduleData.map((item, index) => (
                        <tr key={index} className="border-b border-[#e0e3e5] hover:bg-[#f0f7ff]/50 transition-colors">
                            <td className="p-4 font-bold text-[#002045] text-center">{item.session}</td>
                            <td className="p-4">
                                <div className="font-semibold text-[#002045]">{item.date}</div>
                                <div className="text-xs text-[#74777f] flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3" /> {item.time}
                                </div>
                            </td>
                            <td className="p-4 text-[#43474e] font-medium">{item.room}</td>
                            <td className="p-4 text-[#43474e] flex items-center gap-2">
                                <div className="w-7 h-7 bg-blue-100 text-[#0061a5] rounded-full flex items-center justify-center text-xs font-bold">
                                    {item.tutor.charAt(4)}
                                </div>
                                {item.tutor}
                            </td>
                            <td className="p-4 font-semibold text-[#002045]">{item.topic}</td>
                            <td className="p-4">
                                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold w-fit ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                {item.status === 'Upcoming' && (
                                    <button 
                                        onClick={() => onEditSession(item)}
                                        className="p-2 bg-blue-50 text-[#0061a5] rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger" 
                                        title="Change Tutor or Room"
                                    >
                                        <Edit className="w-4 h-4"/>
                                    </button>
                                )}
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
