// AdminLayout component
import { 
    ScrollText, 
    LayoutDashboard, 
    BookOpen, 
    Tags, 
    MonitorPlay, 
    Users, 
    RefreshCcw, 
    Wallet, 
    Megaphone, 
    UserCog,
    Star
} from 'lucide-react';
import { MainLayout } from './MainLayout';
import { SharedSubNav } from './SharedSubNav';

export const AdminLayout = () => {

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Academics', path: '/admin/courses', icon: BookOpen, activePaths: ['/admin/courses', '/admin/classrooms', '/admin/manage-reviews'] },
        { name: 'Finance', path: '/admin/discount-codes', icon: Wallet, activePaths: ['/admin/discount-codes', '/admin/refunds', '/admin/payroll', '/admin/finance'] },
        { name: 'User Management', path: '/admin/accounts', icon: Users, activePaths: ['/admin/accounts'] },
        { name: 'Announcements', path: '/admin/announcements', icon: Megaphone, activePaths: ['/admin/announcements'] },
        { name: 'My Profile', path: '/admin/profile', icon: UserCog },
    ];

    const renderSubTabs = () => {
        const path = location.pathname;
        let tabs: { name: string; path: string; icon: React.ElementType }[] = [];

        if (path.startsWith('/admin/courses') || path.startsWith('/admin/classrooms') || path.startsWith('/admin/manage-reviews')) {
            tabs = [
                { name: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
                { name: 'Manage Classrooms', path: '/admin/classrooms', icon: MonitorPlay },
                { name: 'Manage Reviews', path: '/admin/manage-reviews', icon: Star },
            ];
        } else if (path.startsWith('/admin/discount-codes') || path.startsWith('/admin/refunds') || path.startsWith('/admin/payroll') || path.startsWith('/admin/finance')) {
            tabs = [
                { name: 'Discount Codes', path: '/admin/discount-codes', icon: Tags },
                { name: 'Manage Refunds', path: '/admin/refunds', icon: RefreshCcw },
                { name: 'Manage Payroll', path: '/admin/payroll', icon: Wallet },
                { name: 'Transaction History', path: '/admin/finance', icon: ScrollText },
            ];
        }

        if (tabs.length === 0) return null;

        return <SharedSubNav tabs={tabs} />;
    };

    return (
        <MainLayout 
            role="Admin"
            title="Admin"
            basePath="/admin/dashboard"
            navItems={navItems}
            renderSubTabs={renderSubTabs}
            titleIcon={BookOpen}
        />
    );
};
