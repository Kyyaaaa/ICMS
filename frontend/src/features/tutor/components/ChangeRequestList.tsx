import { Calendar, Users, Eye, MapPin } from 'lucide-react';
import type { TutorChangeRequest } from '../types/change-request';

interface ChangeRequestListProps {
    requests: TutorChangeRequest[];
    onSelectRequest: (request: TutorChangeRequest) => void;
}

export const ChangeRequestList = ({ requests, onSelectRequest }: ChangeRequestListProps) => {
    const getTypeStyle = (type?: string) => {
        const t = type?.toLowerCase();
        if (t === 'reschedule') return 'text-[#0061a5]';
        if (t === 'substitute tutor' || t === 'substitute') return 'text-purple-600';
        if (t === 'change room') return 'text-[#16a34a]';
        return 'text-[#0061a5]';
    };
    const getTypeIcon = (type?: string) => {
        const t = type?.toLowerCase();
        if (t === 'reschedule') return <Calendar className="w-4 h-4"/>;
        if (t === 'substitute tutor' || t === 'substitute') return <Users className="w-4 h-4"/>;
        if (t === 'change room') return <MapPin className="w-4 h-4"/>;
        return <Calendar className="w-4 h-4"/>;
    };
    const formatType = (type?: string) => {
        const t = type?.toLowerCase();
        if (t === 'substitute tutor' || t === 'substitute') return 'Substitute';
        if (t === 'change room') return 'Change Room';
        return 'Reschedule';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                    <tr>
                        <th className="p-4 font-bold text-xs text-[#74777f] uppercase">Class & Session</th>
                        <th className="p-4 font-bold text-xs text-[#74777f] uppercase">Type</th>
                        <th className="p-4 font-bold text-xs text-[#74777f] uppercase">Submitted</th>
                        <th className="p-4 font-bold text-xs text-[#74777f] uppercase">Status</th>
                        <th className="p-4 font-bold text-xs text-[#74777f] uppercase text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3e5]">
                    {requests.map(item => (
                        <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-[#002045]">{item.className}</div>
                                <div className="text-xs text-[#74777f] font-medium mt-0.5">Session {item.session}</div>
                            </td>
                            <td className="p-4">
                                <span className={`flex items-center gap-1.5 text-xs font-bold ${getTypeStyle(item.type)}`}>
                                    {getTypeIcon(item.type)} {formatType(item.type)}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-[#43474e] font-medium">{item.submittedAt}</td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                    item.status === 'Pending' ? 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]' : 
                                    item.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]' : 
                                    item.status === 'Cancelled' ? 'bg-gray-100 text-gray-600 border-gray-300' :
                                    'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => onSelectRequest(item)}
                                    className="text-[#0061a5] hover:bg-[#e6f0fa] px-3 py-2 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                                >
                                    <Eye className="w-4 h-4"/> Detail
                                </button>
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-[#74777f] font-medium">
                                No requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
