import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AttendanceService } from '../../tutor/services/attendance.service';
import { ClassesService } from '../services/classes.service';
import { formatAccountID, SLOT_LABELS } from '@/shared/lib/utils';
import type { AttendanceClass, AttendanceSession, AttendanceStudent, AttendanceRecordMap, AttendanceStatus } from '../../tutor/types/attendance';
import { AttendanceSessionList } from '../../tutor/components/AttendanceSessionList';
import { AttendanceSheet } from '../../tutor/components/AttendanceSheet';
import { showConfirmModal, showAlertModal } from '@/utils/modal';

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
        const loadClassData = async () => {
            if (!classId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const classData = await ClassesService.getClassById(classId);
                if (classData) {
                    setClasses([{
                        id: classData.id,
                        name: classData.name || 'Unknown Class',
                        students: (classData as unknown as { students?: unknown[] }).students?.length || 0
                    }]);
                    
                    const classSessions = (classData as unknown as { sessions?: { id: string, session_number: number, date: string, time: string }[] }).sessions || [];
                    setSessions(classSessions.map((s) => ({
                        id: s.id,
                        classId: classData.id,
                        name: `Session ${s.session_number}`,
                        date: s.date ? new Date(s.date).toISOString().split('T')[0] : '',
                        time: (s as { slot?: string }).slot ? SLOT_LABELS[(s as { slot?: string }).slot!] || (s as { slot?: string }).slot : 'TBD',
                        status: 'pending'
                    })));
                }
            } catch (err) {
                console.error("Failed to load class info", err);
            }
            setLoading(false);
        };
        loadClassData();
    }, [classId]);

    // Load attendance when session selected
    useEffect(() => {
        const loadAttendance = async () => {
            if (!selectedSessionId) return;
            setLoading(true);
            try {
                const records = await AttendanceService.getAttendanceBySession(selectedSessionId);
                
                const loadedStudents: AttendanceStudent[] = [];
                const recordMap: Record<string, AttendanceStatus> = {};
                
                records.forEach((record: unknown) => {
                    const rec = record as { account?: { full_name?: string, account_code?: string }, learner_id: string, status?: string };
                    const acc = rec.account || {};
                    loadedStudents.push({
                        id: rec.learner_id,
                        code: formatAccountID(acc.account_code || rec.learner_id, 'LEARNER'),
                        name: acc.full_name || 'Unknown Learner'
                    });
                    let parsedStatus = (rec.status || 'NOT_YET').toLowerCase();
                    if (parsedStatus.includes('absent')) parsedStatus = 'absent';
                    recordMap[rec.learner_id] = parsedStatus as AttendanceStatus;
                });
                
                setStudents(loadedStudents);
                setAttendanceRecords(prev => ({
                    ...prev,
                    [selectedSessionId]: recordMap
                }));
            } catch (err) {
                console.error("Failed to load attendance", err);
            }
            setLoading(false);
        };
        loadAttendance();
    }, [selectedSessionId]);

    const selectedClass = classes.find(c => c.id === classId);
    const classSessions = sessions.filter(s => s.classId === classId);
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    
    const currentRecords = selectedSessionId ? (attendanceRecords[selectedSessionId] || {}) : {};
    
    const isLocked = false; // Staff can always edit
    
    
    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
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
        if (!selectedSessionId) return;
        const newRecords: Record<string, AttendanceStatus> = { ...currentRecords };
        students.forEach(stu => {
            newRecords[stu.id] = status;
        });
        setAttendanceRecords(prev => ({
            ...prev,
            [selectedSessionId]: newRecords
        }));
    };

    const handleSubmitAttendance = async () => {
        if (!selectedSession || !selectedSessionId) return;
        const isConfirmed = await showConfirmModal('Confirm Submission', 'Are you sure you want to submit this attendance record? You will not be able to change it later without staff approval.', 'warning');
        if (isConfirmed) {
            try {
                const recordsToSubmit = Object.entries(currentRecords).map(([learner_id, status]) => {
                    const statusStr = (status as string).toUpperCase();
                    return {
                        learner_id,
                        status: statusStr,
                        notes: ''
                    };
                });
                
                await AttendanceService.submitAttendance(selectedSessionId, recordsToSubmit);
                
                setSessions(prev => prev.map(s => 
                    s.id === selectedSession.id ? { ...s, status: 'submitted' } : s
                ));
                showAlertModal('Success', 'Attendance submitted successfully', 'success');
            } catch (_err) {
                showAlertModal('Error', 'Failed to submit attendance', 'error');
            }
        }
    };

    if (loading && !selectedClass) {
        return (
            <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm mt-8 mx-auto max-w-3xl">
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
                            learners={students}
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
