import { useState, useEffect } from 'react';
import { TopNav } from '@/shared/components/layout/TopNav.tsx';
import { NotificationsPage } from '@/shared/components/common/NotificationsPage.tsx';
import Cookies from 'js-cookie';

const PublicNotifications = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!Cookies.get('access_token') && !!Cookies.get('user_info');
    });
    const [userInfo] = useState<Record<string, unknown> | null>(() => {
        const userStr = Cookies.get('user_info');
        if (userStr) {
            try { return JSON.parse(userStr); } catch { return null; }
        }
        return null;
    });
    const [userRole] = useState<'tutor' | 'learner' | 'staff' | 'admin'>(() => {
        if (userInfo && typeof (userInfo as Record<string, unknown>).role === 'string') {
            return ((userInfo as Record<string, unknown>).role as string).toLowerCase() as 'tutor' | 'learner' | 'staff' | 'admin';
        }
        return 'learner';
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#f7fafc] min-h-screen text-[#181c1e] text-base leading-6 font-sans flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userInfo={userInfo || undefined} userRole={userRole} />
            <main className="grow w-full max-w-360 mx-auto px-4 lg:px-8 py-8 md:py-12">
                <NotificationsPage />
            </main>
        </div>
    );
};

export default PublicNotifications;
