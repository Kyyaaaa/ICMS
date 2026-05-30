import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Key, BookOpen, Calendar, DollarSign, MessageSquare, Bell, LogOut, Menu, X } from 'lucide-react';

const LearnerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/learner/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', path: '/learner/profile', icon: User },
        { name: 'Change Password', path: '/learner/change-password', icon: Key },
        { name: 'My Classes', path: '/learner/classes', icon: BookOpen },
        { name: 'My Schedules', path: '/learner/schedules', icon: Calendar },
        { name: 'Payments', path: '/learner/payments', icon: DollarSign },
        { name: 'Support Tickets', path: '/learner/support', icon: MessageSquare },
        { name: 'Announcements', path: '/learner/announcements', icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-[#f7fafc] flex font-sans text-[#181c1e]">
            {/* Sidebar Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#002045] text-white transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="flex items-center justify-between h-16 px-[24px] border-b border-white/10">
                    <span className="text-[20px] font-bold tracking-wider">ICMS Learner</span>
                    <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-[16px]">
                    <ul className="space-y-[4px] px-[12px]">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <li key={item.name}>
                                    <Link 
                                        to={item.path} 
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] transition-colors ${isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-[14px]">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="p-[16px] border-t border-white/10">
                    <Link to="/login" className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] text-[#ffdad6] hover:bg-white/10 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-[14px]">Log Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-[16px] md:px-[32px] sticky top-0 z-40">
                    <button className="md:hidden text-[#43474e]" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="hidden md:block text-[16px] font-semibold text-[#181c1e]">
                        Welcome back, John Doe!
                    </div>
                    <div className="flex items-center gap-[16px]">
                        <button className="relative text-[#43474e] hover:text-[#0061a5] transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5] font-bold text-[14px]">
                            JD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-[16px] md:p-[32px] overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LearnerLayout;
