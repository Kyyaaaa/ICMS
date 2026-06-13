import { ArrowLeft, ChevronRight, Calendar, Clock, CheckCircle2, Send, Search, XCircle } from 'lucide-react';
import type { AttendanceClass, AttendanceSession, AttendanceStudent, AttendanceStatus } from '../types/attendance';

interface AttendanceSheetProps {
    selectedClass: AttendanceClass;
    selectedSession: AttendanceSession;
    students: AttendanceStudent[];
    currentRecords: Record<string, AttendanceStatus>;
    searchQuery: string;
    isLocked: boolean;
    onBack: () => void;
    setSearchQuery: (q: string) => void;
    onMarkAll: (status: AttendanceStatus) => void;
    onStatusChange: (studentId: string, status: AttendanceStatus) => void;
    onSubmit: () => void;
}

export const AttendanceSheet = ({
    selectedClass, selectedSession, students, currentRecords, searchQuery, isLocked,
    onBack, setSearchQuery, onMarkAll, onStatusChange, onSubmit
}: AttendanceSheetProps) => {
    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Sheet Header */}
            <div className="p-6 border-b border-[#e0e3e5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#0061a5] font-bold text-xs mb-4 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Sessions
                    </button>
                    <h2 className="text-xl font-bold text-[#002045] flex items-center gap-3 mb-1">
                        {selectedClass.name}
                        <ChevronRight className="w-5 h-5 text-[#c4c6cf]" />
                        <span className="text-[#43474e] text-base font-semibold">{selectedSession.name}</span>
                    </h2>
                    <div className="flex items-center gap-6 text-[#74777f] text-xs font-medium mt-2">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(selectedSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {selectedSession.time}</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                    {isLocked ? (
                        <div className="flex items-center gap-2 text-[#43474e] bg-[#e0e3e5] px-4 py-2 rounded-lg border border-[#c4c6cf] font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5" />
                            Record Locked
                        </div>
                    ) : (
                        <div className="flex flex-col items-end">
                            <button 
                                onClick={onSubmit}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                                    selectedSession.status === 'submitted' 
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-[#0061a5] text-white hover:bg-[#004d84]'
                                }`}
                            >
                                {selectedSession.status === 'submitted' ? (
                                    <><CheckCircle2 className="w-4 h-4" /> Saved</>
                                ) : (
                                    <><Send className="w-4 h-4" /> Submit Attendance</>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sheet Toolbar */}
            <div className="p-4 border-b border-[#e0e3e5] bg-[#f8f9fa] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-75">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                    <input 
                        type="text" 
                        placeholder="Search student name or ID..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-xs"
                    />
                </div>
                
                {(!isLocked) && (
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-[#74777f] uppercase mr-2">Mark All As:</span>
                        <button onClick={() => onMarkAll('absent')} className="px-3 py-1.5 rounded-md text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors">Absent</button>
                        <button onClick={() => onMarkAll('present')} className="px-3 py-1.5 rounded-md text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">Present</button>
                    </div>
                )}
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto">
                {filteredStudents.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] w-30">ID</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Student</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] text-right">Attendance Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e0e3e5]">
                            {filteredStudents.map(student => {
                                const status = currentRecords[student.id] || 'absent';
                                
                                return (
                                    <tr key={student.id} className="hover:bg-[#f8f9fa] transition-colors">
                                        <td className="p-4 text-xs font-bold text-[#181c1e] uppercase tracking-wide">{student.code}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#e3f2fd] text-[#0061a5] flex items-center justify-center font-bold text-xs">
                                                    {student.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-[#181c1e] text-sm">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    disabled={isLocked}
                                                    onClick={() => onStatusChange(student.id, 'absent')}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                        status === 'absent' 
                                                            ? 'bg-rose-500 text-white border-rose-600 shadow-sm' 
                                                            : 'bg-white text-[#74777f] border-[#c4c6cf] hover:border-rose-500 hover:text-rose-600'
                                                    } ${isLocked && status !== 'absent' ? 'opacity-50 cursor-not-allowed bg-transparent border-transparent' : ''}`}
                                                >
                                                    <XCircle className={`w-4 h-4 ${status === 'absent' ? 'text-white' : ''}`} />
                                                    Absent
                                                </button>
                                                
                                                <button 
                                                    disabled={isLocked}
                                                    onClick={() => onStatusChange(student.id, 'present')}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                        status === 'present' 
                                                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' 
                                                            : 'bg-white text-[#74777f] border-[#c4c6cf] hover:border-emerald-500 hover:text-emerald-600'
                                                    } ${isLocked && status !== 'present' ? 'opacity-50 cursor-not-allowed bg-transparent border-transparent' : ''}`}
                                                >
                                                    <CheckCircle2 className={`w-4 h-4 ${status === 'present' ? 'text-white' : ''}`} />
                                                    Present
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-[#74777f]">
                        <Search className="w-10 h-10 mx-auto text-[#c4c6cf] mb-3" />
                        <p className="text-sm font-medium text-[#43474e]">No students found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
