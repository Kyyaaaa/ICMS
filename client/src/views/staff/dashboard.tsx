
import { Users, BookOpen, DollarSign, Activity, FileText, MessageSquare, AlertCircle, Plus, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Dashboard Overview</h1>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Learners', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { title: 'Active Classes', value: '45', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { title: 'Pending Invoices', value: '12', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-100' },
                    { title: 'Open Tickets', value: '8', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e5] flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-[#74777f] text-[13px] font-semibold">{stat.title}</p>
                            <h3 className="text-[24px] font-bold text-[#002045]">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Tasks */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-bold text-[#002045] flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Tasks
                            </h2>
                            <button className="text-[#0061a5] text-[13px] font-bold hover:underline">View All</button>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { title: 'Approve Tutor Profile: Alex Johnson', type: 'Profile Verification', time: '2 hours ago', icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600', link: '/staff/profiles' },
                                { title: 'Assign Consultation: New IELTS Student', type: 'Consultation', time: '5 hours ago', icon: MessageSquare, bg: 'bg-purple-50', color: 'text-purple-600', link: '/staff/consultations' },
                                { title: 'Refund Request: INV-10025', type: 'Payment', time: '1 day ago', icon: DollarSign, bg: 'bg-rose-50', color: 'text-rose-600', link: '/staff/invoices' },
                            ].map((task, i) => (
                                <Link to={task.link} key={i} className="flex items-center justify-between p-4 rounded-xl border border-[#e0e3e5] hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.bg}`}>
                                            <task.icon className={`w-5 h-5 ${task.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#002045] text-[15px] group-hover:text-[#0061a5] transition-colors">{task.title}</h4>
                                            <div className="flex items-center gap-2 text-[12px] text-[#74777f] font-medium mt-1">
                                                <span>{task.type}</span>
                                                <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
                                                <span>{task.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#c4c6cf] group-hover:text-[#0061a5]" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6">
                        <h2 className="text-[18px] font-bold text-[#002045] mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { name: 'Create Class', icon: Plus, link: '/staff/classes/create', color: 'bg-[#e6f0fa] text-[#0061a5] hover:bg-[#cce0f5]' },
                                { name: 'Master Schedule', icon: Calendar, link: '/staff/master-schedule', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                                { name: 'Add Account', icon: Users, link: '/staff/accounts', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                                { name: 'Manage Invoices', icon: DollarSign, link: '/staff/invoices', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                            ].map((action, i) => (
                                <Link to={action.link} key={i} className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors gap-2 text-center ${action.color}`}>
                                    <action.icon className="w-6 h-6" />
                                    <span className="text-[13px] font-bold leading-tight">{action.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Upcoming Classes */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[18px] font-bold text-[#002045] flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#0061a5]" /> Today's Classes
                        </h2>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            { time: '08:00 - 10:00', name: 'IE1601', room: 'Room 301', tutor: 'Dr. Sarah Smith', status: 'In Progress' },
                            { time: '10:30 - 12:30', name: 'COM202', room: 'Room 205', tutor: 'Ms. Emily Chen', status: 'Upcoming' },
                            { time: '14:00 - 16:00', name: 'TOEIC-B12', room: 'Room 202', tutor: 'Mr. John Doe', status: 'Upcoming' },
                            { time: '18:00 - 20:00', name: 'ENG401', room: 'Room 402', tutor: 'Mr. Alan Wake', status: 'Upcoming' },
                        ].map((cls, i) => (
                            <div key={i} className="relative pl-4 border-l-2 border-[#e0e3e5] pb-4 last:pb-0">
                                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${cls.status === 'In Progress' ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]' : 'bg-[#c4c6cf]'}`}></div>
                                <div className="text-[12px] font-bold text-[#0061a5] mb-1">{cls.time}</div>
                                <h4 className="font-extrabold text-[#002045] text-[14px] leading-tight mb-1">{cls.name}</h4>
                                <div className="flex items-center gap-2 text-[12px] text-[#74777f]">
                                    <span>{cls.tutor}</span>
                                    <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
                                    <span className="font-semibold text-[#43474e]">{cls.room}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Link to="/staff/master-schedule" className="mt-6 w-full py-2.5 rounded-lg border border-[#c4c6cf] text-[#43474e] font-bold text-[14px] hover:bg-[#f8f9fa] transition-colors flex items-center justify-center gap-2">
                        View Full Schedule
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;