import React from 'react';
import { BookOpen, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnerDashboard = () => {
    return (
        <div className="space-y-[24px] animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                <div className="bg-white p-[24px] rounded-[12px] shadow-sm border border-[#e0e3e5] flex items-center gap-[16px]">
                    <div className="w-12 h-12 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[14px] text-[#43474e] font-medium">Active Classes</p>
                        <p className="text-[24px] font-bold text-[#181c1e]">2</p>
                    </div>
                </div>
                <div className="bg-white p-[24px] rounded-[12px] shadow-sm border border-[#e0e3e5] flex items-center gap-[16px]">
                    <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[14px] text-[#43474e] font-medium">Unpaid Invoices</p>
                        <p className="text-[24px] font-bold text-[#ba1a1a]">1</p>
                    </div>
                </div>
                <div className="bg-white p-[24px] rounded-[12px] shadow-sm border border-[#e0e3e5] flex items-center gap-[16px]">
                    <div className="w-12 h-12 rounded-full bg-[#e5e9eb] flex items-center justify-center text-[#43474e]">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[14px] text-[#43474e] font-medium">Upcoming Sessions</p>
                        <p className="text-[24px] font-bold text-[#181c1e]">4 this week</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                {/* Upcoming Schedule */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                    <div className="flex justify-between items-center mb-[16px]">
                        <h2 className="text-[18px] font-semibold text-[#181c1e]">Next Classes</h2>
                        <Link to="/learner/schedules" className="text-[#0061a5] text-[14px] font-medium hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-[16px]">
                        <div className="flex gap-[16px] p-[12px] border border-[#e0e3e5] rounded-[8px] hover:bg-[#f7fafc] transition-colors">
                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#d2e4ff] text-[#0061a5] rounded-[8px]">
                                <span className="text-[12px] font-semibold uppercase">Oct</span>
                                <span className="text-[20px] font-bold">12</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-[#181c1e]">IELTS Academic - Reading</h3>
                                <p className="text-[14px] text-[#43474e] mt-1">18:00 - 20:00 • Room 302</p>
                                <p className="text-[12px] text-[#74777f] mt-1">Tutor: Sarah Jenkins</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Announcements */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                    <div className="flex justify-between items-center mb-[16px]">
                        <h2 className="text-[18px] font-semibold text-[#181c1e]">Recent Announcements</h2>
                        <Link to="/learner/announcements" className="text-[#0061a5] text-[14px] font-medium hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-[16px]">
                        <div className="border-b border-[#e0e3e5] pb-[12px] last:border-0 last:pb-0">
                            <h3 className="font-semibold text-[#181c1e] hover:text-[#0061a5] cursor-pointer transition-colors">Holiday Schedule Update</h3>
                            <p className="text-[14px] text-[#43474e] mt-1 line-clamp-2">Please note that the center will be closed for the upcoming national holiday on October 15th...</p>
                            <span className="text-[12px] text-[#74777f] mt-2 block">2 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnerDashboard;
