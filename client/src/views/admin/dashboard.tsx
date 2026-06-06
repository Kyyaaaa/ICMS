
import { Users, BookOpen, DollarSign, CheckCircle, MonitorPlay, BookMarked, Clock } from 'lucide-react';
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
                    <p className="text-[20px] font-extrabold text-[#181c1e]">124,500,000 đ</p>
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
                {/* Recent Transactions */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-center shrink-0">
                        <h2 className="text-[18px] font-bold text-[#181c1e]">Recent Transactions</h2>
                        <Link to="/admin/finance" className="text-[#0061a5] text-[14px] font-medium hover:underline">View All</Link>
                    </div>
                    <div className="p-0 overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Transaction ID</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Transaction Details</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">User</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Date</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Amount</th>
                                    <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <span className="text-[13px] font-bold text-[#0061a5] bg-[#e6f0fa] px-2 py-1 rounded-md">TXN-10293</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="text-[14px] font-bold text-[#002045]">Course Registration</div>
                                            <div className="text-[12px] text-[#74777f]">IELTS Intensive Mastery</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#181c1e]">Alex Johnson</div>
                                        <div className="text-[12px] text-[#74777f]">Learner</div>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#43474e]">24-10-2026</td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] font-bold text-[#137333]">+ 500,000 đ</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f4ea] text-[#137333] rounded-md border border-[#ceead6]">
                                            <CheckCircle size={14} />
                                            <span className="text-[12px] font-bold">Completed</span>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <span className="text-[13px] font-bold text-[#ba1a1a] bg-[#fceeee] px-2 py-1 rounded-md">REF-10294</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="text-[14px] font-bold text-[#002045]">Course Refund</div>
                                            <div className="text-[12px] text-[#74777f]">Basic Communication</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#181c1e]">Michael Smith</div>
                                        <div className="text-[12px] text-[#74777f]">Learner</div>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#43474e]">25-10-2026</td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] font-bold text-[#ba1a1a]">- 100,000 đ</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f4ea] text-[#137333] rounded-md border border-[#ceead6]">
                                            <CheckCircle size={14} />
                                            <span className="text-[12px] font-bold">Completed</span>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <span className="text-[13px] font-bold text-[#0061a5] bg-[#e6f0fa] px-2 py-1 rounded-md">PAY-1004</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="text-[14px] font-bold text-[#002045]">Salary Payment</div>
                                            <div className="text-[12px] text-[#74777f]">October 2026</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#181c1e]">Sarah Jenkins</div>
                                        <div className="text-[12px] text-[#74777f]">Tutor</div>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#43474e]">01-11-2026</td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] font-bold text-[#ba1a1a]">- 12,000,000 đ</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f0fa] text-[#0061a5] rounded-md border border-[#d2e4ff]">
                                            <Clock size={14} />
                                            <span className="text-[12px] font-bold">Processing</span>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <span className="text-[13px] font-bold text-[#0061a5] bg-[#e6f0fa] px-2 py-1 rounded-md">TXN-10296</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="text-[14px] font-bold text-[#002045]">Course Registration</div>
                                            <div className="text-[12px] text-[#74777f]">TOEIC Target 700+</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#181c1e]">Emma Watson</div>
                                        <div className="text-[12px] text-[#74777f]">Learner</div>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#43474e]">02-11-2026</td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] font-bold text-[#137333]">+ 300,000 đ</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f4ea] text-[#137333] rounded-md border border-[#ceead6]">
                                            <CheckCircle size={14} />
                                            <span className="text-[12px] font-bold">Completed</span>
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
                                        <div className="text-[14px] font-bold text-[#181c1e]">30-10-2026</div>
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
                                        <div className="text-[14px] font-bold text-[#181c1e]">30-10-2026</div>
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
                                        <div className="text-[14px] font-bold text-[#181c1e]">30-10-2026</div>
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
