import React from 'react';
import { Users, BookOpen, DollarSign, Activity, FileText, CheckCircle2, CheckCircle, AlertCircle, MonitorPlay, BookMarked, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Admin Dashboard</h1>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
                    <p className="text-[20px] font-extrabold text-[#181c1e]">$124,500</p>
                </div>

                <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#e8def8] flex items-center justify-center text-[#6750a4]">
                            <Users size={20} />
                        </div>
                    </div>
                    <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Learners</h3>
                    <p className="text-[20px] font-extrabold text-[#181c1e]">1,240</p>
                </div>

                <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#fceeee] flex items-center justify-center text-[#ba1a1a]">
                            <BookOpen size={20} />
                        </div>
                    </div>
                    <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Courses</h3>
                    <p className="text-[20px] font-extrabold text-[#181c1e]">45</p>
                </div>

                <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                            <BookMarked size={20} />
                        </div>
                    </div>
                    <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Total Classes</h3>
                    <p className="text-[20px] font-extrabold text-[#181c1e]">128</p>
                </div>

                <div className="bg-white p-5 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#137333]">
                            <MonitorPlay size={20} />
                        </div>
                    </div>
                    <h3 className="text-[#43474e] text-[12px] font-bold uppercase tracking-wider mb-1">Classrooms</h3>
                    <p className="text-[20px] font-extrabold text-[#181c1e]">24</p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Recent Courses Registrations */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-center shrink-0">
                        <h2 className="text-[18px] font-bold text-[#181c1e]">Recent Courses Registrations</h2>
                        <Link to="/admin/accounts" className="text-[#0061a5] text-[14px] font-medium hover:underline">View All</Link>
                    </div>
                    <div className="p-0 overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Learner & Course</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Payment Method</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Progress</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Amount</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <div className="text-[15px] font-bold text-[#002045]">Alex Johnson</div>
                                        <div className="text-[13px] text-[#74777f] mt-0.5">IELTS Intensive Mastery</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#43474e]">
                                            <DollarSign size={16} className="text-[#74777f]" /> Full
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[14px] font-bold text-[#181c1e] w-6">1/1</span>
                                            <div className="w-16 h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                                                <div className="w-full h-full bg-[#137333] rounded-full"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#002045]">
                                            $500.00 <span className="font-normal text-[#74777f]">/ $500.00</span>
                                        </div>
                                        <div className="text-[12px] text-[#74777f] mt-0.5">Last paid: Oct 24, 2026</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f4ea] text-[#137333] rounded-md border border-[#ceead6]">
                                            <CheckCircle size={14} />
                                            <span className="text-[12px] font-bold">Paid</span>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <div className="text-[15px] font-bold text-[#002045]">Sarah Connor</div>
                                        <div className="text-[13px] text-[#74777f] mt-0.5">TOEIC Target 700+</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#43474e]">
                                            <DollarSign size={16} className="text-[#74777f]" /> Installment
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[14px] font-bold text-[#181c1e] w-6">2/3</span>
                                            <div className="w-16 h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                                                <div className="w-[66%] h-full bg-[#0061a5] rounded-full"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#002045]">
                                            $200.00 <span className="font-normal text-[#74777f]">/ $300.00</span>
                                        </div>
                                        <div className="text-[12px] text-[#74777f] mt-0.5">Last paid: Oct 22, 2026</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f0fa] text-[#0061a5] rounded-md border border-[#d2e4ff]">
                                            <Clock size={14} />
                                            <span className="text-[12px] font-bold">Partial</span>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <div className="text-[15px] font-bold text-[#002045]">Michael Smith</div>
                                        <div className="text-[13px] text-[#74777f] mt-0.5">Basic Communication</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#43474e]">
                                            <DollarSign size={16} className="text-[#74777f]" /> Installment
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[14px] font-bold text-[#181c1e] w-6">1/2</span>
                                            <div className="w-16 h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                                                <div className="w-[50%] h-full bg-[#ba1a1a] rounded-full"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#002045]">
                                            $100.00 <span className="font-normal text-[#74777f]">/ $200.00</span>
                                        </div>
                                        <div className="text-[12px] text-[#74777f] mt-0.5">Last paid: Sep 10, 2026</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fceeee] text-[#ba1a1a] rounded-md border border-[#f9dede]">
                                            <AlertCircle size={14} />
                                            <span className="text-[12px] font-bold">Overdue</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Logs */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col mt-2">
                    <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-center shrink-0">
                        <h2 className="text-[18px] font-bold text-[#181c1e]">Audit Logs</h2>
                        <Link to="/admin/audit-logs" className="text-[#0061a5] text-[14px] font-medium hover:underline">View All Logs</Link>
                    </div>
                    <div className="p-0 overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
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
        </div>
    );
};

export default AdminDashboard;
