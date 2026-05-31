import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
    LayoutDashboard, 
    BookOpen, 
    Tags, 
    MonitorPlay, 
    Users, 
    RefreshCcw, 
    Wallet, 
    Megaphone, 
    FileKey,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';

export const AdminLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const navGroups = [
        {
            title: 'OVERVIEW',
            items: [
                { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
            ]
        },
        {
            title: 'ACADEMICS',
            items: [
                { icon: <BookOpen size={20} />, label: 'Manage Courses', path: '/admin/courses' },
                { icon: <MonitorPlay size={20} />, label: 'Manage Classrooms', path: '/admin/classrooms' },
            ]
        },
        {
            title: 'FINANCE',
            items: [
                { icon: <Tags size={20} />, label: 'Discount Codes', path: '/admin/discount-codes' },
                { icon: <RefreshCcw size={20} />, label: 'Manage Refunds', path: '/admin/refunds' },
                { icon: <Wallet size={20} />, label: 'Manage Payroll', path: '/admin/payroll' },
            ]
        },
        {
            title: 'USER MANAGEMENT',
            items: [
                { icon: <Users size={20} />, label: 'Manage Accounts', path: '/admin/accounts' },
            ]
        },
        {
            title: 'SYSTEM',
            items: [
                { icon: <Megaphone size={20} />, label: 'Announcements', path: '/admin/announcements' },
                { icon: <FileKey size={20} />, label: 'Audit Logs', path: '/admin/audit-logs' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#f7fafc] flex font-sans text-[#181c1e]">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-[#e0e3e5] transition-transform transform ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:sticky md:top-0 md:h-screen md:translate-x-0 flex flex-col`}>
                <div className="flex items-center justify-between h-[72px] px-6 border-b border-[#e0e3e5] shrink-0">
                    <Link to="/admin/dashboard" className="text-[24px] font-extrabold text-[#002045] flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-[#0061a5]" />
                        ICMS <span className="text-[#0061a5] font-semibold text-[18px]">Admin</span>
                    </Link>
                    <button className="md:hidden text-[#74777f] hover:text-[#002045]" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 scrollbar-thin">
                    {navGroups.map((group, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-3 px-6">
                                {group.title}
                            </h3>
                            <nav className="space-y-1.5 px-4">
                                {group.items.map((item, itemIndex) => {
                                    const isActive = location.pathname.startsWith(item.path);
                                    return (
                                        <NavLink
                                            key={itemIndex}
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-[#e6f0fa] text-[#0061a5] font-bold text-[14px]'
                                                    : 'text-[#43474e] font-bold text-[14px] hover:bg-[#f8f9fa] hover:text-[#002045]'
                                            }`}
                                        >
                                            <div className={`${isActive ? 'text-[#0061a5]' : 'text-[#74777f]'}`}>
                                                {item.icon}
                                            </div>
                                            <span className="truncate">{item.label}</span>
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>
                
                {/* Logout Button */}
                <div className="p-4 border-t border-[#e0e3e5] shrink-0 bg-[#f8f9fa]">
                    <NavLink
                        to="/auth/login"
                        className="flex items-center gap-3 px-4 py-3 text-[#ba1a1a] font-bold hover:bg-[#ffdad6]/50 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-[14px]">Log Out</span>
                    </NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 h-[72px] bg-white/80 backdrop-blur-md border-b border-[#e0e3e5] flex items-center justify-between px-6 shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 -ml-2 text-[#43474e] hover:bg-[#f1f4f6] rounded-xl transition-colors" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden md:flex flex-col">
                            <span className="text-[18px] font-bold text-[#002045]">Welcome back, Admin!</span>
                            <span className="text-[13px] text-[#74777f]">System is running smoothly today.</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <button 
                                className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f1f4f6]'}`}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#0061a5] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer hover:bg-[#004d80] transition-colors">
                            AD
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-8 bg-[#f8f9fa]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
