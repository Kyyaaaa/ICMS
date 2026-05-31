import React from 'react';
import { Users, Search, Plus, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminAccounts = () => {
    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Manage Accounts</h1>
                <button className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#004d80] transition-colors">
                    <Plus size={20} />
                    Create Account
                </button>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input className="pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" placeholder="Search users by name, email or ID..." type="text" />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#c4c6cf] rounded-xl text-[#43474e] font-bold hover:bg-[#f1f4f6] transition-colors">
                    <Filter size={20} />
                    Filter
                </button>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">User Info</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Role</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Status</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Joined Date</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold">JD</div>
                                        <div>
                                            <p className="font-bold text-[#181c1e]">John Doe</p>
                                            <p className="text-[12px] text-[#74777f]">john.doe@example.com</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="px-2 py-1 bg-[#e8def8] text-[#6750a4] text-[12px] font-bold rounded uppercase">Tutor</span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="px-2 py-1 bg-[#e6f4ea] text-[#137333] text-[12px] font-bold rounded uppercase">Active</span>
                                </td>
                                <td className="py-4 px-6 text-[14px] text-[#43474e]">Oct 12, 2024</td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link to="/admin/accounts/1" className="p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors"><Eye size={18} /></Link>
                                        <button className="p-2 text-[#ba1a1a] hover:bg-[#ffebed] rounded-lg transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAccounts;
