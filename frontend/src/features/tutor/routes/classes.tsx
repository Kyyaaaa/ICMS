import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import { AttendanceService } from '../services/attendance.service';
import type { AttendanceClass } from '../types/attendance';

const TutorClasses = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<AttendanceClass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadClasses = async () => {
            setLoading(true);
            const classesData = await AttendanceService.getClasses();
            setClasses(classesData);
            setLoading(false);
        };
        loadClasses();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#002045]">Class Management</h1>
                    <p className="text-[14px] text-[#43474e] mt-1">Select a class to manage attendance and grades.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div 
                        key={cls.id} 
                        onClick={() => navigate(`/tutor/classes/${cls.id}/attendance`)}
                        className="bg-white rounded-2xl shadow-sm border border-[#e2e2e9] overflow-hidden hover:shadow-md hover:border-[#0061a5] transition-all cursor-pointer group flex flex-col"
                    >
                        <div className="p-6 flex-1">
                            <div className="w-12 h-12 bg-[#e3f2fd] rounded-xl flex items-center justify-center text-[#0061a5] mb-4">
                                <BookOpen size={24} />
                            </div>
                            <h2 className="text-[18px] font-bold text-[#002045] mb-2 group-hover:text-[#0061a5] transition-colors line-clamp-2">
                                {cls.name}
                            </h2>
                            <div className="flex items-center gap-2 text-[#43474e] text-[14px]">
                                <Users size={16} className="text-[#74777f]" />
                                <span>{cls.students} Learners</span>
                            </div>
                        </div>
                        <div className="p-4 border-t border-[#e2e2e9] bg-[#f8f9fc] flex items-center justify-between text-[#0061a5] font-bold text-[14px]">
                            <span>Manage Class</span>
                            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TutorClasses;
