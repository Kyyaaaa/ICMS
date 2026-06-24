import React from 'react';
import { X, CalendarDays, Clock, MapPin, User, BookOpen, UserCheck, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './button';

interface SessionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: any;
    dateStr: string;
    onTakeAttendance?: () => void;
}

const attendanceBadge = (status: string) => {
    switch (status) {
        case 'present':
        case 'taken':
            return (
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-fit">
                    <CheckCircle className="w-4 h-4" />
                    <span>{status === 'taken' ? 'Attendance Taken' : 'Present'}</span>
                </div>
            );
        case 'absent':
            return (
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#ba1a1a] bg-red-50 border border-red-200 rounded px-2 py-1 w-fit">
                    <XCircle className="w-4 h-4" />
                    <span>Absent</span>
                </div>
            );
        case 'upcoming':
        case 'pending':
        default:
            return (
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#74777f] bg-gray-50 border border-gray-200 rounded px-2 py-1 w-fit">
                    <AlertCircle className="w-4 h-4" />
                    <span>{status === 'pending' ? 'Pending Attendance' : 'Upcoming'}</span>
                </div>
            );
    }
};

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ isOpen, onClose, session, dateStr, onTakeAttendance }) => {
    if (!isOpen || !session) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181c1e]/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up">
                <div className="flex justify-between items-center p-6 border-b border-[#e0e3e5]">
                    <div>
                        <h2 className="text-xl font-bold text-[#002045]">Session Details</h2>
                        <p className="text-sm text-[#74777f] mt-1">{session.class} - {session.session}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#43474e] hover:bg-[#f8f9fa] hover:text-[#181c1e] rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-[#0061a5] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-[#74777f]">Class Name</p>
                                <p className="font-semibold text-[#181c1e]">{session.class}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CalendarDays className="w-5 h-5 text-[#0061a5] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-[#74777f]">Date</p>
                                <p className="font-semibold text-[#181c1e]">{dateStr}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-[#0061a5] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-[#74777f]">Time</p>
                                <p className="font-semibold text-[#181c1e]">{session.startTime} - {session.endTime}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#0061a5] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-[#74777f]">Room</p>
                                <p className="font-semibold text-[#181c1e]">{session.room}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-[#0061a5] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-[#74777f]">Tutor</p>
                                <p className="font-semibold text-[#181c1e]">{session.tutor || 'Unassigned'}</p>
                            </div>
                        </div>

                        {session.students !== undefined && (
                            <div className="flex items-start gap-3">
                                <UserCheck className="w-5 h-5 text-[#0061a5] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-[#74777f]">Capacity</p>
                                    <p className="font-semibold text-[#181c1e]">{session.students} students</p>
                                </div>
                            </div>
                        )}
                        
                        {session.attendance && (
                            <div className="flex items-start gap-3">
                                <div className="mt-2 w-full">
                                    <p className="text-sm text-[#74777f] mb-2">Status</p>
                                    {attendanceBadge(session.attendance)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {onTakeAttendance && (
                        <Button variant="default" onClick={onTakeAttendance}>
                            Take Attendance
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
