import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, User, Clock, X } from 'lucide-react';

const WEEK_DAYS = [
    { name: 'Monday', date: '26', isToday: false },
    { name: 'Tuesday', date: '27', isToday: false },
    { name: 'Wednesday', date: '28', isToday: true },
    { name: 'Thursday', date: '29', isToday: false },
    { name: 'Friday', date: '30', isToday: false },
    { name: 'Saturday', date: '31', isToday: false },
    { name: 'Sunday', date: '01', isToday: false }
];

const MOCK_SCHEDULE = [
    { id: 1, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', day: 'Monday', startTime: '08:00', endTime: '10:00', color: 'bg-blue-100 border-blue-300' },
    { id: 2, class: 'TOEIC-B12', tutor: 'Mr. John Doe', room: 'Room 202', day: 'Monday', startTime: '14:00', endTime: '16:00', color: 'bg-emerald-100 border-emerald-300' },
    { id: 3, class: 'COM202', tutor: 'Ms. Emily Chen', room: 'Room 205', day: 'Tuesday', startTime: '09:00', endTime: '11:00', color: 'bg-purple-100 border-purple-300' },
    { id: 4, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', day: 'Wednesday', startTime: '08:00', endTime: '10:00', color: 'bg-blue-100 border-blue-300' },
    { id: 5, class: 'TOEIC-B12', tutor: 'Mr. John Doe', room: 'Room 202', day: 'Wednesday', startTime: '14:00', endTime: '16:00', color: 'bg-emerald-100 border-emerald-300' },
    { id: 6, class: 'ENG401', tutor: 'Mr. Alan Wake', room: 'Room 402', day: 'Thursday', startTime: '18:00', endTime: '20:00', color: 'bg-amber-100 border-amber-300' },
    { id: 7, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', day: 'Friday', startTime: '08:00', endTime: '10:00', color: 'bg-blue-100 border-blue-300' },
    { id: 8, class: 'COM202', tutor: 'Ms. Emily Chen', room: 'Room 205', day: 'Saturday', startTime: '09:00', endTime: '11:00', color: 'bg-purple-100 border-purple-300' },
];

const MasterSchedule = () => {
    const [currentWeek] = useState('Oct 26 - Nov 01, 2026');
    const [selectedSession, setSelectedSession] = useState<any>(null);

    return (
        <div className="space-y-6 animate-fade-in-up h-full flex flex-col pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <h1 className="text-[24px] font-bold text-[#002045]">Master Schedule</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-white rounded-lg border border-[#c4c6cf] overflow-hidden shadow-sm">
                        <button className="p-2 hover:bg-[#f8f9fa] transition-colors border-r border-[#c4c6cf]">
                            <ChevronLeft className="w-5 h-5 text-[#43474e]" />
                        </button>
                        <div className="px-4 py-2 font-bold text-[#181c1e] flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-[#74777f]" />
                            {currentWeek}
                        </div>
                        <button className="p-2 hover:bg-[#f8f9fa] transition-colors border-l border-[#c4c6cf]">
                            <ChevronRight className="w-5 h-5 text-[#43474e]" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white flex-1 rounded-2xl shadow-sm border border-[#e0e3e5] flex flex-col overflow-hidden">
                <div className="grid grid-cols-7 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    {WEEK_DAYS.map((day) => (
                        <div key={day.name} className={`p-4 text-center font-bold text-[#43474e] border-r last:border-r-0 border-[#e0e3e5] ${day.isToday ? 'bg-[#e6f0fa] text-[#0061a5]' : ''}`}>
                            <div className="text-[13px] uppercase tracking-wider">{day.name}</div>
                            <div className="text-[20px]">{day.date}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 flex-1 min-h-[600px] overflow-y-auto">
                    {WEEK_DAYS.map(day => (
                        <div key={day.name} className="border-r last:border-r-0 border-[#e0e3e5] p-2 space-y-3 bg-gray-50/30">
                            {MOCK_SCHEDULE.filter(s => s.day === day.name).sort((a, b) => a.startTime.localeCompare(b.startTime)).map(session => (
                                <div 
                                    key={session.id} 
                                    onClick={() => setSelectedSession(session)}
                                    className={`p-3 rounded-xl border ${session.color} shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:-translate-y-0.5 transform duration-200`}
                                >
                                    <div className="text-[12px] font-bold text-[#43474e] mb-1 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {session.startTime} - {session.endTime}
                                    </div>
                                    <h4 className="font-extrabold text-[#002045] text-[14px] leading-tight mb-2">{session.class}</h4>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-[12px] text-[#43474e]">
                                            <User className="w-3.5 h-3.5" />
                                            <span className="truncate">{session.tutor}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[12px] text-[#43474e]">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate font-semibold">{session.room}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Session Modal */}
            {selectedSession && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
                        <div className={`p-6 ${selectedSession.color} border-b flex justify-between items-center`}>
                            <h2 className="text-[20px] font-bold text-[#002045]">Class Schedule: {selectedSession.class}</h2>
                            <button onClick={() => setSelectedSession(null)} className="text-[#002045] hover:bg-black/10 p-1.5 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[#74777f] text-[13px] font-bold mb-1">Tutor</label>
                                <select className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all">
                                    <option>{selectedSession.tutor}</option>
                                    <option>Mr. John Doe</option>
                                    <option>Ms. Emily Chen</option>
                                    <option>Mr. Alan Wake</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#74777f] text-[13px] font-bold mb-1">Date</label>
                                <input type="date" className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all" defaultValue="2026-10-26" />
                            </div>
                            <div>
                                <label className="block text-[#74777f] text-[13px] font-bold mb-1">Available Rooms</label>
                                <select className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all" defaultValue={selectedSession.room}>
                                    <option value="Room 202">Room 202</option>
                                    <option value="Room 205">Room 205</option>
                                    <option value="Room 301">Room 301</option>
                                    <option value="Room 402">Room 402</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#74777f] text-[13px] font-bold mb-1">Available Time Slots</label>
                                <select className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all" defaultValue={`${selectedSession.startTime} - ${selectedSession.endTime}`}>
                                    <option value="08:00 - 10:00">08:00 - 10:00 (Available)</option>
                                    <option value="10:30 - 12:30">10:30 - 12:30 (Available)</option>
                                    <option value="14:00 - 16:00">14:00 - 16:00 (Available)</option>
                                    <option value="18:00 - 20:00" disabled className="text-gray-400">18:00 - 20:00 (Booked)</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-5 bg-gray-50 border-t border-[#e0e3e5] flex justify-end gap-3">
                            <button onClick={() => setSelectedSession(null)} className="px-5 py-2.5 text-[#43474e] font-bold hover:bg-[#e0e3e5] rounded-xl transition-colors">Cancel</button>
                            <button onClick={() => setSelectedSession(null)} className="px-5 py-2.5 bg-[#0061a5] text-white font-bold rounded-xl hover:bg-[#004d80] transition-colors shadow-sm">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterSchedule;