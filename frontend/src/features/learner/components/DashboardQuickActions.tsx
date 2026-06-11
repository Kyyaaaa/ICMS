import { Link } from 'react-router-dom';
import { Calendar, Award, CreditCard, PlusCircle } from 'lucide-react';

export const DashboardQuickActions = () => {
    const actions = [
        { name: 'View Schedule', icon: Calendar, link: '/learner/schedules', color: 'bg-[#e6f0fa] text-[#0061a5] hover:bg-[#cce0f5]' },
        { name: 'My Grades', icon: Award, link: '/learner/grades', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
        { name: 'Make Payment', icon: CreditCard, link: '/learner/payments', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
        { name: 'Register Course', icon: PlusCircle, link: '/courses', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 mb-6">
            <h2 className="text-[18px] font-bold text-[#002045] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {actions.map((action, i) => (
                    <Link to={action.link} key={i} className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors gap-2 text-center ${action.color}`}>
                        <action.icon className="w-6 h-6" />
                        <span className="text-[13px] font-bold leading-tight">{action.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
