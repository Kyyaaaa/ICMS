import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ChevronLeft, ClipboardCheck, Award } from 'lucide-react';
import { AttendanceService } from '../services/attendance.service';
import type { AttendanceClass } from '../types/attendance';

const TutorClassDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [classInfo, setClassInfo] = useState<AttendanceClass | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadClass = async () => {
            setLoading(true);
            const classesData = await AttendanceService.getClasses();
            const found = classesData.find(c => c.id === id);
            setClassInfo(found || null);
            setLoading(false);
        };
        loadClass();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 border border-[#e2e2e9] rounded-2xl bg-white shadow-sm mt-8 mx-auto">
                <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!classInfo) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-[#002045]">Class not found</h2>
                <button 
                    onClick={() => navigate('/tutor/classes')}
                    className="mt-4 px-4 py-2 bg-[#0061a5] text-white rounded-lg font-bold"
                >
                    Back to Class Management
                </button>
            </div>
        );
    }

    const tabs = [
        { name: 'Attendance', path: `/tutor/classes/${id}/attendance`, icon: ClipboardCheck },
        { name: 'Gradebook', path: `/tutor/classes/${id}/grades`, icon: Award },
    ];

    return (
        <div className="space-y-6 animate-in fade-in pb-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/tutor/classes')}
                    className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center text-[#43474e] transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">{classInfo.name}</h1>
                    <p className="text-[14px] text-[#43474e]">Manage attendance and grades for this class.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[#e2e2e9]">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + '/');
                    return (
                        <button
                            key={tab.name}
                            onClick={() => navigate(tab.path)}
                            className={`flex items-center gap-2 px-6 py-3 font-bold text-[14px] transition-colors border-b-2 relative -bottom-px ${
                                isActive 
                                ? 'text-[#0061a5] border-[#0061a5]' 
                                : 'text-[#74777f] border-transparent hover:text-[#002045] hover:border-gray-300'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.name}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
};

export default TutorClassDetail;
