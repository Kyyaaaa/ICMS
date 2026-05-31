import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Users, Calendar, MapPin, Edit, BookOpen, CheckCircle, Clock, Save, X, ChevronDown } from 'lucide-react';

const StaffClassDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('schedule');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [isEditRoomDropdownOpen, setIsEditRoomDropdownOpen] = useState(false);
    const [selectedEditRoom, setSelectedEditRoom] = useState<{id: string, name: string, cap: number} | null>(null);
    const editRoomDropdownRef = useRef<HTMLDivElement>(null);

    const availableEditRooms = [
        { id: '102', name: 'Room 102', cap: 30, current: true },
        { id: '105', name: 'Room 105', cap: 30 },
        { id: '201', name: 'Room 201', cap: 25 },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editRoomDropdownRef.current && !editRoomDropdownRef.current.contains(event.target as Node)) {
                setIsEditRoomDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scheduleData = [
        { session: 1, date: 'Oct 01, 2026', time: '18:00 - 20:00', topic: 'Introduction to IELTS Speaking Part 1', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Completed' },
        { session: 2, date: 'Oct 03, 2026', time: '18:00 - 20:00', topic: 'Listening: Form Completion', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Completed' },
        { session: 3, date: 'Oct 05, 2026', time: '18:00 - 20:00', topic: 'Reading: True/False/Not Given', tutor: 'Mr. James Bond', room: 'Room 102', status: 'Upcoming' },
        { session: 4, date: 'Oct 08, 2026', time: '18:00 - 20:00', topic: 'Writing Task 1: Bar Charts', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Upcoming' },
        { session: 5, date: 'Oct 10, 2026', time: '18:00 - 20:00', topic: 'Speaking Part 2 Practice', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Upcoming' },
    ];

    const courseName = id === '101' || id === '102' ? 'IELTS Masterclass' : id === '201' ? 'TOEIC Intensive' : 'Course Name';
    const classNameStr = id === '101' ? 'IELTS-A01' : id === '102' ? 'IELTS-A02' : id === '201' ? 'TOEIC-B01' : `Class-${id}`;

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
                    <Link to="/staff/classes/create" className="px-4 py-2 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
                        <Edit className="w-4 h-4" /> Edit Info
                    </Link>
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
                    Enrolled Students (15/20)
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                {activeTab === 'schedule' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-[#43474e] text-sm">
                                <tr>
                                    <th className="p-4 font-semibold w-24">Session</th>
                                    <th className="p-4 font-semibold w-40">Date & Time</th>
                                    <th className="p-4 font-semibold w-32">Room</th>
                                    <th className="p-4 font-semibold w-48">Tutor</th>
                                    <th className="p-4 font-semibold">Lesson Topic</th>
                                    <th className="p-4 font-semibold w-32">Status</th>
                                    <th className="p-4 font-semibold w-24 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {scheduleData.map((item, index) => (
                                    <tr key={index} className="border-b border-[#e0e3e5] hover:bg-[#f0f7ff]/50 transition-colors">
                                        <td className="p-4 font-bold text-[#002045] text-center">{item.session}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-[#002045]">{item.date}</div>
                                            <div className="text-xs text-[#74777f] flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> {item.time}
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#43474e] font-medium">{item.room}</td>
                                        <td className="p-4 text-[#43474e] flex items-center gap-2">
                                            <div className="w-7 h-7 bg-blue-100 text-[#0061a5] rounded-full flex items-center justify-center text-xs font-bold">
                                                {item.tutor.charAt(4)}
                                            </div>
                                            {item.tutor}
                                        </td>
                                        <td className="p-4 font-semibold text-[#002045]">{item.topic}</td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold w-fit ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {item.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {item.status === 'Upcoming' && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedSession(item);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 bg-blue-50 text-[#0061a5] rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger" 
                                                    title="Change Tutor or Room"
                                                >
                                                    <Edit className="w-4 h-4"/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-[#43474e] text-sm">
                                <tr>
                                    <th className="p-4 font-semibold">Student Name</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Joined Date</th>
                                    <th className="p-4 font-semibold">Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b border-[#e0e3e5] hover:bg-[#f0f7ff]/50 transition-colors">
                                        <td className="p-4 font-bold text-[#002045]">Student Name {i}</td>
                                        <td className="p-4 text-[#43474e]">student{i}@gmail.com</td>
                                        <td className="p-4 text-[#74777f]">Oct 01, 2026</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-green-600">90%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Session Modal */}
            {isEditModalOpen && selectedSession && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002045]/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                            <h3 className="text-[18px] font-bold text-[#002045]">
                                Edit Session #{selectedSession.session}
                            </h3>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-sm font-bold text-[#74777f] mb-1">Topic</p>
                                <p className="font-semibold text-[#002045]">{selectedSession.topic}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                                    <Users className="w-4 h-4 text-gray-500"/> Assign Substitute Tutor
                                </label>
                                <select 
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium"
                                    defaultValue={selectedSession.tutor}
                                >
                                    <option value="Dr. Sarah Connor">Dr. Sarah Connor (Current)</option>
                                    <option value="Mr. James Bond">Mr. James Bond (Available)</option>
                                    <option value="Ms. Emily Blunt">Ms. Emily Blunt (Available)</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2 relative" ref={editRoomDropdownRef}>
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-gray-500"/> Change Room
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditRoomDropdownOpen(!isEditRoomDropdownOpen)}
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 flex justify-between items-center text-left"
                                >
                                    {selectedEditRoom ? (
                                        <span>
                                            {selectedEditRoom.name} (Cap: {selectedEditRoom.cap}) {selectedEditRoom.current && '(Current)'} • <span className="text-[#16a34a] font-medium">Available</span>
                                        </span>
                                    ) : (
                                        <span>
                                            Room 102 (Current) • <span className="text-[#16a34a] font-medium">Available</span>
                                        </span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isEditRoomDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isEditRoomDropdownOpen && (
                                    <div className="absolute z-10 bottom-full left-0 right-0 mb-1 bg-white border border-[#c4c6cf] rounded-xl shadow-lg overflow-hidden py-1">
                                        {availableEditRooms.map((room) => (
                                            <button 
                                                key={room.id}
                                                className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors"
                                                onClick={() => { setSelectedEditRoom(room); setIsEditRoomDropdownOpen(false); }}
                                            >
                                                {room.name} (Cap: {room.cap}) {room.current && '(Current)'} • <span className="text-[#16a34a] font-medium">Available</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 border-t border-[#e0e3e5] bg-[#f8f9fa] flex justify-end gap-3">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-5 py-2.5 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-5 py-2.5 font-semibold text-white bg-[#0061a5] rounded-xl hover:bg-[#004a80] transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default StaffClassDetail;