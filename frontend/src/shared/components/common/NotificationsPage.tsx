import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Circle, Clock, MailOpen } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AnnouncementsService } from '@/features/admin/services/announcements.service';
import { formatDateTime } from '@/shared/utils/date';

type NotificationItem = {
    id: string;
    type: 'system' | 'role';
    title: string;
    message: string;
    time: string;
    date: string;
    unread: boolean;
};

export const NotificationsPage = () => {
    const location = useLocation();
    const isStaff = location.pathname.startsWith('/staff');
    const isLearner = location.pathname.startsWith('/learner');
    const isTutor = location.pathname.startsWith('/tutor');
    const isGuest = !isStaff && !isLearner && !isTutor;

    const currentRole = isStaff ? 'Staff' : isLearner ? 'Learner' : isTutor ? 'Tutor' : 'Guest';

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'role'>('all');

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const anns = await AnnouncementsService.getNotifications(currentRole);
                const readSet = new Set(JSON.parse(localStorage.getItem('readNotifications') || '[]'));
                
                const mapped: NotificationItem[] = anns.map(ann => ({
                    id: ann.id,
                    type: ann.audience.scope === 'System Wide' ? 'system' : 'role',
                    title: ann.title,
                    message: ann.content,
                    time: 'Recent', 
                    date: formatDateTime(ann.date),
                    unread: !readSet.has(ann.id)
                }));
                
                const initialNotifications = isGuest ? mapped.filter(n => n.type === 'system') : mapped;
                setNotifications(initialNotifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchNotifications();
        setFilter('all');
    }, [currentRole, isGuest]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return n.unread;
        if (filter === 'system') return n.type === 'system';
        if (filter === 'role') return n.type === 'role';
        return true;
    });

    const markAllAsRead = () => {
        const readList = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        const updatedList = Array.from(new Set([...readList, ...notifications.map(n => n.id)]));
        localStorage.setItem('readNotifications', JSON.stringify(updatedList));
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const markAsRead = (id: string) => {
        const readList = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        if (!readList.includes(id)) {
            readList.push(id);
            localStorage.setItem('readNotifications', JSON.stringify(readList));
        }
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#002045]">All Notifications</h1>
                    <p className="text-[#43474e] mt-1">Stay updated with your latest alerts and system announcements.</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e0e3e5] rounded-xl text-[#0061a5] font-bold text-sm hover:bg-[#f1f4f6] transition-colors shadow-sm"
                >
                    <MailOpen className="w-4 h-4" />
                    Mark all as read
                </button>
            </div>

            <div className="bg-white border border-[#e0e3e5] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#e0e3e5] bg-[#f8f9fa] flex gap-2 overflow-x-auto scrollbar-none">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === 'unread' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                    >
                        Unread
                    </button>
                    {!isGuest && (
                        <>
                            <button 
                                onClick={() => setFilter('system')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === 'system' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                            >
                                System Updates
                            </button>
                            <button 
                                onClick={() => setFilter('role')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === 'role' ? 'bg-[#0061a5] text-white' : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                            >
                                Admin Announcements
                            </button>
                        </>
                    )}
                </div>

                <div className="divide-y divide-[#e0e3e5]">
                    {loading ? (
                        <div className="py-16 flex justify-center">
                            <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
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
                                        <h3 className={`text-sm ${notif.unread ? 'font-bold text-[#002045]' : 'font-semibold text-[#43474e]'}`}>{notif.title}</h3>
                                        {notif.type === 'system' ? (
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#e6f0fa] text-[#0061a5] uppercase tracking-wide">System</span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-[#e0e3e5] text-[#002045]">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm leading-relaxed mb-3 ${notif.unread ? 'text-[#002045]' : 'text-[#43474e]'}`}>{notif.message}</p>
                                    <div className="flex items-center gap-4 text-xs font-medium text-[#74777f]">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {notif.time}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="hidden sm:inline">{notif.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-start justify-end gap-2 shrink-0 md:pl-4">
                                    {notif.unread && (
                                        <button 
                                            onClick={() => markAsRead(notif.id)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0061a5] hover:bg-[#e6f0fa] transition-colors"
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
                            <h3 className="text-lg font-bold text-[#002045]">No notifications found</h3>
                            <p className="text-[#43474e] mt-2">You're all caught up! Check back later for new updates.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
