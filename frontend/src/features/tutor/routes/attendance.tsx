import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AttendanceService } from '../services/attendance.service';
import type { AttendanceClass, AttendanceSession, AttendanceStudent, AttendanceRecordMap, AttendanceStatus } from '../types/attendance';
import { AttendanceSessionList } from '../components/AttendanceSessionList';
import { AttendanceSheet } from '../components/AttendanceSheet';
import { showConfirmModal } from '@/utils/modal';
const ClassAttendance = () => {
    const { id: classId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    
    // Data states
    const [classes, setClasses] = useState<AttendanceClass[]>([]);
    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [students, setStudents] = useState<AttendanceStudent[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecordMap>({});
    
    // UI states
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(searchParams.get('sessionId') || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [classesData, sessionsData, studentsData, recordsData] = await Promise.all([
                AttendanceService.getClasses(),
                AttendanceService.getSessions(),
                AttendanceService.getStudents(),
                AttendanceService.getInitialRecords()
            ]);
            setClasses(classesData);
            setSessions(sessionsData);
            setStudents(studentsData);
            setAttendanceRecords(recordsData);
            setLoading(false);
        };
        loadData();
    }, []);

    const selectedClass = classes.find(c => c.id === classId);
    const classSessions = sessions.filter(s => s.classId === classId);
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    
    const currentRecords = selectedSessionId ? (attendanceRecords[selectedSessionId] || {}) : {};
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isLocked = selectedSession?.date !== todayStr;
    
    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        if (isLocked || !selectedSessionId) return;
        setAttendanceRecords(prev => ({
            ...prev,
            [selectedSessionId]: {
                ...(prev[selectedSessionId] || {}),
                [studentId]: status
            }
        }));
    };

    const handleMarkAll = (status: AttendanceStatus) => {
        if (isLocked || !selectedSessionId) return;
        const newRecords: Record<string, AttendanceStatus> = {};
        students.forEach(stu => {
            newRecords[stu.id] = status;
        });
        setAttendanceRecords(prev => ({
            ...prev,
            [selectedSessionId]: newRecords
        }));
    };

    const handleSubmitAttendance = async () => {
        if (!selectedSession) return;
        const isConfirmed = await showConfirmModal('Confirm Submission', 'Are you sure you want to submit this attendance record? You will not be able to change it later without staff approval.', 'warning');
        if (isConfirmed) {
            setSessions(prev => prev.map(s => 
                s.id === selectedSession.id ? { ...s, status: 'submitted' } : s
            ));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-[12px] bg-white shadow-sm mt-8 mx-auto max-w-350">
                <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col gap-6 items-start">


                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col min-h-125">
                    {selectedSession && selectedClass ? (
                        <AttendanceSheet 
                            selectedClass={selectedClass}
                            selectedSession={selectedSession}
                            students={students}
                            currentRecords={currentRecords}
                            searchQuery={searchQuery}
                            isLocked={isLocked}
                            onBack={() => setSelectedSessionId(null)}
                            setSearchQuery={setSearchQuery}
                            onMarkAll={handleMarkAll}
                            onStatusChange={handleStatusChange}
                            onSubmit={handleSubmitAttendance}
                        />
                    ) : (
                        <AttendanceSessionList 
                            selectedClass={selectedClass}
                            classSessions={classSessions}
                            onSelectSession={setSelectedSessionId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassAttendance;
