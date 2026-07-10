import React, { useState } from 'react';
import { Search, BookOpen, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AnnouncementsService } from '@/features/admin/services/announcements.service';
import { supabase } from '@/utils/supabase';
import { getInitials } from '@/shared/lib/utils';
import { formatDateTime } from '@/shared/utils/date';

interface TopNavProps {
    isLoggedIn?: boolean;
    setIsLoggedIn?: (val: boolean) => void;
    userRole?: 'learner' | 'tutor' | 'staff' | 'admin';
    userInfo?: Record<string, unknown>;
}

export const TopNav: React.FC<TopNavProps> = ({ isLoggedIn = false, setIsLoggedIn, userRole = 'learner', userInfo }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    interface Notification {
        id: string;
        title: string;
        desc: string;
        time: string;
        read: boolean;
        type: string;
    }

    const [allNotifs, setAllNotifs] = useState<Notification[]>([]);

    React.useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const roleStr = isLoggedIn ? (userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Guest') : 'Guest';
                const anns = await AnnouncementsService.getNotifications(roleStr);
                
                const readSet = new Set(JSON.parse(localStorage.getItem('readNotifications') || '[]'));
                
                const mapped: Notification[] = anns.map(ann => ({
                    id: ann.id,
                    title: ann.title,
                    desc: ann.content,
                    time: formatDateTime(ann.date),
                    read: readSet.has(ann.id),
                    type: ann.audience.scope === 'System Wide' ? 'system' : 'admin'
                }));
                
                setAllNotifs(mapped);
            } catch (err) {
                console.error("Failed to fetch notifications for top nav", err);
            }
        };
        fetchNotifs();

        const channel = supabase
            .channel('public:announcements')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
                fetchNotifs();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isLoggedIn, userRole]);

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

    const notifications = isLoggedIn ? allNotifs : allNotifs.filter(n => n.type === 'system');
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        const readList = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        const updatedList = Array.from(new Set([...readList, ...allNotifs.map(n => n.id)]));
        localStorage.setItem('readNotifications', JSON.stringify(updatedList));
        setAllNotifs(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <header className="bg-white/80 backdrop-blur-md text-[#002045] sticky top-0 shadow-sm border-b border-[#c4c6cf] flex justify-between items-center w-full px-4 lg:px-8 max-w-full mx-auto h-20 z-50 transition-all">
            <div className="max-w-360 mx-auto w-full flex justify-between items-center">
                <div className="flex items-center gap-16">
                    <Link to="/homepage" className="text-3xl leading-8 font-extrabold text-[#002045] tracking-tight flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-[#0061a5]" />
                        ICMS
                    </Link>
                    <nav className="hidden md:flex gap-10">
                        <Link className="text-base font-semibold text-[#43474e] hover:text-[#0061a5] transition-colors duration-200" to="/homepage">Home</Link>
                        <Link className="text-base font-semibold text-[#43474e] hover:text-[#0061a5] transition-colors duration-200" to="/courses">Courses</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4 lg:gap-6">
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                        <input className="pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded-full text-sm leading-5 focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 w-64 transition-all" placeholder="Search courses..." type="text" />
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
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] overflow-hidden flex flex-col z-100 animate-fade-in">
                                <div className="px-4 py-3 border-b border-[#e0e3e5] bg-[#f7fafc] flex justify-between items-center">
                                    <h4 className="font-bold text-[#002045]">Notifications</h4>
                                    <span className="text-xs text-[#0061a5] font-semibold cursor-pointer hover:underline" onClick={markAllAsRead}>Mark all as read</span>
                                </div>
                                <div className="max-h-75 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notif => (
                                        <div key={notif.id} className={`px-4 py-3 border-b border-[#f1f4f6] hover:bg-[#f8f9fa] cursor-pointer transition-colors ${!notif.read ? 'bg-[#f0f7ff]' : ''}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-extrabold tracking-wider uppercase ${getTagColor(notif.type)}`}>
                                                        {notif.type}
                                                    </span>
                                                    <h5 className={`text-sm ${!notif.read ? 'font-bold text-[#002045]' : 'font-semibold text-[#43474e]'}`}>{notif.title}</h5>
                                                </div>
                                                {!notif.read && <span className="w-2 h-2 bg-[#0061a5] rounded-full mt-1.5 shrink-0"></span>}
                                            </div>
                                            <p className="text-xs text-[#74777f] line-clamp-2 leading-tight mb-1">{notif.desc}</p>
                                            <span className="text-xs text-[#a1a4ad]">{notif.time}</span>
                                        </div>
                                    )) : (
                                        <div className="p-6 text-center text-[#74777f] text-sm">No notifications yet.</div>
                                    )}
                                </div>
                                <div className="p-2 bg-[#f7fafc] border-t border-[#e0e3e5] text-center">
                                    <Link to={isLoggedIn ? (userRole === 'admin' ? "/admin/announcements" : `/${userRole.toLowerCase()}/notifications`) : "/notifications"} onClick={() => setShowNotifications(false)} className="text-xs text-[#0061a5] font-bold cursor-pointer hover:underline block w-full">View all</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pl-4 lg:pl-6 border-l border-[#c4c6cf] items-center">
                        {isLoggedIn ? (
                            <div className="relative">
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-[#f1f4f6] py-1.5 px-3 rounded-full transition-colors" onClick={() => setShowProfileMenu(!showProfileMenu)} title="Profile Menu">
                                    <div className="hidden md:flex flex-col text-right">
                                        <span className="text-sm font-bold text-[#002045] leading-tight">{typeof userInfo?.full_name === 'string' ? userInfo.full_name : ''}</span>
                                        <span className="text-xs text-[#43474e] leading-tight uppercase">{userRole}</span>
                                    </div>
                                    <div className="relative w-10 h-10 bg-[#e6f0fa] rounded-full flex items-center justify-center text-[#0061a5] font-bold shadow-sm border-2 border-white overflow-hidden">
                                        {typeof userInfo?.full_name === 'string' ? getInitials(userInfo.full_name) : 'UN'}
                                        {typeof userInfo?.avatar_url === 'string' && userInfo.avatar_url && (
                                            <img src={userInfo.avatar_url} alt="Avatar" className="w-full h-full object-cover absolute inset-0 z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        )}
                                    </div>
                                </div>

                                {/* Profile Dropdown Menu */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-[#e0e3e5] overflow-hidden flex flex-col z-100 animate-fade-in">
                                        <Link 
                                            to={`/${userRole.toLowerCase()}/dashboard`} 
                                            className="px-4 py-3 text-sm font-semibold text-[#002045] hover:bg-[#f1f4f6] transition-colors border-b border-[#f1f4f6]"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            My Dashboard
                                        </Link>
                                        <button 
                                            className="px-4 py-3 text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] text-left transition-colors"
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                if (setIsLoggedIn) setIsLoggedIn(false);
                                                Cookies.remove('access_token', { path: '/' });
                                                Cookies.remove('refresh_token', { path: '/' });
                                                Cookies.remove('user_info', { path: '/' });
                                                Cookies.remove('user_role', { path: '/' });
                                                Cookies.remove('user_email', { path: '/' });
                                                window.location.href = '/login';
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-2.5 bg-transparent text-[#002045] rounded-full text-sm font-bold hover:bg-[#f1f4f6] transition-colors">Log In</Link>
                                <Link to="/register" className="hidden md:inline-flex px-6 py-2.5 bg-[#0061a5] text-white rounded-full text-sm font-bold hover:bg-[#002045] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
