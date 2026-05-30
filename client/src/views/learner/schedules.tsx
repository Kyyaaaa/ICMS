import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const LearnerSchedules = () => {
    // Mock data for weekly schedule
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
        <div className="space-y-[24px] animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Schedules</h1>
                
                <div className="flex items-center gap-[16px] bg-white rounded-full border border-[#e0e3e5] p-[4px]">
                    <button className="p-[8px] text-[#43474e] hover:bg-[#f1f4f6] rounded-full transition-colors"><ChevronLeft className="w-5 h-5"/></button>
                    <span className="text-[14px] font-bold text-[#181c1e] px-[16px]">October 2024</span>
                    <button className="p-[8px] text-[#43474e] hover:bg-[#f1f4f6] rounded-full transition-colors"><ChevronRight className="w-5 h-5"/></button>
                </div>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header */}
                    <div className="grid grid-cols-7 border-b border-[#e0e3e5] bg-[#f7fafc]">
                        {days.map((day, i) => (
                            <div key={day} className="py-[12px] text-center border-r border-[#e0e3e5] last:border-0">
                                <span className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider">{day}</span>
                                <span className="block text-[20px] font-bold text-[#181c1e] mt-1">{i + 14}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7 min-h-[400px]">
                        {days.map((day, i) => (
                            <div key={day} className="p-[8px] border-r border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc] transition-colors relative">
                                {i === 1 && (
                                    <div className="bg-[#d2e4ff] border border-[#0061a5] rounded-[8px] p-[8px] mb-[8px] cursor-pointer hover:shadow-md transition-shadow">
                                        <p className="text-[12px] font-bold text-[#0061a5] leading-tight">Reading</p>
                                        <p className="text-[10px] text-[#002045] mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> 18:00 - 20:00</p>
                                        <p className="text-[10px] text-[#002045] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Room 302</p>
                                    </div>
                                )}
                                {i === 3 && (
                                    <div className="bg-[#d2e4ff] border border-[#0061a5] rounded-[8px] p-[8px] mb-[8px] cursor-pointer hover:shadow-md transition-shadow">
                                        <p className="text-[12px] font-bold text-[#0061a5] leading-tight">Reading</p>
                                        <p className="text-[10px] text-[#002045] mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> 18:00 - 20:00</p>
                                        <p className="text-[10px] text-[#002045] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Room 302</p>
                                    </div>
                                )}
                                {i === 0 && (
                                    <div className="bg-[#ffebed] border border-[#ba1a1a] rounded-[8px] p-[8px] mb-[8px] cursor-pointer hover:shadow-md transition-shadow">
                                        <p className="text-[12px] font-bold text-[#ba1a1a] leading-tight">Writing</p>
                                        <p className="text-[10px] text-[#ba1a1a] mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> 19:00 - 21:00</p>
                                        <p className="text-[10px] text-[#ba1a1a] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Room 305</p>
                                    </div>
                                )}
                                {i === 2 && (
                                    <div className="bg-[#ffebed] border border-[#ba1a1a] rounded-[8px] p-[8px] mb-[8px] cursor-pointer hover:shadow-md transition-shadow">
                                        <p className="text-[12px] font-bold text-[#ba1a1a] leading-tight">Writing</p>
                                        <p className="text-[10px] text-[#ba1a1a] mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> 19:00 - 21:00</p>
                                        <p className="text-[10px] text-[#ba1a1a] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Room 305</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-[16px] text-[14px]">
                <div className="flex items-center gap-[8px]">
                    <span className="w-3 h-3 rounded-full bg-[#0061a5]"></span>
                    <span className="text-[#43474e]">Reading Classes</span>
                </div>
                <div className="flex items-center gap-[8px]">
                    <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
                    <span className="text-[#43474e]">Writing Classes</span>
                </div>
            </div>
        </div>
    );
};

export default LearnerSchedules;
