import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    Calendar, 
    FileEdit, 
    DollarSign, 
    MessageSquare, 
    UserCog, 
    Banknote, 
    GraduationCap, 
    Wallet 
} from 'lucide-react';
import { MainLayout } from './MainLayout';
import { SharedSubNav } from './SharedSubNav';

const StaffLayout = () => {

    // Flat Sidebar Links (pointing to the primary sub-page of each logical group)
    const navItems = [
        { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
        { name: 'Operations', path: '/staff/master-schedule', icon: Calendar, activePaths: ['/staff/classes', '/staff/master-schedule', '/staff/tutor-availability'] },
        { name: 'Requests & Support', path: '/staff/consultations', icon: MessageSquare, activePaths: ['/staff/consultations', '/staff/change-requests', '/staff/support'] },
        { name: 'Finance', path: '/staff/invoices', icon: Wallet, activePaths: ['/staff/invoices', '/staff/salary'] },
        { name: 'User Management', path: '/staff/accounts', icon: Users, activePaths: ['/staff/accounts', '/staff/certificates'] },
        { name: 'My Profile', path: '/staff/profile', icon: UserCog },
    ];

    // Sub-navigation Tabs based on the current active group
    const renderSubTabs = () => {
        const path = location.pathname;
        let tabs: { name: string; path: string; icon: React.ElementType }[] = [];

        if (path.startsWith('/staff/classes') || path.startsWith('/staff/master-schedule') || path.startsWith('/staff/tutor-availability')) {
            tabs = [
                { name: 'Master Schedule', path: '/staff/master-schedule', icon: Calendar },
                { name: 'Manage Classes', path: '/staff/classes', icon: BookOpen },
                { name: 'Manage Tutor Availability', path: '/staff/tutor-availability', icon: BookOpen },
            ];
        } else if (path.startsWith('/staff/consultations') || path.startsWith('/staff/change-requests') || path.startsWith('/staff/support')) {
            tabs = [
                { name: 'Consultations', path: '/staff/consultations', icon: Users },
                { name: 'Change Requests', path: '/staff/change-requests', icon: FileEdit },
                { name: 'Support Tickets', path: '/staff/support', icon: MessageSquare },
            ];
        } else if (path.startsWith('/staff/invoices') || path.startsWith('/staff/salary')) {
            tabs = [
                { name: 'Invoices', path: '/staff/invoices', icon: DollarSign },
                { name: 'Salary History', path: '/staff/salary', icon: Banknote },
            ];
        } else if (path.startsWith('/staff/accounts') || path.startsWith('/staff/certificates')) {
            tabs = [
                { name: 'All Accounts', path: '/staff/accounts', icon: UserCog },
                { name: 'Tutor Certificates', path: '/staff/certificates', icon: GraduationCap },
            ];
        }

        if (tabs.length === 0) return null;

        return <SharedSubNav tabs={tabs} />;
    };

    return (
        <MainLayout 
            role="Staff"
            title="Staff"
            basePath="/staff/dashboard"
            navItems={navItems}
            renderSubTabs={renderSubTabs}
            titleIcon={BookOpen}
        />
    );
};

export default StaffLayout;
