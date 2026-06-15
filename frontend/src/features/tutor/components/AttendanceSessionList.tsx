import { Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react';
import type { AttendanceClass, AttendanceSession } from '../types/attendance';

interface AttendanceSessionListProps {
    selectedClass: AttendanceClass | undefined;
    classSessions: AttendanceSession[];
    onSelectSession: (sessionId: string) => void;
}

export const AttendanceSessionList = ({ selectedClass, classSessions, onSelectSession }: AttendanceSessionListProps) => {
    if (!selectedClass) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#74777f]">
                <BookOpen className="w-16 h-16 text-[#e0e3e5] mb-4" />
                <h3 className="text-lg font-bold text-[#43474e] mb-1">Select a Class</h3>
                <p className="text-sm">Choose a class from the list to view its sessions.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-[#e0e3e5]">
                <h2 className="text-xl font-bold text-[#002045] flex items-center gap-3">
                    {selectedClass.name}
                </h2>
                <p className="text-[#43474e] text-sm mt-1">Select a session to take attendance.</p>
            </div>
            
            <div className="p-6 flex flex-col gap-3 overflow-y-auto">
                {classSessions.map((session, index) => (
                    <div 
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        className="bg-white border border-[#e0e3e5] rounded-xl p-4 hover:border-[#0061a5] hover:shadow-sm transition-all cursor-pointer group flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 rounded-xl bg-[#e3f2fd] border border-[#bbdefb] flex items-center justify-center text-[#0061a5] font-bold text-lg">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-[#181c1e] mb-1.5 group-hover:text-[#0061a5]">{session.name}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-[#43474e]">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#74777f]" /> {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#74777f]" /> {session.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                            <div className={`text-xs font-bold px-3 py-1 rounded-md ${
                                session.status === 'submitted' 
                                    ? 'bg-[#e0e3e5] text-[#43474e]' 
                                    : 'bg-amber-100 text-amber-800'
                            }`}>
                                {session.status === 'submitted' ? 'SUBMITTED' : 'PENDING'}
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#c4c6cf] group-hover:text-[#0061a5] hidden sm:block" />
                        </div>
                    </div>
                ))}
                {classSessions.length === 0 && (
                    <div className="col-span-full py-12 text-center text-[#74777f]">
                        No sessions scheduled for this class yet.
                    </div>
                )}
            </div>
        </div>
    );
};
