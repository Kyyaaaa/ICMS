import { useState, useEffect } from 'react';
import { TopNav } from '../components/layout/TopNav.tsx';
import { NotificationsPage } from './shared/notifications.tsx';

const PublicNotifications = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#f7fafc] min-h-screen text-[#181c1e] text-[16px] leading-[24px] font-sans flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 lg:px-[32px] py-8 md:py-12">
                <NotificationsPage />
            </main>
        </div>
    );
};

export default PublicNotifications;
