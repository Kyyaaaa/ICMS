import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Users, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { CoursesService } from '@/shared/services/courses.service';
import type { Course } from '@/shared/types/course';
import { AccountsService } from '../services/accounts.service';
import { TutorAvailabilityService } from '../services/tutor-availability.service';
import type { TutorAvailabilityProfile } from '../types/tutor-availability';
import { ClassroomsService } from '@/shared/services/classrooms.service';
import type { Classroom } from '@/shared/services/classrooms.service';
import { ClassesService } from '../services/classes.service';
import { showAlertModal } from '@/utils/modal';

const CreateClass = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isEdit = location.pathname.includes('/edit');
    const { id } = useParams();

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
    const [status, setStatus] = useState('UPCOMING');

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [allTutors, setAllTutors] = useState<{id: string, full_name: string}[]>([]);
    const [tutorsAvailability, setTutorsAvailability] = useState<TutorAvailabilityProfile[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Classroom[]>([]);
    
    const [weeklySchedule, setWeeklySchedule] = useState<{dayOfWeek: number, slot: string}[]>([]);
    const [generatedSessions, setGeneratedSessions] = useState<{session_number: number, date: string, slot: string}[]>([]);
    const [hasLearners, setHasLearners] = useState(false);
    const [occupiedGlobalSlots, setOccupiedGlobalSlots] = useState<{dayOfWeek: number, slot: string}[]>([]);

    useEffect(() => {
        const fetchOccupied = async () => {
            if (tutor && startDate) {
                const sessions = await ClassesService.getOccupiedSessions({ 
                    tutor_id: tutor, 
                    start_date: startDate,
                    exclude_class_id: isEdit ? id : undefined
                });
                
                const occupied: {dayOfWeek: number, slot: string}[] = [];
                sessions.forEach(session => {
                    if (session.date && session.slot) {
                        const dateObj = new Date(session.date);
                        const dayOfWeek = dateObj.getDay();
                        if (!occupied.some(o => o.dayOfWeek === dayOfWeek && o.slot === session.slot)) {
                            occupied.push({ dayOfWeek, slot: session.slot });
                        }
                    }
                });
                setOccupiedGlobalSlots(occupied);
            } else {
                setOccupiedGlobalSlots([]);
            }
        };
        fetchOccupied();
    }, [tutor, startDate, id, isEdit]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [coursesData, tutorsData, roomsData, availabilityData] = await Promise.all([
                    CoursesService.getCourses(),
                    AccountsService.getAccounts({ page: 1, limit: 100, role: 'TUTOR' }),
                    ClassroomsService.getAll(),
                    TutorAvailabilityService.getTutors()
                ]);
                setAllCourses(coursesData);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setAllTutors((tutorsData as any).data?.data || []);
                setAvailableRooms(roomsData);
                setTutorsAvailability(availabilityData || []);

                if (isEdit && id) {
                    const classData = await ClassesService.getClassById(id);
                    setCourse(classData.course_id || '');
                    setClassName(classData.name || '');
                    setTutor(classData.tutor_id || '');
                    setStartDate(classData.start_date || '');
                    setEndDate(classData.end_date || '');
                    setCapacity(classData.capacity || 20);
                    setStatus(classData.status || 'UPCOMING');
                    
                    if (classData.sessions && classData.sessions.length > 0) {
                        const existingSchedule: { dayOfWeek: number, slot: string }[] = [];
                        classData.sessions.forEach((session) => {
                            if (session.date && session.slot) {
                                const dateObj = new Date(session.date);
                                const dayOfWeek = dateObj.getDay();
                                if (!existingSchedule.some(s => s.dayOfWeek === dayOfWeek && s.slot === session.slot)) {
                                    existingSchedule.push({ dayOfWeek, slot: session.slot });
                                }
                            }
                        });
                        setWeeklySchedule(existingSchedule);
                    }

                    if (classData.students && classData.students.length > 0) {
                        setHasLearners(true);
                    }

                    if (classData.classroom_id) {
                        const room = roomsData.find(r => r.id === classData.classroom_id);
                        if (room) setSelectedRoom(room);
                    }
                }
            } catch (err) {
                console.error("Failed to load form data", err);
            }
        };
        loadData();
    }, [isEdit, id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (roomDropdownRef.current && !roomDropdownRef.current.contains(event.target as Node)) {
                setIsRoomDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!startDate || !course || weeklySchedule.length === 0) {
            if (weeklySchedule.length === 0 && generatedSessions.length > 0) {
                // Use a timeout or condition to avoid cascading render warning, though setting state here is standard practice
                setTimeout(() => setGeneratedSessions([]), 0);
            }
            return;
        }
        
        const selectedCourse = allCourses.find(c => c.id === course);
        if (!selectedCourse) return;
        
        const numSessions = parseInt(String(selectedCourse.sessions)) || 0;
        if (numSessions <= 0) return;

        const current = new Date(startDate);
        const sessions = [];
        let sessionCount = 1;
        
        while(sessionCount <= numSessions) {
            const day = current.getDay();
            const matches = weeklySchedule.filter(s => s.dayOfWeek === day);
            
            // Sort matches by slot (slot1, slot2...) so sessions are in chronological order
            matches.sort((a, b) => a.slot.localeCompare(b.slot));

            for (const match of matches) {
                if (sessionCount > numSessions) break;
                sessions.push({
                    session_number: sessionCount,
                    date: current.toISOString().split('T')[0],
                    slot: match.slot
                });
                sessionCount++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        // To avoid synchronous setState in effect cascading renders warnings
        setTimeout(() => {
            setGeneratedSessions(sessions);
            if (sessions.length > 0) {
                setEndDate(sessions[sessions.length - 1].date);
            }
        }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, course, weeklySchedule, allCourses, isEdit]);

    // Update startDate automatically when course changes
    useEffect(() => {
        if (isEdit) return;
        const selectedCourse = allCourses.find(c => c.id === course);
        if (selectedCourse?.next_cohort) {
            const nc = String(selectedCourse.next_cohort);
            // Use setTimeout to avoid synchronous setState ESLint warning
            setTimeout(() => {
                if (nc.includes('/')) {
                    const parts = nc.split('/');
                    if (parts.length === 3) {
                        setStartDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    }
                } else {
                    const d = new Date(nc);
                    if (!isNaN(d.getTime())) {
                        setStartDate(d.toISOString().split('T')[0]);
                    }
                }
            }, 0);
        } else {
            setTimeout(() => setStartDate(''), 0);
        }
    }, [course, allCourses, isEdit]);

    const tutorProfile = tutorsAvailability.find(t => t.id === tutor);
    const tutorSlots = tutorProfile?.slots || [];

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
                                <select disabled={isEdit} value={course} onChange={(e) => setCourse(e.target.value)} className={`w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-[#f8f9fa]'}`}>
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
                                <select value={tutor} onChange={(e) => {
                                    setTutor(e.target.value);
                                    // Reset weekly schedule if tutor changes because availability changes
                                    setWeeklySchedule([]);
                                }} className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
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
                            {isEdit && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#181c1e]">Status <span className="text-red-500">*</span></label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
                                        <option value="UPCOMING">UPCOMING</option>
                                        <option value="ONGOING">ONGOING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELED">CANCELED</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="border-t border-[#e0e3e5] pt-6 mt-6">
                        <h2 className="text-xl font-bold text-[#002045] mb-4">3. Timeline</h2>
                        
                        {course && !startDate && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800">
                                <p>Please ensure the selected course has a valid Next Cohort date, as the class timeline relies on it.</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-[#002045] mb-2">
                                Weekly Schedule (Select from Tutor's availability)
                                {isEdit && !hasLearners && <span className="ml-2 text-xs font-normal text-amber-600 italic">Select slots to generate a new schedule and overwrite existing sessions</span>}
                            </label>
                            
                            {isEdit && hasLearners && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800 flex items-start gap-2 mt-2">
                                    <div className="shrink-0 mt-0.5">ℹ️</div>
                                    <p>This class already has enrolled learners. The weekly schedule cannot be changed globally. To change a specific session's schedule, please use the Class Details page.</p>
                                </div>
                            )}

                            <div className="space-y-2 mt-2">
                                    {!tutor ? (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-gray-500">
                                            Please select a tutor to view their available slots.
                                        </div>
                                    ) : tutorSlots.length === 0 ? (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-amber-700">
                                            This tutor has not registered any availability. Please select another tutor.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Select the weekly slots this class will occur on:</span>
                                                <span className="text-sm font-bold text-[#0061a5] bg-[#e3f2fd] px-3 py-1 rounded-full">
                                                    Selected: {weeklySchedule.length} slot(s) / week
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(dayName => {
                                                    const daySlots = tutorSlots.filter(s => s.startsWith(`${dayName}-`));
                                                    if (daySlots.length === 0) return null;

                                                    return (
                                                        <div key={dayName} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                                            <span className="text-sm font-bold text-[#002045] w-24 shrink-0">{dayName}</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {daySlots.map(slotStr => {
                                                                    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                                                    const shiftToSlotMap: Record<string, string> = {
                                                                        'M1': 'slot1', 'M2': 'slot2',
                                                                        'A1': 'slot3', 'A2': 'slot4',
                                                                        'E1': 'slot5', 'E2': 'slot6'
                                                                    };
                                                                    const shiftToLabelMap: Record<string, string> = {
                                                                        'M1': 'Slot 1 (07:30 - 09:30)', 'M2': 'Slot 2 (09:30 - 11:30)',
                                                                        'A1': 'Slot 3 (13:30 - 15:30)', 'A2': 'Slot 4 (15:30 - 17:30)',
                                                                        'E1': 'Slot 5 (18:00 - 20:00)', 'E2': 'Slot 6 (20:00 - 22:00)'
                                                                    };

                                                                    const shiftName = slotStr.split('-')[1];
                                                                    if (!shiftName) return null;

                                                                    const dayIndex = fullDays.indexOf(dayName);
                                                                    const slotCode = shiftToSlotMap[shiftName] || shiftName;
                                                                    const label = shiftToLabelMap[shiftName] || shiftName;

                                                                    const isSelected = weeklySchedule.some(s => s.dayOfWeek === dayIndex && s.slot === slotCode);
                                                                    const isOccupied = occupiedGlobalSlots.some(s => s.dayOfWeek === dayIndex && s.slot === slotCode);

                                                                    return (
                                                                        <button
                                                                            type="button"
                                                                            disabled={hasLearners || isOccupied}
                                                                            key={slotCode}
                                                                            onClick={() => {
                                                                                if (hasLearners || isOccupied) return;
                                                                                if (isSelected) {
                                                                                    setWeeklySchedule(prev => prev.filter(s => !(s.dayOfWeek === dayIndex && s.slot === slotCode)));
                                                                                } else {
                                                                                    setWeeklySchedule(prev => [...prev, { dayOfWeek: dayIndex, slot: slotCode }]);
                                                                                }
                                                                            }}
                                                                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm border relative ${
                                                                                isSelected 
                                                                                    ? 'bg-[#0061a5] text-white border-[#0061a5] ring-2 ring-[#0061a5]/20' 
                                                                                    : isOccupied
                                                                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-80'
                                                                                    : 'bg-white text-[#43474e] border-[#c4c6cf] hover:border-[#0061a5] hover:text-[#0061a5]'
                                                                            } ${hasLearners ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                                            title={isOccupied ? 'Tutor is already busy at this time for another class' : ''}
                                                                        >
                                                                            {label}
                                                                            {isOccupied && <span className="absolute -top-1 -right-1 flex w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {generatedSessions.length > 0 && startDate && endDate && (
                                        <div className="mt-6 bg-[#f0f7ff] border border-[#d6e4f0] rounded-xl p-4 text-[#002045]">
                                            <p className="font-bold mb-3 flex items-center gap-2">
                                                <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                                                Generated Schedule Timeline
                                            </p>
                                            <div className="grid grid-cols-3 gap-4 text-sm bg-white p-3 rounded-lg border border-[#e0e3e5] shadow-sm">
                                                <div>
                                                    <p className="text-[#74777f] mb-1">Starts on</p>
                                                    <p className="font-bold">{startDate.split('-').reverse().join('/')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#74777f] mb-1">Ends on</p>
                                                    <p className="font-bold">{endDate.split('-').reverse().join('/')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#74777f] mb-1">Total Sessions</p>
                                                    <p className="font-bold text-green-600">{generatedSessions.length} sessions</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                showAlertModal('Error', 'Please fill in all required fields (*)', 'error');
                                return;
                            }
                            setIsSubmitting(true);
                            try {
                                if (isEdit && id) {
                                    await ClassesService.updateClass(id, {
                                        name: className,
                                        tutor_id: tutor || null,
                                        classroom_id: selectedRoom?.id || null,
                                        capacity,
                                        status,
                                        start_date: startDate,
                                        end_date: endDate,
                                        ...(weeklySchedule.length > 0 && generatedSessions.length > 0 ? { sessions: generatedSessions } : {})
                                    });
                                    showAlertModal('Success', 'Class updated successfully!', 'success').then(() => {
                                        navigate('/staff/classes');
                                    });
                                } else {
                                    await ClassesService.createClass({
                                        name: className,
                                        course_id: course,
                                        tutor_id: tutor || null,
                                        classroom_id: selectedRoom?.id || null,
                                        start_date: startDate,
                                        end_date: endDate,
                                        capacity,
                                        sessions: generatedSessions.length > 0 ? generatedSessions : undefined
                                    });
                                    showAlertModal('Success', 'Class created successfully!', 'success').then(() => {
                                        navigate('/staff/classes');
                                    });
                                }
                            } catch (err: unknown) {
                                showAlertModal('Error', (err as Error).message || 'Error saving class', 'error');
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
