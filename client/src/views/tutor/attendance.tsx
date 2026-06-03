import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardCheck, Calendar, Clock, CheckCircle2, XCircle, Search, Check, Send, Users, ChevronRight, BookOpen, ArrowLeft, ChevronDown, Info } from 'lucide-react';

const MOCK_CLASSES = [
    { id: 'c1', name: 'IELTS Mastery - Advanced', students: 5 },
    { id: 'c2', name: 'TOEIC Prep - Intensive', students: 5 },
    { id: 'c3', name: 'Communication Skills', students: 5 },
];

const MOCK_SESSIONS = [
    // IELTS Mastery
    { id: 's1', classId: 'c1', name: 'Session 1 - Reading Strategies', date: '2026-06-01', time: '18:00 - 20:00', status: 'submitted' },
    { id: 's2', classId: 'c1', name: 'Session 2 - Listening Practice', date: '2026-06-03', time: '18:00 - 20:00', status: 'pending' },
    { id: 's3', classId: 'c1', name: 'Session 3 - Speaking Mock Test', date: '2026-06-05', time: '18:00 - 20:00', status: 'pending' },
    // TOEIC Prep
    { id: 's4', classId: 'c2', name: 'Session 1 - Grammar Review', date: '2026-06-02', time: '19:00 - 21:00', status: 'submitted' },
    { id: 's5', classId: 'c2', name: 'Session 2 - Reading Comp', date: '2026-06-04', time: '19:00 - 21:00', status: 'pending' },
    // Communication Skills
    { id: 's6', classId: 'c3', name: 'Session 1 - Introduction', date: '2026-06-01', time: '09:00 - 11:00', status: 'submitted' },
];

const MOCK_STUDENTS = [
    { id: 'stu1', code: 'STU-001', name: 'Nguyen Van A' },
    { id: 'stu2', code: 'STU-002', name: 'Tran Thi B' },
    { id: 'stu3', code: 'STU-003', name: 'Le Van C' },
    { id: 'stu4', code: 'STU-004', name: 'Pham Thi D' },
    { id: 'stu5', code: 'STU-005', name: 'Hoang Van E' },
];

type AttendanceStatus = 'present' | 'absent' | null;

const ClassAttendance = () => {
    const [searchParams] = useSearchParams();
    const [selectedClassId, setSelectedClassId] = useState<string>(searchParams.get('classId') || MOCK_CLASSES[0].id);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(searchParams.get('sessionId') || null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // State to hold attendance records per session
    // Map<sessionId, Map<studentId, status>>
    const [attendanceRecords, setAttendanceRecords] = useState<Record<string, Record<string, AttendanceStatus>>>({
        's1': { 'stu1': 'present', 'stu2': 'present', 'stu3': 'present', 'stu4': 'present', 'stu5': 'absent' },
        's4': { 'stu1': 'present', 'stu2': 'absent', 'stu3': 'present', 'stu4': 'present', 'stu5': 'present' },
        's6': { 'stu1': 'present', 'stu2': 'present', 'stu3': 'present', 'stu4': 'present', 'stu5': 'present' },
    });
    
    const [sessions, setSessions] = useState(MOCK_SESSIONS);

    const selectedClass = MOCK_CLASSES.find(c => c.id === selectedClassId);
    const classSessions = sessions.filter(s => s.classId === selectedClassId);
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    
    // Get records for current session, default to empty object
    const currentRecords = selectedSessionId ? (attendanceRecords[selectedSessionId] || {}) : {};
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isLocked = selectedSession?.date !== todayStr;
    
    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        if (isLocked) return; // Cannot edit locked sessions
        if (!selectedSessionId) return;
        
        setAttendanceRecords(prev => ({
            ...prev,
            [selectedSessionId]: {
                ...(prev[selectedSessionId] || {}),
                [studentId]: status
            }
        }));
    };

    const handleMarkAll = (status: AttendanceStatus) => {
        if (isLocked) return;
        if (!selectedSessionId) return;
        
        const newRecords: Record<string, AttendanceStatus> = {};
        MOCK_STUDENTS.forEach(stu => {
            newRecords[stu.id] = status;
        });
        
        setAttendanceRecords(prev => ({
            ...prev,
            [selectedSessionId]: newRecords
        }));
    };

    const handleSubmitAttendance = () => {
        if (!selectedSession) return;
        
        if (window.confirm('Are you sure you want to submit this attendance record? You will not be able to change it later without staff approval.')) {
            setSessions(prev => prev.map(s => 
                s.id === selectedSession.id ? { ...s, status: 'submitted' } : s
            ));
        }
    };

    const filteredStudents = MOCK_STUDENTS.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    

    return (
        <div className="p-6 max-w-[1400px] mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5]">
                    <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-[28px] font-bold text-[#181c1e] tracking-tight">Class Attendance</h1>
                    <p className="text-[#43474e] text-[15px]">Select a class and session to manage and record attendance.</p>
                </div>
            </div>

            <div className="flex flex-col gap-6 items-start">
                {/* Top Toolbar: Class Selection */}
                <div className="w-full relative z-20">
                    <span className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-1.5 block">Select Class</span>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full md:w-[400px] flex items-center justify-between p-3 rounded-xl border border-[#c4c6cf] hover:border-[#0061a5] bg-white transition-colors text-left shadow-sm"
                    >
                        {selectedClass ? (
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#e3f2fd] text-[#0061a5] flex items-center justify-center font-bold text-[13px]">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-[14px] text-[#002045] leading-none mb-1">{selectedClass.name}</div>
                                    <div className="text-[11px] font-medium text-[#74777f]">
                                        {selectedClass.id.toUpperCase()} • {selectedClass.students} students
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-[#74777f]">Select a class...</span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-[#74777f] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[400px] bg-white border border-[#e0e3e5] rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
                                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#c4c6cf] p-2 space-y-1">
                                    {MOCK_CLASSES.map(cls => (
                                        <button
                                            key={cls.id}
                                            onClick={() => {
                                                setSelectedClassId(cls.id);
                                                setSelectedSessionId(null);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f0f4f8] transition-colors ${selectedClassId === cls.id ? 'bg-[#e6f0fa]' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] ${selectedClassId === cls.id ? 'bg-[#0061a5] text-white' : 'bg-[#e0e3e5] text-[#43474e]'}`}>
                                                {cls.id.toUpperCase()}
                                            </div>
                                            <div className="text-left">
                                                <div className={`font-bold text-[13px] leading-none mb-1 ${selectedClassId === cls.id ? 'text-[#0061a5]' : 'text-[#181c1e]'}`}>
                                                    {cls.name}
                                                </div>
                                                <div className="text-[11px] text-[#74777f] leading-none">{cls.students} students</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Main Content Area: Dynamic View (Sessions or Attendance Sheet) */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col min-h-[500px]">
                    {selectedSession ? (
                        <>
                            {/* Sheet Header */}
                            <div className="p-6 border-b border-[#e0e3e5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <button 
                                        onClick={() => setSelectedSessionId(null)}
                                        className="flex items-center gap-2 text-[#0061a5] font-bold text-[13px] mb-4 hover:underline"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back to Sessions
                                    </button>
                                    <h2 className="text-[20px] font-bold text-[#002045] flex items-center gap-3 mb-1">
                                        {selectedClass?.name}
                                        <ChevronRight className="w-5 h-5 text-[#c4c6cf]" />
                                        <span className="text-[#43474e] text-[16px] font-semibold">{selectedSession.name}</span>
                                    </h2>
                                    <div className="flex items-center gap-6 text-[#74777f] text-[13px] font-medium mt-2">
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(selectedSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {selectedSession.time}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                    {isLocked ? (
                                        <div className="flex items-center gap-2 text-[#43474e] bg-[#e0e3e5] px-4 py-2 rounded-lg border border-[#c4c6cf] font-bold text-[14px]">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Record Locked
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <button 
                                                onClick={handleSubmitAttendance}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all shadow-sm ${
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
                                <div className="relative w-full md:w-[300px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                    <input 
                                        type="text" 
                                        placeholder="Search student name or ID..." 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-[13px]"
                                    />
                                </div>
                                
                                {(!isLocked) && (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[12px] font-bold text-[#74777f] uppercase mr-2">Mark All As:</span>
                                        <button onClick={() => handleMarkAll('absent')} className="px-3 py-1.5 rounded-md text-[12px] font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors">Absent</button>
                                        <button onClick={() => handleMarkAll('present')} className="px-3 py-1.5 rounded-md text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">Present</button>
                                    </div>
                                )}
                            </div>

                            {/* Student List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredStudents.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-white sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] w-[120px]">ID</th>
                                                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Student</th>
                                                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] text-right">Attendance Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#e0e3e5]">
                                            {filteredStudents.map(student => {
                                                const status = currentRecords[student.id] || 'absent'; // default to absent
                                                
                                                return (
                                                    <tr key={student.id} className="hover:bg-[#f8f9fa] transition-colors">
                                                        <td className="p-4 text-[13px] font-bold text-[#181c1e] uppercase tracking-wide">{student.code}</td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-[#e3f2fd] text-[#0061a5] flex items-center justify-center font-bold text-[12px]">
                                                                    {student.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                                                </div>
                                                                <span className="font-bold text-[#181c1e] text-[14px]">{student.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {/* Absent Button (Left) */}
                                                                <button 
                                                                    disabled={isLocked}
                                                                    onClick={() => handleStatusChange(student.id, 'absent')}
                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
                                                                        status === 'absent' 
                                                                            ? 'bg-rose-500 text-white border-rose-600 shadow-sm' 
                                                                            : 'bg-white text-[#74777f] border-[#c4c6cf] hover:border-rose-500 hover:text-rose-600'
                                                                    } ${isLocked && status !== 'absent' ? 'opacity-50 cursor-not-allowed bg-transparent border-transparent' : ''}`}
                                                                >
                                                                    <XCircle className={`w-4 h-4 ${status === 'absent' ? 'text-white' : ''}`} />
                                                                    Absent
                                                                </button>
                                                                
                                                                {/* Present Button (Right) */}
                                                                <button 
                                                                    disabled={isLocked}
                                                                    onClick={() => handleStatusChange(student.id, 'present')}
                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all border ${
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
                                        <p className="text-[15px] font-medium text-[#43474e]">No students found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : selectedClass ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-[#e0e3e5]">
                                <h2 className="text-[20px] font-bold text-[#002045] flex items-center gap-3">
                                    {selectedClass.name}
                                </h2>
                                <p className="text-[#43474e] text-[14px] mt-1">Select a session to take attendance.</p>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-3 overflow-y-auto">
                                {classSessions.map(session => (
                                    <div 
                                        key={session.id}
                                        onClick={() => setSelectedSessionId(session.id)}
                                        className="bg-white border border-[#e0e3e5] rounded-xl p-4 hover:border-[#0061a5] hover:shadow-sm transition-all cursor-pointer group flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] border border-[#e0e3e5] flex items-center justify-center text-[#43474e] font-bold text-[14px]">
                                                {session.id.toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[15px] text-[#181c1e] mb-1.5 group-hover:text-[#0061a5]">{session.name}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-[13px] text-[#43474e]">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#74777f]" /> {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#74777f]" /> {session.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className={`text-[11px] font-bold px-3 py-1 rounded-md ${
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
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#74777f]">
                            <BookOpen className="w-16 h-16 text-[#e0e3e5] mb-4" />
                            <h3 className="text-[18px] font-bold text-[#43474e] mb-1">Select a Class</h3>
                            <p className="text-[14px]">Choose a class from the list to view its sessions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassAttendance;
