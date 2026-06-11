import { useState, useEffect } from 'react';
import type { LearnerClass } from '../types/class';
import { ClassesService } from '../services/classes.service';
import { ClassCard } from '../components/ClassCard';
import { ClassesFilters } from '../components/ClassesFilters';
import { GraduationCap } from 'lucide-react';

const LearnerClasses = () => {
    const [classes, setClasses] = useState<LearnerClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'Active' | 'Completed'>('Active');

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            const data = await ClassesService.getMyClasses();
            setClasses(data);
            setLoading(false);
        };
        fetchClasses();
    }, []);

    const activeCount = classes.filter(c => c.status === 'Ongoing').length;
    const completedCount = classes.filter(c => c.status === 'Completed').length;

    const displayedClasses = classes.filter(c => 
        filter === 'Active' ? c.status === 'Ongoing' : c.status === 'Completed'
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-in-up pb-12">
            {/* Clean Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f8f9fc] rounded-full mb-3 border border-[#eef0f4]">
                        <GraduationCap className="w-4 h-4 text-[#0061a5]" />
                        <span className="text-[12px] font-bold text-[#0061a5] uppercase tracking-widest">My Learning Journey</span>
                    </div>
                    <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#002045] leading-tight">My Classes</h1>
                    <p className="text-[15px] text-[#43474e] max-w-lg">Manage your active enrollments and review your past achievements.</p>
                </div>
            </div>
            
            <ClassesFilters 
                filter={filter} 
                setFilter={setFilter} 
                activeCount={activeCount} 
                completedCount={completedCount} 
            />

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-[24px] shadow-sm border border-[#eef0f4]">
                    <div className="w-10 h-10 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedClasses.map(classItem => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                    ))}
                    {displayedClasses.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-white rounded-[24px] border border-[#eef0f4] shadow-sm">
                            <div className="w-16 h-16 bg-[#f8f9fc] rounded-full flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-8 h-8 text-[#c4c6cf]" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#181c1e] mb-1">No {filter.toLowerCase()} classes</h3>
                            <p className="text-[#74777f]">You don't have any {filter.toLowerCase()} classes at the moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LearnerClasses;
