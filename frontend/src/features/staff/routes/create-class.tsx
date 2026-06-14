import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Users, MapPin, Calendar, ChevronRight, ChevronDown } from 'lucide-react';
import { CoursesService } from '@/shared/services/courses.service';
import { AccountsService } from '../services/accounts.service';
import { ClassroomsService } from '@/shared/services/classrooms.service';
import type { Classroom } from '@/shared/services/classrooms.service';
import { ClassesService } from '../services/classes.service';
import { showAlertModal } from '@/utils/modal';

const CreateClass = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isEdit = location.pathname.includes('/edit');
    useParams();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Classroom | null>(null);
    const roomDropdownRef = useRef<HTMLDivElement>(null);

    const [course, setCourse] = useState('');
    const [className, setClassName] = useState('');
    const [tutor, setTutor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [capacity, setCapacity] = useState(20);

    const [allCourses, setAllCourses] = useState<{id: string, title: string}[]>([]);
    const [allTutors, setAllTutors] = useState<{id: string, full_name: string}[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Classroom[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [coursesData, tutorsData, roomsData] = await Promise.all([
                    CoursesService.getCourses(),
                    AccountsService.getAccounts({ page: 1, limit: 100, role: 'TUTOR' }),
                    ClassroomsService.getAll()
                ]);
                setAllCourses(coursesData);
                setAllTutors((tutorsData as any).data?.data || []);
                setAvailableRooms(roomsData);
            } catch (err) {
                console.error("Failed to load form data", err);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (roomDropdownRef.current && !roomDropdownRef.current.contains(event.target as Node)) {
                setIsRoomDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in-up max-w-4xl pb-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-[#74777f]">
                <Link to="/staff/classes" className="hover:text-[#0061a5] transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Manage Classes
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold text-[#002045]">{isEdit ? 'Edit Class' : 'Create New Class'}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">{isEdit ? 'Edit Class' : 'Create New Class'}</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* Course Selection */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#002045] border-b pb-2">1. Select Course & Name</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e]">Course Program <span className="text-red-500">*</span></label>
                                <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
                                    <option value="">-- Select Course --</option>
                                    {allCourses.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e]">Class Name (Code) <span className="text-red-500">*</span></label>
                                <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. IELTS-A03" className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" />
                            </div>
                        </div>
                    </div>

                    {/* Tutor & Room */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#002045] border-b pb-2">2. Assignments</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1"><Users className="w-4 h-4 text-gray-500"/> Assign Tutor</label>
                                <select value={tutor} onChange={(e) => setTutor(e.target.value)} className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
                                    <option value="">-- Select Available Tutor --</option>
                                    {allTutors.map(t => (
                                        <option key={t.id} value={t.id}>{t.full_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2 relative" ref={roomDropdownRef}>
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-500"/> Assign Room</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                                    className="w-full px-4 py-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 flex justify-between items-center text-left"
                                >
                                    {selectedRoom ? (
                                        <span className="truncate">
                                            {selectedRoom.room_name} (Cap: {selectedRoom.capacity})
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">-- Select Available Room --</span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 shrink-0 text-gray-500 transition-transform ${isRoomDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isRoomDropdownOpen && (
                                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[#c4c6cf] rounded-xl shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
                                        <button 
                                            className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors text-gray-500"
                                            onClick={() => { setSelectedRoom(null); setIsRoomDropdownOpen(false); }}
                                        >
                                            -- Select Available Room --
                                        </button>
                                        {availableRooms.map((room) => (
                                            <button 
                                                key={room.id}
                                                className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors truncate"
                                                onClick={() => { setSelectedRoom(room); setIsRoomDropdownOpen(false); }}
                                            >
                                                {room.room_name} (Cap: {room.capacity})
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e]">Capacity <span className="text-red-500">*</span></label>
                                <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" />
                            </div>
                        </div>
                    </div>

                    {/* Schedule Details */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#002045] border-b pb-2">3. Timeline</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-500"/> Start Date <span className="text-red-500">*</span></label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-500"/> End Date <span className="text-red-500">*</span></label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#f8f9fa] border-t border-[#e0e3e5] flex justify-end gap-3">
                    <Link to="/staff/classes" className="px-6 py-3 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors">
                        Cancel
                    </Link>
                    <button 
                        disabled={isSubmitting}
                        onClick={async () => {
                            if (!course || !className || !startDate || !endDate || !capacity) {
                                showAlertModal('Lỗi', 'Vui lòng nhập đầy đủ các trường bắt buộc (*)', 'error');
                                return;
                            }
                            setIsSubmitting(true);
                            try {
                                await ClassesService.createClass({
                                    name: className,
                                    course_id: course,
                                    tutor_id: tutor || null,
                                    classroom_id: selectedRoom?.id || null,
                                    start_date: startDate,
                                    end_date: endDate,
                                    capacity
                                });
                                showAlertModal('Thành công', 'Khởi tạo lớp học mới thành công!', 'success').then(() => {
                                    navigate('/staff/classes');
                                });
                            } catch (err: any) {
                                showAlertModal('Lỗi', err.message || 'Có lỗi xảy ra khi tạo lớp', 'error');
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        className="px-6 py-3 font-semibold text-white bg-[#0061a5] rounded-xl hover:bg-[#004a80] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" /> {isSubmitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Save Class')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateClass;
