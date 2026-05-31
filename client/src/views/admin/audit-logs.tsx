import React from 'react';
import { FileKey, Search } from 'lucide-react';

const AdminAuditLogs = () => {
    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Audit Logs</h1>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[#e0e3e5]">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                        <input className="pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" placeholder="Search logs by action or user..." type="text" />
                    </div>
                </div>
                <div className="p-0 overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Date</th>
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Time</th>
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Admin Account</th>
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Action Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <div className="text-[14px] font-bold text-[#181c1e]">Oct 30, 2026</div>
                                </td>
                                <td className="py-4 px-6 text-[14px] font-medium text-[#74777f]">
                                    14:23:01
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#0061a5] text-white flex items-center justify-center font-bold text-[12px]">DV</div>
                                        <div>
                                            <div className="text-[14px] font-bold text-[#002045]">Do Hong Vy</div>
                                            <div className="text-[12px] text-[#74777f]">Super Admin</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-[14px] text-[#43474e]">Approved refund <span className="font-semibold text-[#181c1e]">REF-1002</span> for Learner: Alex Johnson</span>
                                </td>
                            </tr>
                            <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <div className="text-[14px] font-bold text-[#181c1e]">Oct 30, 2026</div>
                                </td>
                                <td className="py-4 px-6 text-[14px] font-medium text-[#74777f]">
                                    12:15:42
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#43474e] text-white flex items-center justify-center font-bold text-[12px]">SYS</div>
                                        <div>
                                            <div className="text-[14px] font-bold text-[#181c1e]">System Engine</div>
                                            <div className="text-[12px] text-[#74777f]">Automated Task</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-[14px] text-[#43474e]">Daily automated database backup to cloud storage completed</span>
                                </td>
                            </tr>
                            <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <div className="text-[14px] font-bold text-[#181c1e]">Oct 30, 2026</div>
                                </td>
                                <td className="py-4 px-6 text-[14px] font-medium text-[#74777f]">
                                    09:05:11
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#fceeee] text-[#ba1a1a] flex items-center justify-center font-bold text-[12px]">NA</div>
                                        <div>
                                            <div className="text-[14px] font-bold text-[#002045]">Nguyen Van A</div>
                                            <div className="text-[12px] text-[#74777f]">Academic Admin</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-[14px] text-[#43474e]">Created new course <span className="font-semibold text-[#181c1e]">IELTS Intensive Mastery</span> (IEL-INT-01)</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;
