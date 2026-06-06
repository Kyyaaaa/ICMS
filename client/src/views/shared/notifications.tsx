import  { useState, useMemo, useEffect } from 'react';
import { Bell, CheckCircle2, Circle, Clock, MailOpen } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const NotificationsPage = () => {
    const location = useLocation();
    const isStaff = location.pathname.startsWith('/staff');
    const isLearner = location.pathname.startsWith('/learner');
    const isGuest = !isStaff && !isLearner;

    const allNotifications = useMemo(() => [
        { id: 1, type: 'system', title: 'System Maintenance', message: 'ICMS platform will have a scheduled maintenance this Sunday at 2 AM. Expect downtime for up to 2 hours.', time: '1 day ago', unread: false, date: '2026-05-30' },
        { id: 2, type: 'role', title: isStaff ? 'New Profile Verification' : 'Class Rescheduled', message: isStaff ? 'Tutor Ms. Emily Chen submitted documents for review.' : 'Your IE1601 class has been moved to Room 402.', time: '10 mins ago', unread: true, date: '2026-05-31' },
        { id: 3, type: 'role', title: isStaff ? 'Consultation Request' : 'Payment Reminder', message: isStaff ? 'A new learner requested a consultation schedule for tomorrow.' : 'Tuition fee for next month is due in 3 days.', time: '2 hours ago', unread: true, date: '2026-05-31' },
        { id: 4, type: 'role', title: isStaff ? 'Invoice Paid' : 'Material Uploaded', message: isStaff ? 'Payment for Invoice #INV-2026-10-01 has been confirmed via bank transfer.' : 'Tutor Dr. Sarah Smith uploaded new materials for IELTS Mastery.', time: '2 days ago', unread: false, date: '2026-05-29' },
        { id: 5, type: 'system', title: 'Welcome to ICMS', message: 'Thank you for joining the platform. Check out the guide to get started.', time: '1 week ago', unread: false, date: '2026-05-24' },
    ], [isStaff]);

    // Guests only see system notifications
    const initialNotifications = isGuest ? allNotifications.filter(n => n.type === 'system') : allNotifications;

    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'role'>('all');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotifications(isGuest ? allNotifications.filter(n => n.type === 'system') : allNotifications);
        setFilter('all');
    }, [isGuest, allNotifications]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return n.unread;
        if (filter === 'system') return n.type === 'system';
        if (filter === 'role') return n.type === 'role';
        return true;
    });

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[#002045]">All Notifications</h1>
                    <p className="text-[#43474e] mt-1">Stay updated with your latest alerts and system announcements.</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e0e3e5] rounded-xl text-[#0061a5] font-bold text-[14px] hover:bg-[#f1f4f6] transition-colors shadow-sm"
                >
                    <MailOpen className="w-4 h-4" />
                    Mark all as read
                </button>
            </div>

            <div className="bg-white border border-[#e0e3e5] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#e0e3e5] bg-[#f8f9fa] flex gap-2 overflow-x-auto scrollbar-none">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${filter === 'unread' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                    >
                        Unread
                    </button>
                    {!isGuest && (
                        <>
                            <button 
                                onClick={() => setFilter('system')}
                                className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${filter === 'system' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                            >
                                System Updates
                            </button>
                            <button 
                                onClick={() => setFilter('role')}
                                className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${filter === 'role' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                            >
                                {isStaff ? 'Staff Alerts' : 'Learner Alerts'}
                            </button>
                        </>
                    )}
                </div>

                <div className="divide-y divide-[#e0e3e5]">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notif => (
                            <div key={notif.id} className={`p-5 flex flex-col md:flex-row gap-4 transition-colors ${notif.unread ? 'bg-[#f0f7ff]' : 'hover:bg-[#f8f9fa]'}`}>
                                <div className="mt-1 shrink-0">
                                    {notif.unread ? (
                                        <Circle className="w-4 h-4 fill-[#0061a5] text-[#0061a5]" />
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4 text-[#74777f]" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className={`text-[15px] ${notif.unread ? 'font-bold text-[#002045]' : 'font-semibold text-[#43474e]'}`}>{notif.title}</h3>
                                        {notif.type === 'system' ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e6f0fa] text-[#0061a5] uppercase tracking-wide">System</span>
                                        ) : (
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${isStaff ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {isStaff ? 'Staff' : 'Learner'}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-[14px] leading-relaxed mb-3 ${notif.unread ? 'text-[#002045]' : 'text-[#43474e]'}`}>{notif.message}</p>
                                    <div className="flex items-center gap-4 text-[12px] font-medium text-[#74777f]">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {notif.time}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="hidden sm:inline">{notif.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-start justify-end gap-2 shrink-0 md:pl-4">
                                    {notif.unread && (
                                        <button 
                                            onClick={() => markAsRead(notif.id)}
                                            className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#0061a5] hover:bg-[#e6f0fa] transition-colors"
                                        >
                                            Mark read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-[#f1f4f6] rounded-full flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-[#74777f]" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#002045]">No notifications found</h3>
                            <p className="text-[#43474e] mt-2">You're all caught up! Check back later for new updates.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
