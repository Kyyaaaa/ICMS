import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { AttendanceSession } from '../types/attendance';
import { LearnerAttendanceService } from '../services/attendance.service';

const AttendanceProgress = () => {
    const { id } = useParams();
    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (id) {
                const data = await LearnerAttendanceService.getAttendanceByClassId(id);
                setSessions(data);
            }
            setLoading(false);
        };
        fetchAttendance();
    }, [id]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <CheckCircle className="w-5 h-5 text-[#0061a5]" />;
            case 'absent': return <XCircle className="w-5 h-5 text-[#ba1a1a]" />;
            default: return <div className="w-5 h-5 rounded-full border-2 border-[#c4c6cf] border-dashed" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present': return <span className="px-[8px] py-[2px] bg-[#d2e4ff] text-[#0061a5] text-[12px] font-bold rounded">Present</span>;
            case 'absent': return <span className="px-[8px] py-[2px] bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-bold rounded">Absent</span>;
            default: return <span className="px-[8px] py-[2px] bg-[#e5e9eb] text-[#43474e] text-[12px] font-bold rounded">Upcoming</span>;
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading attendance...</div>;
    }

    const totalSessions = 24; // Hardcoded for mockup
    const presentCount = sessions.filter(s => s.status === 'present').length;
    const absentCount = sessions.filter(s => s.status === 'absent').length;
    const remainingCount = totalSessions - presentCount - absentCount;

    return (
        <div className="max-w-4xl space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/classes/${id}`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Class</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Attendance Log</h1>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#181c1e]">{totalSessions}</p>
                    <p className="text-[12px] text-[#74777f] uppercase font-bold tracking-wider">Total Sessions</p>
                </div>
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#0061a5]">{presentCount}</p>
                    <p className="text-[12px] text-[#74777f] uppercase font-bold tracking-wider">Present</p>
                </div>
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#ba1a1a]">{absentCount}</p>
                    <p className="text-[12px] text-[#74777f] uppercase font-bold tracking-wider">Absent</p>
                </div>
                <div className="bg-white p-[16px] rounded-[12px] border border-[#e0e3e5] text-center shadow-sm">
                    <p className="text-[24px] font-bold text-[#c9a82c]">{remainingCount}</p>
                    <p className="text-[12px] text-[#74777f] uppercase font-bold tracking-wider">Remaining</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Session</th>
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Date</th>
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Time</th>
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Tutor</th>
                            <th className="py-[12px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Room</th>
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
                                    <span className="text-[14px] font-medium text-[#181c1e]">{session.date}</span>
                                </td>
                                <td className="py-[16px] px-[24px]">
                                    <span className="text-[14px] text-[#43474e]">{session.time}</span>
                                </td>
                                <td className="py-[16px] px-[24px]">
                                    <span className="text-[14px] text-[#43474e]">{session.tutor}</span>
                                </td>
                                <td className="py-[16px] px-[24px]">
                                    <span className="text-[14px] text-[#43474e]">{session.room}</span>
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
