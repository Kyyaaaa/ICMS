import React from 'react';
import { Megaphone, Plus, Edit, Trash2 } from 'lucide-react';

const AdminAnnouncements = () => {
    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">System Announcements</h1>
                <button className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#004d80] transition-colors">
                    <Plus size={20} />
                    New Announcement
                </button>
            </div>

            <div className="space-y-4">
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-[#e6f0fa] rounded-full flex items-center justify-center text-[#0061a5] shrink-0">
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold text-[#181c1e]">Scheduled Maintenance</h3>
                                <p className="text-[14px] text-[#43474e] mt-2 max-w-3xl">
                                    The ICMS platform will undergo scheduled maintenance this Sunday from 2:00 AM to 4:00 AM EST. Access may be temporarily unavailable.
                                </p>
                                <span className="text-[12px] font-bold text-[#74777f] block mt-4">Posted Oct 25, 2026 • Target: All Users</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-[#43474e] hover:bg-[#f1f4f6] rounded-lg transition-colors"><Edit size={18} /></button>
                            <button className="p-2 text-[#ba1a1a] hover:bg-[#ffebed] rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnnouncements;
