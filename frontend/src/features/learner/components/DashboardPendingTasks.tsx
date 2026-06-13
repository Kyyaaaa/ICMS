import { Link } from 'react-router-dom';
import { FileText, CreditCard, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import type { LearnerPendingTask } from '../types/dashboard';

interface DashboardPendingTasksProps {
    tasks: LearnerPendingTask[];
}

export const DashboardPendingTasks = ({ tasks }: DashboardPendingTasksProps) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'FileText': return <FileText className="w-5 h-5" />;
            case 'CreditCard': return <CreditCard className="w-5 h-5" />;
            case 'AlertCircle': return <AlertCircle className="w-5 h-5" />;
            default: return <AlertCircle className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[#002045]">Pending Tasks</h2>
                    <p className="text-sm text-[#43474e] mt-1">Assignments and payments due</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
                {tasks.map(task => (
                    <Link 
                        to={task.link} 
                        key={task.id} 
                        className="flex items-center gap-4 p-4 rounded-xl border border-[#e0e3e5] hover:border-[#0061a5] transition-colors group"
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${task.bg} ${task.color}`}>
                            {getIcon(task.iconType)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-[#181c1e] text-sm truncate group-hover:text-[#0061a5] transition-colors">{task.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                {task.courseName && (
                                    <span className="text-xs font-medium text-[#0061a5] bg-[#e6f0fa] px-2 py-0.5 rounded-md truncate max-w-30">
                                        {task.courseName}
                                    </span>
                                )}
                                <span className="text-xs text-[#74777f] truncate">{task.dueDate}</span>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#c4c6cf] group-hover:text-[#0061a5] transition-colors shrink-0" />
                    </Link>
                ))}

                {tasks.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#74777f]">
                        <CheckCircle className="w-12 h-12 text-[#e0e3e5] mb-3" />
                        <p className="font-bold text-sm text-[#181c1e]">You're all caught up!</p>
                        <p className="text-xs mt-1">No pending tasks right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
