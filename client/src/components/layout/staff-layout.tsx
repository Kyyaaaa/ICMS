import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Calendar, FileEdit, DollarSign, MessageSquare, UserCog, Banknote, LogOut, Menu, X, Bell, Briefcase } from 'lucide-react';

const StaffLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'role', title: 'New Profile Verification', message: 'Tutor Ms. Emily Chen submitted documents for review.', time: '10 mins ago', unread: true },
        { id: 2, type: 'role', title: 'Consultation Request', message: 'A new learner requested a consultation schedule.', time: '2 hours ago', unread: true },
        { id: 3, type: 'system', title: 'System Update', message: 'ICMS platform will have a scheduled maintenance this Sunday at 2 AM.', time: '1 day ago', unread: false },
        { id: 4, type: 'role', title: 'Invoice Paid', message: 'Payment for Invoice #INV-2026-10-01 has been confirmed.', time: '2 days ago', unread: false },
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

    // Exact match or matches path with a trailing slash to prevent /staff/profile matching /staff/profiles
    const isActivePath = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    // Flat Sidebar Links (pointing to the primary sub-page of each logical group)
    const navItems = [
        { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
        { name: 'Operations', path: '/staff/master-schedule', icon: Calendar, activePaths: ['/staff/classes', '/staff/master-schedule'] },
        { name: 'Requests & Support', path: '/staff/consultations', icon: MessageSquare, activePaths: ['/staff/consultations', '/staff/change-requests', '/staff/support'] },
        { name: 'Finance', path: '/staff/invoices', icon: DollarSign, activePaths: ['/staff/invoices', '/staff/salary'] },
        { name: 'User Management', path: '/staff/accounts', icon: Users, activePaths: ['/staff/accounts', '/staff/profiles'] },
        { name: 'My Profile', path: '/staff/profile', icon: UserCog },
    ];

    // Helper to check if a group is active
    const isGroupActive = (item: any) => {
        if (item.activePaths) return item.activePaths.some((p: string) => isActivePath(p));
        return isActivePath(item.path);
    };

    // Sub-navigation Tabs based on the current active group
    const renderSubTabs = () => {
        const path = location.pathname;
        let tabs = [];

        if (path.startsWith('/staff/classes') || path.startsWith('/staff/master-schedule')) {
            tabs = [
                { name: 'Master Schedule', path: '/staff/master-schedule', icon: Calendar },
                { name: 'Manage Classes', path: '/staff/classes', icon: BookOpen },
            ];
        } else if (path.startsWith('/staff/consultations') || path.startsWith('/staff/change-requests') || path.startsWith('/staff/support')) {
            tabs = [
                { name: 'Consultations', path: '/staff/consultations', icon: Users },
                { name: 'Change Requests', path: '/staff/change-requests', icon: FileEdit },
                { name: 'Support Tickets', path: '/staff/support', icon: MessageSquare },
            ];
        } else if (path.startsWith('/staff/invoices') || path.startsWith('/staff/salary')) {
            tabs = [
                { name: 'Invoices', path: '/staff/invoices', icon: DollarSign },
                { name: 'Salary History', path: '/staff/salary', icon: Banknote },
            ];
        } else if (path.startsWith('/staff/accounts') || path.startsWith('/staff/profiles')) {
            tabs = [
                { name: 'All Accounts', path: '/staff/accounts', icon: UserCog },
                { name: 'Tutor Profiles', path: '/staff/profiles', icon: Briefcase },
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
                <div className="flex items-center justify-between h-[72px] px-6 border-b border-[#e0e3e5] shrink-0">
                    <Link to="/staff/dashboard" className="text-[24px] font-extrabold text-[#002045] flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-[#0061a5]" />
                        ICMS <span className="text-[#0061a5] font-semibold text-[18px]">Staff</span>
                    </Link>
                    <button className="md:hidden text-[#74777f] hover:text-[#002045]" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-[#c4c6cf] scrollbar-track-transparent">
                    <ul className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = isGroupActive(item);
                            return (
                                <li key={item.name}>
                                    <Link 
                                        to={item.path} 
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[14px] ${isActive ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f8f9fa] hover:text-[#002045]'}`}
                                    >
                                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#0061a5]' : 'text-[#74777f]'}`} />
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                
                <div className="p-4 border-t border-[#e0e3e5] shrink-0 bg-[#f8f9fa]">
                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#ba1a1a] font-bold hover:bg-[#ffdad6]/50 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-[14px]">Log Out</span>
                    </Link>
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
                            <span className="text-[18px] font-bold text-[#002045]">Good Morning, Staff!</span>
                            <span className="text-[13px] text-[#74777f]">Have a productive day ahead.</span>
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
                                                            {notif.type === 'system' ? (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e6f0fa] text-[#0061a5] uppercase">System</span>
                                                            ) : (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">Staff</span>
                                                            )}
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
                                            <Link to="/staff/notifications" onClick={() => setShowNotifications(false)} className="text-[13px] font-bold text-[#0061a5] hover:underline block w-full">View All Notifications</Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-3 pl-5 border-l border-[#e0e3e5] cursor-pointer group">
                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-[14px] font-bold text-[#002045] leading-tight group-hover:text-[#0061a5] transition-colors">Admin User</span>
                                <span className="text-[12px] text-[#74777f] leading-tight">System Staff</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#0061a5] flex items-center justify-center text-white font-bold text-[14px] shadow-sm border-2 border-white group-hover:shadow-md transition-all">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {renderSubTabs()}

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8">
                    <div className="max-w-[1600px] mx-auto w-full h-full">
                        <Outlet />
                    </div>
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

export default StaffLayout;
