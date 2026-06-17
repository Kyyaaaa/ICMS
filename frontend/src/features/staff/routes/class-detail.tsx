import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Users, Calendar, MapPin, Edit, BookOpen, Trash2 } from 'lucide-react';
import type { Class, Session } from '../types/class';
import { ClassesService } from '../services/classes.service';
import { AccountsService } from '../services/accounts.service';
import { ClassroomsService } from '@/shared/services/classrooms.service';
import type { Classroom } from '@/shared/services/classrooms.service';
import { ClassScheduleTab } from '../components/ClassScheduleTab';
import { ClassStudentsTab } from '../components/ClassStudentsTab';
import { EditSessionModal } from '../components/EditSessionModal';
import { AddStudentModal } from '../components/AddStudentModal';
import { showAlertModal, showConfirmModal } from '@/utils/modal';

const StaffClassDetail = () => {
    const { id } = useParams();
    
    const [activeTab, setActiveTab] = useState('schedule');
    const [classData, setClassData] = useState<Class | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [students, setStudents] = useState<any[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Classroom[]>([]);
    const [availableTutors, setAvailableTutors] = useState<{ id: string; full_name: string }[]>([]);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [availableLearners, setAvailableLearners] = useState<unknown[]>([]);

    const loadData = async () => {
        if (!id) return;
        try {
            const [cls, rooms, tutors, studentsData, learnersRes] = await Promise.all([
                ClassesService.getClassById(id),
                ClassroomsService.getAll(),
                AccountsService.getAccounts({ page: 1, limit: 100, role: 'TUTOR' }),
                ClassesService.getClassStudents(id),
                AccountsService.getAccounts({ page: 1, limit: 100, role: 'LEARNER' })
            ]);
            setClassData(cls);
            setStudents(studentsData || []);
            setAvailableRooms(rooms);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setAvailableTutors((tutors as any).data?.data || []);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setAvailableLearners((learnersRes as any).data?.data || []);
        } catch (err) {
            console.error("Failed to load class details", err);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            await loadData();
        };
        fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const enrolledStudents = students.length;
    const courseName = classData?.courses?.title || 'Course Name';
    const classNameStr = classData?.name || `Class-${id}`;

    const handleEditSession = (session: Session) => {
        setSelectedSession(session);
        setIsEditModalOpen(true);
    };

    const handleSaveSession = async (updatedSession: Partial<Session>) => {
        const isConfirmed = await showConfirmModal('Confirm Update', 'Are you sure you want to update this session schedule?', 'warning');
        if (!isConfirmed) return;

        try {
            await ClassesService.updateSession(id as string, updatedSession.id as string, {
                tutor_id: updatedSession.tutor_id,
                classroom_id: updatedSession.classroom_id,
                date: updatedSession.date,
                slot: updatedSession.slot
            });
            showAlertModal('Success', 'Session updated successfully', 'success');
            setIsEditModalOpen(false);
            loadData(); // reload
        } catch (err: unknown) {
            showAlertModal('Conflict', (err as Error).message || 'Error updating session', 'error');
        }
    };

    const handleAddStudent = async (learnerId: string) => {
        try {
            await ClassesService.addStudentToClass(learnerId, id as string);
            showAlertModal('Success', 'Student added successfully', 'success');
            setIsAddStudentModalOpen(false);
            loadData();
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            showAlertModal('Error', (err as any).response?.data?.message || (err as Error).message || 'Failed to add student', 'error');
        }
    };

    if (!classData) {
        return <div className="p-10 text-center">Loading class details...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-[#74777f]">
                <Link to="/staff/classes" className="hover:text-[#0061a5] transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Manage Classes
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span>{courseName}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold text-[#002045]">{classNameStr}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Class: {classNameStr}</h1>
                <div className="flex gap-2">
                    <Link to={`/staff/classes/edit/${id}`} className="px-4 py-2 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
                        <Edit className="w-4 h-4" /> Edit Info
                    </Link>
                    <button 
                            onClick={async () => {
                                if (enrolledStudents > 0) {
                                    showAlertModal('Error', 'Cannot delete this class because there are students enrolled. Please remove all students first.', 'error');
                                } else {
                                    const isConfirmed = await showConfirmModal('Confirm Delete', 'Are you sure you want to delete this class?', 'warning');
                                    if (isConfirmed) {
                                        try {
                                            await ClassesService.deleteClass(id as string);
                                            showAlertModal('Success', 'Class deleted successfully', 'success').then(() => {
                                                window.location.href = '/staff/classes';
                                            });
                                        } catch (error: unknown) {
                                            showAlertModal('Error', (error as Error).message || 'Failed to delete class', 'error');
                                        }
                                    }
                                }
                            }} 
                            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${enrolledStudents > 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'}`}
                            title={enrolledStudents > 0 ? "Cannot delete class with enrolled students" : "Delete Class"}
                        >
                            <Trash2 className="w-4 h-4" /> Delete Class
                        </button>
                </div>
            </div>

            {/* Quick Stats / Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-[#0061a5] rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs text-gray-500">Course</p>
                        <p className="font-bold text-[#002045] truncate">{courseName}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center"><Users className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs text-gray-500">Tutor</p>
                        <p className="font-bold text-[#002045]">{classData?.tutor?.full_name || 'Not assigned'}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-bold text-[#002045] text-sm">{classData?.status}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><MapPin className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs text-gray-500">Room</p>
                        <p className="font-bold text-[#002045]">{classData?.classroom?.room_name || 'Not assigned'}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#e0e3e5] mb-6">
                <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'schedule' ? 'border-[#0061a5] text-[#0061a5]' : 'border-transparent text-[#74777f] hover:text-[#002045]'}`}
                >
                    Class Schedule
                </button>
                <button 
                    onClick={() => setActiveTab('students')}
                    className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'students' ? 'border-[#0061a5] text-[#0061a5]' : 'border-transparent text-[#74777f] hover:text-[#002045]'}`}
                >
                    Enrolled Learners ({enrolledStudents}/20)
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                {activeTab === 'schedule' && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <ClassScheduleTab scheduleData={(classData as any).sessions || []} onEditSession={handleEditSession} />
                )}

                {activeTab === 'students' && (
                    <ClassStudentsTab 
                        classId={id}
                        students={students} 
                        onRemoveStudent={async (studentId) => {
                            const isConfirmed = await showConfirmModal('Confirm Remove', 'Are you sure you want to remove this learner from the class?', 'warning');
                            if (!isConfirmed) return;
                            try {
                                await ClassesService.cancelEnrollment(studentId);
                                showAlertModal('Success', 'Learner removed successfully', 'success');
                                loadData();
                            } catch (err: unknown) {
                                showAlertModal('Error', (err as Error).message || 'Failed to remove learner', 'error');
                            }
                        }}
                        onAddStudent={() => setIsAddStudentModalOpen(true)}
                    />
                )}
            </div>

            {/* Edit Session Modal */}
            {isEditModalOpen && selectedSession && (
                <EditSessionModal 
                    session={selectedSession} 
                    availableRooms={availableRooms} 
                    availableTutors={availableTutors}
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSaveSession} 
                />
            )}

            {isAddStudentModalOpen && (
                <AddStudentModal
                    availableLearners={availableLearners}
                    onClose={() => setIsAddStudentModalOpen(false)}
                    onSave={handleAddStudent}
                />
            )}
        </div>
    );
};
export default StaffClassDetail;
