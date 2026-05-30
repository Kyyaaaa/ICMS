import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const AttendanceProgress = () => {
    const { id } = useParams();

    const sessions = [
        { id: 1, date: 'Oct 01, 2024', time: '18:00 - 20:00', status: 'present' },
        { id: 2, date: 'Oct 03, 2024', time: '18:00 - 20:00', status: 'present' },
        { id: 3, date: 'Oct 08, 2024', time: '18:00 - 20:00', status: 'absent_permitted' },
        { id: 4, date: 'Oct 10, 2024', time: '18:00 - 20:00', status: 'absent_unpermitted' },
        { id: 5, date: 'Oct 15, 2024', time: '18:00 - 20:00', status: 'upcoming' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <CheckCircle className="w-5 h-5 text-[#0061a5]" />;
            case 'absent_permitted': return <Clock className="w-5 h-5 text-[#c9a82c]" />;
            case 'absent_unpermitted': return <XCircle className="w-5 h-5 text-[#ba1a1a]" />;
            default: return <div className="w-5 h-5 rounded-full border-2 border-[#c4c6cf] border-dashed" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present': return <span className="px-[8px] py-[2px] bg-[#d2e4ff] text-[#0061a5] text-[12px] font-bold rounded">Present</span>;
            case 'absent_permitted': return <span className="px-[8px] py-[2px] bg-[#fff8e1] text-[#c9a82c] text-[12px] font-bold rounded">Excused</span>;
            case 'absent_unpermitted': return <span className="px-[8px] py-[2px] bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-bold rounded">Unexcused</span>;
            default: return <span className="px-[8px] py-[2px] bg-[#e5e9eb] text-[#43474e] text-[12px] font-bold rounded">Upcoming</span>;
        }
    };

    return (
        <div className="max-w-4xl space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/classes/${id}`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Class</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Attendance Log</h1>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#181c1e]">24</p>
                    <p className="text-[12px] text-[#74777f] uppercase font-bold tracking-wider">Total</p>
                </div>
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#0061a5]">2</p>
                    <p className="text-[12px] text-[#74777f] uppercase font-bold tracking-wider">Present</p>
                </div>
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#c9a82c]">1</p>
                    <p className="text-[12px] text-[#74777f] uppercase font-bold tracking-wider">Excused</p>
                </div>
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#ba1a1a]">1</p>
                    <p className="text-[12px] text-[#ba1a1a] uppercase font-bold tracking-wider">Unexcused</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Session</th>
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Date & Time</th>
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e] text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session, index) => (
                            <tr key={session.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc] transition-colors">
                                <td className="py-[16px] px-[24px]">
                                    <div className="flex items-center gap-[12px]">
                                        {getStatusIcon(session.status)}
                                        <span className="text-[14px] font-medium text-[#181c1e]">Session {index + 1}</span>
                                    </div>
                                </td>
                                <td className="py-[16px] px-[24px]">
                                    <span className="text-[14px] text-[#43474e]">{session.date}</span>
                                    <span className="text-[12px] text-[#74777f] block">{session.time}</span>
                                </td>
                                <td className="py-[16px] px-[24px] text-right">
                                    {getStatusBadge(session.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceProgress;
