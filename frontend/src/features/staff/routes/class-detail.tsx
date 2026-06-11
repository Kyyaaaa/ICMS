import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Users, Calendar, MapPin, Edit, BookOpen, Trash2 } from 'lucide-react';
import type { ClassSession, EnrolledStudent, RoomOption } from '../types/class-detail';
import { ClassDetailService } from '../services/class-detail.service';
import { ClassScheduleTab } from '../components/ClassScheduleTab';
import { ClassStudentsTab } from '../components/ClassStudentsTab';
import { EditSessionModal } from '../components/EditSessionModal';
import { showAlertModal, showConfirmModal } from '@/utils/modal';

const StaffClassDetail = () => {
    const { id } = useParams();
    
    const [activeTab, setActiveTab] = useState('schedule');
    const [scheduleData, setScheduleData] = useState<ClassSession[]>([]);
    const [students, setStudents] = useState<EnrolledStudent[]>([]);
    const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const classIdStr = id || '101';
            const [sched, studs, rooms] = await Promise.all([
                ClassDetailService.getSchedule(classIdStr),
                ClassDetailService.getStudents(classIdStr),
                ClassDetailService.getAvailableRooms()
            ]);
            setScheduleData(sched);
            setStudents(studs);
            setAvailableRooms(rooms);
        };
        loadData();
    }, [id]);

    const enrolledStudents = students.length;
    const courseName = id === '101' || id === '102' ? 'IELTS Masterclass' : id === '201' ? 'TOEIC Intensive' : 'Course Name';
    const classNameStr = id === '101' ? 'IELTS-A01' : id === '102' ? 'IELTS-A02' : id === '201' ? 'TOEIC-B01' : `Class-${id}`;

    const handleEditSession = (session: ClassSession) => {
        setSelectedSession(session);
        setIsEditModalOpen(true);
    };

    const handleSaveSession = async (updatedSession: ClassSession) => {
        const isConfirmed = await showConfirmModal('Confirm Update', 'Are you sure you want to update this session schedule?', 'warning');
        if (!isConfirmed) return;

        await ClassDetailService.updateSession(updatedSession);
        setScheduleData(scheduleData.map(s => s.session === updatedSession.session ? updatedSession : s));
        setIsEditModalOpen(false);
    };

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
                <span className="font-semibold text-[#002045]">Class #{id || '101'}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Class: {classNameStr}</h1>
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
                                        // Delete logic
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
                        <p className="font-bold text-[#002045]">Dr. Sarah Connor</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs text-gray-500">Schedule</p>
                        <p className="font-bold text-[#002045] text-sm">Mon/Wed/Fri 18:00</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><MapPin className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs text-gray-500">Room</p>
                        <p className="font-bold text-[#002045]">Room 102</p>
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
                    Enrolled Students ({enrolledStudents}/20)
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                {activeTab === 'schedule' && (
                    <ClassScheduleTab scheduleData={scheduleData} onEditSession={handleEditSession} />
                )}

                {activeTab === 'students' && (
                    <ClassStudentsTab students={students} />
                )}
            </div>

            {/* Edit Session Modal */}
            {isEditModalOpen && selectedSession && (
                <EditSessionModal 
                    session={selectedSession} 
                    availableRooms={availableRooms} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSaveSession} 
                />
            )}
        </div>
    );
};
export default StaffClassDetail;
