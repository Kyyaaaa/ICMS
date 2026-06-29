import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Wallet, UserCog, FileText } from 'lucide-react';
import { MainLayout } from './MainLayout';

const LearnerLayout = () => {
    const navItems = [
        { name: 'Dashboard', path: '/learner/dashboard', icon: LayoutDashboard },
        { name: 'My Classes', path: '/learner/classes', icon: BookOpen },
        { name: 'My Schedules', path: '/learner/schedules', icon: Calendar },
        { name: 'Academic Results', path: '/learner/grades', icon: FileText },
        { name: 'Payments', path: '/learner/payments', icon: Wallet },
        { name: 'Support Tickets', path: '/learner/support', icon: MessageSquare },
        { name: 'My Profile', path: '/learner/profile', icon: UserCog },
    ];

    return (
        <MainLayout 
            role="Learner"
            title="Learner"
            basePath="/learner/dashboard"
            navItems={navItems}
            titleIcon={BookOpen}
        />
    );
};

export default LearnerLayout;
