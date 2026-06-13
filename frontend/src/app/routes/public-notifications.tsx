import { useState, useEffect } from 'react';
import { TopNav } from '@/shared/components/layout/TopNav.tsx';
import { NotificationsPage } from '@/shared/components/common/NotificationsPage.tsx';

const PublicNotifications = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#f7fafc] min-h-screen text-[#181c1e] text-base leading-6 font-sans flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main className="grow w-full max-w-360 mx-auto px-4 lg:px-8 py-8 md:py-12">
                <NotificationsPage />
            </main>
        </div>
    );
};

export default PublicNotifications;
