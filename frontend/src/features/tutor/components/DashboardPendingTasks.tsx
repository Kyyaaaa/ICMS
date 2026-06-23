import { Link } from 'react-router-dom';
import { AlertCircle, ChevronRight, CheckSquare, FileText, Calendar } from 'lucide-react';
import type { TutorPendingTask } from '../types/dashboard';

interface DashboardPendingTasksProps {
    tasks: TutorPendingTask[];
}

export const DashboardPendingTasks = ({ tasks }: DashboardPendingTasksProps) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'CheckSquare': return CheckSquare;
            case 'FileText': return FileText;
            case 'Calendar': return Calendar;
            default: return FileText;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#002045] flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Tasks
                </h2>
                <button className="text-[#0061a5] text-xs font-bold hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
                {tasks.map((task, i) => {
                    const Icon = getIcon(task.iconType);
                    return (
                        <Link to={task.link} key={i} className="flex items-center justify-between p-4 rounded-xl border border-[#e0e3e5] hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.bg}`}>
                                    <Icon className={`w-5 h-5 ${task.color}`} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#002045] text-sm group-hover:text-[#0061a5] transition-colors">{task.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-[#74777f] font-medium mt-1">
                                        <span>{task.type}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
                                        <span>{task.time}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#c4c6cf] group-hover:text-[#0061a5]" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
