import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LayoutDashboard, User, Key, BookOpen, Calendar, DollarSign, MessageSquare, Bell, LogOut, Menu, X, Globe , Wallet, UserCog} from 'lucide-react';

const LearnerLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'staff', title: 'Class Rescheduled', message: 'Your IE1601 class has been moved to Room 402.', time: '10 mins ago', unread: true },
        { id: 2, type: 'admin', title: 'Payment Reminder', message: 'Tuition fee for next month is due in 3 days.', time: '2 hours ago', unread: true },
        { id: 3, type: 'system', title: 'System Update', message: 'ICMS platform will have a scheduled maintenance this Sunday at 2 AM.', time: '1 day ago', unread: false },
        { id: 4, type: 'tutor', title: 'Material Uploaded', message: 'Tutor Dr. Sarah Smith uploaded new materials for IELTS Mastery.', time: '2 days ago', unread: false },
    ]);

    const getTagColor = (type: string) => {
        switch(type) {
            case 'staff': return 'bg-[#fff4ce] text-[#855e00]';
            case 'system': return 'bg-[#d2e4ff] text-[#001d37]';
            case 'tutor': return 'bg-[#c2f0ce] text-[#00210a]';
            case 'learner': return 'bg-[#ffdad6] text-[#410002]';
            case 'admin': return 'bg-[#e0e3e5] text-[#002045]';
            default: return 'bg-[#e0e3e5] text-[#43474e]';
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

        const navItems = [
        { name: 'Dashboard', path: '/learner/dashboard', icon: LayoutDashboard },
        { name: 'My Classes', path: '/learner/classes', icon: BookOpen },
        { name: 'My Schedules', path: '/learner/schedules', icon: Calendar },
        { name: 'Payments', path: '/learner/payments', icon: Wallet },
        { name: 'Support Tickets', path: '/learner/support', icon: MessageSquare },
        { name: 'My Profile', path: '/learner/profile', icon: UserCog },
    ];

    return (
        <div className="min-h-screen bg-[#f7fafc] flex font-sans text-[#181c1e]">
            {/* Sidebar Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-[#e0e3e5] transition-transform transform ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:sticky md:top-0 md:h-screen md:translate-x-0 flex flex-col`}>
                <div className="flex items-center justify-between h-[72px] px-6 border-b border-[#e0e3e5] shrink-0">
                    <Link to="/learner/dashboard" className="text-[24px] font-extrabold text-[#002045] flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-[#0061a5]" />
                        ICMS <span className="text-[#0061a5] font-semibold text-[18px]">Learner</span>
                    </Link>
                    <button className="md:hidden text-[#74777f] hover:text-[#002045]" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                                <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-[#c4c6cf] scrollbar-track-transparent">
                    <ul className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <li key={item.name}>
                                    <Link 
                                        to={item.path} 
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[14px] ${isActive ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f8f9fa] hover:text-[#002045]'}`}
                                    >
                                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#0061a5]' : 'text-[#74777f]'}`} />
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                
                <div className="p-4 border-t border-[#e0e3e5] shrink-0 bg-[#f8f9fa] space-y-1.5">
                    <Link to="/homepage" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#43474e] font-bold hover:bg-[#e0e3e5]/50 transition-colors">
                        <Globe className="w-5 h-5" />
                        <span className="text-[14px]">Back to Homepage</span>
                    </Link>
                    <button onClick={() => {
                        Cookies.remove('access_token', { path: '/' });
                        Cookies.remove('refresh_token', { path: '/' });
                        Cookies.remove('user_info', { path: '/' });
                        window.location.href = '/homepage';
                    }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#ba1a1a] font-bold hover:bg-[#ffdad6]/50 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-[14px]">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 h-[72px] bg-white/80 backdrop-blur-md border-b border-[#e0e3e5] flex items-center justify-between px-6 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 -ml-2 text-[#43474e] hover:bg-[#f1f4f6] rounded-xl transition-colors" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden md:flex flex-col">
                            <span className="text-[18px] font-bold text-[#002045]">Welcome back, John Doe!</span>
                            <span className="text-[13px] text-[#74777f]">Ready to learn something new today?</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <button 
                                className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f1f4f6]'}`}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>}
                            </button>
                            
                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                    <div className="absolute right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden z-50 animate-scale-in origin-top-right">
                                        <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f8f9fa]">
                                            <h3 className="font-bold text-[#002045]">Notifications</h3>
                                            <button onClick={markAllAsRead} className="text-[12px] font-bold text-[#0061a5] hover:underline">Mark all as read</button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                                            {notifications.length > 0 ? notifications.map(notif => (
                                                <div key={notif.id} className={`p-4 border-b border-[#e0e3e5] last:border-b-0 hover:bg-[#f8f9fa] transition-colors cursor-pointer ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase ${getTagColor(notif.type)}`}>
                                                                {notif.type}
                                                            </span>
                                                            <h4 className={`text-[14px] leading-tight text-[#002045] ${notif.unread ? 'font-bold' : 'font-semibold'}`}>{notif.title}</h4>
                                                        </div>
                                                        {notif.unread && <span className="w-2 h-2 rounded-full bg-[#0061a5] shrink-0 mt-1"></span>}
                                                    </div>
                                                    <p className="text-[13px] text-[#43474e] mb-1.5 line-clamp-2">{notif.message}</p>
                                                    <span className="text-[11px] font-semibold text-[#74777f]">{notif.time}</span>
                                                </div>
                                            )) : (
                                                <div className="p-6 text-center text-[#74777f] text-[14px]">No notifications yet.</div>
                                            )}
                                        </div>
                                        <div className="p-3 text-center border-t border-[#e0e3e5] bg-[#f8f9fa]">
                                            <Link to="/learner/notifications" onClick={() => setShowNotifications(false)} className="text-[13px] font-bold text-[#0061a5] hover:underline block w-full">View All Notifications</Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <Link to="/learner/profile" className="flex items-center gap-3 pl-5 border-l border-[#e0e3e5] cursor-pointer group">
                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-[14px] font-bold text-[#002045] leading-tight group-hover:text-[#0061a5] transition-colors">John Doe</span>
                                <span className="text-[12px] text-[#74777f] leading-tight">Learner</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#0061a5] flex items-center justify-center text-white font-bold text-[14px] shadow-sm border-2 border-white group-hover:shadow-md transition-all">
                                JD
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 bg-[#f8f9fa]">
                    <Outlet />
                </main>
            </div>
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default LearnerLayout;
