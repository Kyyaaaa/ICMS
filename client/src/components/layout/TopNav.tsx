import React, { useState } from 'react';
import { Search, BookOpen, ChevronDown, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopNavProps {
    isLoggedIn?: boolean;
    setIsLoggedIn?: (val: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ isLoggedIn = false, setIsLoggedIn }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const [allNotifs, setAllNotifs] = useState([
        { id: 1, title: 'System Maintenance', desc: 'Scheduled maintenance on Sunday 2AM.', time: '2 hours ago', read: false, type: 'system' },
        { id: 2, title: 'New Course Added', desc: 'Check out our new IELTS Speaking Masterclass.', time: '1 day ago', read: true, type: 'system' },
        { id: 3, title: 'Class Reminder', desc: 'Your Intensive Reading class starts in 1 hour.', time: 'Just now', read: false, type: 'role' },
        { id: 4, title: 'Assignment Graded', desc: 'Your Writing Task 2 has been graded. Score: 7.5', time: '5 hours ago', read: false, type: 'role' },
    ]);

    const notifications = isLoggedIn ? allNotifs : allNotifs.filter(n => n.type === 'system');
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setAllNotifs(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <header className="bg-white/80 backdrop-blur-md text-[#002045] sticky top-0 shadow-sm border-b border-[#c4c6cf] flex justify-between items-center w-full px-4 lg:px-[32px] max-w-full mx-auto h-[80px] z-50 transition-all">
            <div className="max-w-[1440px] mx-auto w-full flex justify-between items-center">
                <div className="flex items-center gap-[64px]">
                    <Link to="/homepage" className="text-[28px] leading-[32px] font-extrabold text-[#002045] tracking-tight flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-[#0061a5]" />
                        ICMS
                    </Link>
                    <nav className="hidden md:flex gap-[40px]">
                        <Link className="text-[16px] font-semibold text-[#43474e] hover:text-[#0061a5] transition-colors duration-200" to="/homepage">Home</Link>
                        <Link className="text-[16px] font-semibold text-[#43474e] hover:text-[#0061a5] transition-colors duration-200" to="/courses">Courses</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-[16px] lg:gap-[24px]">
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                        <input className="pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded-full text-[14px] leading-[20px] focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 w-64 transition-all" placeholder="Search courses..." type="text" />
                    </div>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button 
                            className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] relative transition-colors"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden flex flex-col z-[100] animate-fade-in">
                                <div className="px-4 py-3 border-b border-[#e0e3e5] bg-[#f7fafc] flex justify-between items-center">
                                    <h4 className="font-bold text-[#002045]">Notifications</h4>
                                    <span className="text-[12px] text-[#0061a5] font-semibold cursor-pointer hover:underline" onClick={markAllAsRead}>Mark all as read</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notif => (
                                        <div key={notif.id} className={`px-4 py-3 border-b border-[#f1f4f6] hover:bg-[#f8f9fa] cursor-pointer transition-colors ${!notif.read ? 'bg-[#f0f7ff]' : ''}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h5 className={`text-[14px] ${!notif.read ? 'font-bold text-[#002045]' : 'font-semibold text-[#43474e]'}`}>{notif.title}</h5>
                                                {!notif.read && <span className="w-2 h-2 bg-[#0061a5] rounded-full mt-1.5 shrink-0"></span>}
                                            </div>
                                            <p className="text-[13px] text-[#74777f] line-clamp-2 leading-tight mb-1">{notif.desc}</p>
                                            <span className="text-[11px] text-[#a1a4ad]">{notif.time}</span>
                                        </div>
                                    )) : (
                                        <div className="p-6 text-center text-[#74777f] text-[14px]">No notifications yet.</div>
                                    )}
                                </div>
                                <div className="p-2 bg-[#f7fafc] border-t border-[#e0e3e5] text-center">
                                    <Link to={isLoggedIn ? "/learner/notifications" : "/notifications"} onClick={() => setShowNotifications(false)} className="text-[13px] text-[#0061a5] font-bold cursor-pointer hover:underline block w-full">View all</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-[16px] pl-[16px] lg:pl-[24px] border-l border-[#c4c6cf] items-center">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-[12px] cursor-pointer hover:bg-[#f1f4f6] py-1.5 px-3 rounded-full transition-colors" onClick={() => setIsLoggedIn && setIsLoggedIn(false)} title="Click to logout">
                                <div className="w-[40px] h-[40px] bg-[#0061a5] rounded-full flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
                                    HV
                                </div>
                                <div className="hidden md:flex flex-col text-left">
                                    <span className="text-[14px] font-bold text-[#002045] leading-tight">Học viên</span>
                                    <span className="text-[12px] text-[#43474e] leading-tight">My Dashboard</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[#74777f] ml-1 hidden md:block" />
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-2.5 bg-transparent text-[#002045] rounded-full text-[15px] font-bold hover:bg-[#f1f4f6] transition-colors">Log In</Link>
                                <Link to="/register" className="hidden md:inline-flex px-6 py-2.5 bg-[#0061a5] text-white rounded-full text-[15px] font-bold hover:bg-[#002045] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
