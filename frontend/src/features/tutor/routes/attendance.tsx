import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AttendanceService } from '../services/attendance.service';
import { ClassesService } from '@/features/staff/services/classes.service';
import type { AttendanceClass, AttendanceSession, AttendanceStudent, AttendanceRecordMap, AttendanceStatus } from '../types/attendance';
import { AttendanceSessionList } from '../components/AttendanceSessionList';
import { AttendanceSheet } from '../components/AttendanceSheet';
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
                        name: classData.name || `Class ${classData.class_code}`,
                        students: (classData as any).students?.length || 0
                    }]);
                    
                    const classSessions = (classData as any).sessions || [];
                    setSessions(classSessions.map((s: any) => ({
                        id: s.id,
                        classId: classData.id,
                        name: `Session ${s.slot}`,
                        date: s.date ? new Date(s.date).toISOString().split('T')[0] : '',
                        time: s.time || 'TBD',
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
                
                records.forEach((record: any) => {
                    const acc = record.account || {};
                    loadedStudents.push({
                        id: record.learner_id,
                        code: `STU-${record.learner_id.substring(0, 4)}`, // mock code logic for now
                        name: acc.full_name || 'Unknown Learner'
                    });
                    recordMap[record.learner_id] = (record.status || 'PRESENT').toLowerCase() as AttendanceStatus;
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
        if (!selectedSession || !selectedSessionId) return;
        const isConfirmed = await showConfirmModal('Confirm Submission', 'Are you sure you want to submit this attendance record? You will not be able to change it later without staff approval.', 'warning');
        if (isConfirmed) {
            try {
                const recordsToSubmit = Object.entries(currentRecords).map(([learner_id, status]) => ({
                    learner_id,
                    status: (status as string).toUpperCase(),
                    notes: ''
                }));
                
                await AttendanceService.submitAttendance(selectedSessionId, recordsToSubmit);
                
                setSessions(prev => prev.map(s => 
                    s.id === selectedSession.id ? { ...s, status: 'submitted' } : s
                ));
                showAlertModal('Success', 'Attendance submitted successfully', 'success');
            } catch (err) {
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
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col min-h-[500px]">
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
