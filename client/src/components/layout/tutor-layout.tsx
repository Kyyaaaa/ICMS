import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCog, Calendar, FileEdit, Banknote, LogOut, Menu, X, Bell, Globe, FileBadge, CalendarClock, ClipboardCheck } from 'lucide-react';

const TutorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'role', title: 'Schedule Updated', message: 'Your teaching schedule for next week has been confirmed.', time: '10 mins ago', unread: true },
        { id: 2, type: 'system', title: 'System Update', message: 'ICMS platform will have a scheduled maintenance this Sunday at 2 AM.', time: '1 day ago', unread: false },
        { id: 3, type: 'role', title: 'Salary Disbursed', message: 'Your salary for last month has been transferred.', time: '3 days ago', unread: false },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    const isActivePath = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    // Flat Sidebar Links
    const navItems = [
        { name: 'Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
        { name: 'My Profile & Info', path: '/tutor/profile', icon: UserCog, activePaths: ['/tutor/profile', '/tutor/qualifications'] },
        { name: 'Teaching & Schedule', path: '/tutor/schedule', icon: Calendar, activePaths: ['/tutor/schedule', '/tutor/availability'] },
        { name: 'Class Management', path: '/tutor/attendance', icon: ClipboardCheck },
        { name: 'Requests', path: '/tutor/change-requests', icon: FileEdit },
        { name: 'Finance', path: '/tutor/salary', icon: Banknote },
    ];

    const isGroupActive = (item: any) => {
        if (item.activePaths) return item.activePaths.some((p: string) => isActivePath(p));
        return isActivePath(item.path);
    };

    // Sub-navigation Tabs based on the current active group
    const renderSubTabs = () => {
        const path = location.pathname;
        let tabs: any[] = [];

        if (path.startsWith('/tutor/profile') || path.startsWith('/tutor/qualifications')) {
            tabs = [
                { name: 'My Profile', path: '/tutor/profile', icon: UserCog },
                { name: 'My Qualifications', path: '/tutor/qualifications', icon: FileBadge },
            ];
        } else if (path.startsWith('/tutor/schedule') || path.startsWith('/tutor/availability')) {
            tabs = [
                { name: 'Teaching Schedule', path: '/tutor/schedule', icon: Calendar },
                { name: 'Availability Registration', path: '/tutor/availability', icon: CalendarClock },
            ];
        }

        if (tabs.length === 0) return null;

        return (
            <div className="bg-white border-b border-[#e0e3e5] px-6 flex items-center gap-6 overflow-x-auto scrollbar-none sticky top-[72px] z-30">
                {tabs.map(tab => {
                    const active = isActivePath(tab.path);
                    return (
                        <Link 
                            key={tab.name}
                            to={tab.path}
                            className={`flex items-center gap-2 py-3.5 border-b-2 font-bold text-[14px] whitespace-nowrap transition-colors ${active ? 'border-[#0061a5] text-[#0061a5]' : 'border-transparent text-[#74777f] hover:text-[#002045]'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </Link>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f7fafc] flex font-sans text-[#181c1e]">
            {/* Sidebar Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-[#e0e3e5] transition-transform transform ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:sticky md:top-0 md:h-screen md:translate-x-0 flex flex-col`}>
                <div className="h-[72px] flex items-center px-6 border-b border-[#e0e3e5] shrink-0 justify-between">
                    <Link to="/tutor/dashboard" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#002045] flex items-center justify-center">
                            <Globe className="text-white w-5 h-5" />
                        </div>
                        <span className="text-[20px] font-bold text-[#002045] tracking-tight">ICMS</span>
                    </Link>
                    <button className="md:hidden text-[#43474e]" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 scrollbar-none">
                    <div className="text-[11px] font-bold tracking-[0.08em] text-[#74777f] uppercase px-3 py-2 mb-1">Tutor Portal</div>
                    {navItems.map((item) => {
                        const active = isGroupActive(item);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                                    active 
                                    ? 'bg-[#002045] text-white shadow-md' 
                                    : 'text-[#43474e] hover:bg-[#f0f4f8] hover:text-[#002045]'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#74777f]'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-[#e0e3e5] shrink-0 space-y-2">
                    <Link 
                        to="/homepage" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-[#0061a5] hover:bg-[#e3f2fd] transition-colors"
                    >
                        <Globe className="w-5 h-5" />
                        Back to Homepage
                    </Link>
                    <Link 
                        to="/login" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-[#ba1a1a] hover:bg-[#ba1a1a]/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-[72px] bg-white border-b border-[#e0e3e5] flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            className="md:hidden p-2 -ml-2 text-[#43474e] hover:bg-[#f0f4f8] rounded-lg transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-[#f0f4f8] text-[#002045]' : 'text-[#43474e] hover:bg-[#f0f4f8]'}`}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                                    <div className="absolute right-0 mt-2 w-[320px] md:w-[380px] bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#e0e3e5] z-50 overflow-hidden animate-fade-in-down origin-top-right">
                                        <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                                            <h3 className="font-bold text-[#181c1e]">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllAsRead} className="text-[12px] font-semibold text-[#0061a5] hover:text-[#002045]">
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                                            {notifications.map(notification => (
                                                <div key={notification.id} className={`p-4 border-b border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors cursor-pointer ${notification.unread ? 'bg-white' : 'bg-[#f7fafc]/50 opacity-70'}`}>
                                                    <div className="flex gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notification.unread ? 'bg-[#0061a5]' : 'bg-transparent'}`}></div>
                                                        <div>
                                                            <h4 className={`text-[14px] ${notification.unread ? 'font-bold text-[#181c1e]' : 'font-medium text-[#43474e]'}`}>
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-[13px] text-[#43474e] mt-1 leading-relaxed">{notification.message}</p>
                                                            <span className="text-[11px] font-medium text-[#74777f] mt-2 block">{notification.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 text-center border-t border-[#e0e3e5] bg-white">
                                            <button className="text-[13px] font-semibold text-[#0061a5] hover:text-[#002045]">View All Notifications</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-[#e0e3e5]">
                            <div className="hidden md:block text-right">
                                <div className="text-[14px] font-bold text-[#181c1e]">Jane Doe</div>
                                <div className="text-[12px] font-medium text-[#74777f]">Tutor</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[#0061a5] text-white flex items-center justify-center font-bold text-[14px] shadow-sm">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sub Navigation (Sticky below header) */}
                {renderSubTabs()}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto scrollbar-none bg-[#f7fafc] relative">
                    <Outlet />
                </main>
            </div>
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-[#002045]/20 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default TutorLayout;
