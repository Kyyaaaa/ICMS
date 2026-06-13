import { useState, useEffect } from 'react';
import { TopNav } from '@/shared/components/layout/TopNav.tsx';
import { NotificationsPage } from '@/shared/components/common/NotificationsPage.tsx';
import Cookies from 'js-cookie';

const PublicNotifications = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<Record<string, unknown> | undefined>(undefined);
    const [userRole, setUserRole] = useState<'learner' | 'tutor' | 'staff' | 'admin'>('learner');

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const token = Cookies.get('access_token');
        const userStr = Cookies.get('user_info');
        if (token && userStr) {
            setIsLoggedIn(true);
            try {
                const user = JSON.parse(userStr);
                setUserInfo(user);
                setUserRole(user.role ? user.role.toLowerCase() : 'learner');
            } catch (e) {
                // Ignore parse error
            }
        }
    }, []);

    return (
        <div className="bg-[#f7fafc] min-h-screen text-[#181c1e] text-base leading-6 font-sans flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userInfo={userInfo} userRole={userRole} />
            <main className="grow w-full max-w-360 mx-auto px-4 lg:px-8 py-8 md:py-12">
                <NotificationsPage />
            </main>
        </div>
    );
};

export default PublicNotifications;
