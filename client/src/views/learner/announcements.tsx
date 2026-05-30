import React from 'react';
import { Bell } from 'lucide-react';

const LearnerAnnouncements = () => {
    return (
        <div className="space-y-[24px] max-w-4xl animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">System Announcements</h1>
            
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="p-[24px] border-b border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors cursor-pointer flex gap-[16px]">
                    <div className="mt-1">
                        <div className="w-10 h-10 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                            <Bell className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-[18px] font-semibold text-[#181c1e]">Holiday Schedule Update</h2>
                        <span className="text-[12px] text-[#74777f] block mt-1 mb-3">Oct 10, 2024 • Admin</span>
                        <p className="text-[14px] text-[#43474e] leading-relaxed">
                            Please note that the center will be closed for the upcoming national holiday on October 15th. All classes scheduled for this day will be automatically shifted to the following week. Your updated schedules are already reflected in the My Schedules tab.
                        </p>
                    </div>
                </div>
                
                <div className="p-[24px] border-b border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors cursor-pointer flex gap-[16px]">
                    <div className="mt-1">
                        <div className="w-10 h-10 rounded-full bg-[#e5e9eb] flex items-center justify-center text-[#43474e]">
                            <Bell className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-[18px] font-semibold text-[#181c1e]">New Mock Test Available</h2>
                        <span className="text-[12px] text-[#74777f] block mt-1 mb-3">Oct 5, 2024 • Academic Dept</span>
                        <p className="text-[14px] text-[#43474e] leading-relaxed">
                            A new set of IELTS Academic Mock Tests has been added to the library resource folder. Students in intensive courses are encouraged to utilize these for weekend practice.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnerAnnouncements;
