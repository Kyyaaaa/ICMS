import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Users, MapPin, Calendar, ChevronRight, ChevronDown } from 'lucide-react';

const CreateClass = () => {
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<{id: string, name: string, cap: number} | null>(null);
    const roomDropdownRef = useRef<HTMLDivElement>(null);

    const availableRooms = [
        { id: '101', name: 'Room 101', cap: 20 },
        { id: '102', name: 'Room 102', cap: 30 }
    ];

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
                <span className="font-semibold text-[#002045]">Create New Class</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Create New Class</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* Course Selection */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#002045] border-b pb-2">1. Select Course</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e]">Course Program <span className="text-red-500">*</span></label>
                                <select className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
                                    <option value="">-- Select Course --</option>
                                    <option value="ielts">IELTS Masterclass (Band 7.0+)</option>
                                    <option value="toeic">TOEIC Intensive (750+)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e]">Class Name (Code) <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="e.g. IELTS-A03" className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" />
                            </div>
                        </div>
                    </div>

                    {/* Tutor & Room */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#002045] border-b pb-2">2. Assignments</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1"><Users className="w-4 h-4 text-gray-500"/> Assign Tutor</label>
                                <select className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
                                    <option value="">-- Select Available Tutor --</option>
                                    <option value="sarah">Dr. Sarah Connor (IELTS Expert)</option>
                                    <option value="james">Mr. James Bond (Advanced Comm.)</option>
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
                                        <span>
                                            {selectedRoom.name} (Cap: {selectedRoom.cap}) • <span className="text-[#16a34a] font-medium">Available</span>
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">-- Select Available Room --</span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isRoomDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isRoomDropdownOpen && (
                                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[#c4c6cf] rounded-xl shadow-lg overflow-hidden py-1">
                                        <button 
                                            className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors text-gray-500"
                                            onClick={() => { setSelectedRoom(null); setIsRoomDropdownOpen(false); }}
                                        >
                                            -- Select Available Room --
                                        </button>
                                        {availableRooms.map((room) => (
                                            <button 
                                                key={room.id}
                                                className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors"
                                                onClick={() => { setSelectedRoom(room); setIsRoomDropdownOpen(false); }}
                                            >
                                                {room.name} (Cap: {room.cap}) • <span className="text-[#16a34a] font-medium">Available</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Details */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#002045] border-b pb-2">3. Schedule Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-500"/> Study Days</label>
                                <select className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
                                    <option value="mwf">Mon - Wed - Fri</option>
                                    <option value="tts">Tue - Thu - Sat</option>
                                    <option value="ss">Sat - Sun</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#181c1e]">Time / Shift</label>
                                <select className="w-full px-4 py-3 border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20">
                                    <option value="morning">09:00 - 11:30 (Morning)</option>
                                    <option value="afternoon">14:00 - 16:30 (Afternoon)</option>
                                    <option value="evening">18:00 - 20:30 (Evening)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#f8f9fa] border-t border-[#e0e3e5] flex justify-end gap-3">
                    <Link to="/staff/classes" className="px-6 py-3 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors">
                        Cancel
                    </Link>
                    <button className="px-6 py-3 font-semibold text-white bg-[#0061a5] rounded-xl hover:bg-[#004a80] transition-colors flex items-center gap-2">
                        <Save className="w-5 h-5" /> Save Class
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateClass;
