import { useState, useEffect } from 'react';
import type { LearnerClass } from '../types/class';
import { ClassesService } from '../services/classes.service';
import { ClassCard } from '../components/ClassCard';
import { ClassesFilters } from '../components/ClassesFilters';

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
        <div className="space-y-[24px] max-w-6xl animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Classes</h1>
            
            <ClassesFilters 
                filter={filter} 
                setFilter={setFilter} 
                activeCount={activeCount} 
                completedCount={completedCount} 
            />

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                    {displayedClasses.map(classItem => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                    ))}
                    {displayedClasses.length === 0 && (
                        <div className="col-span-full py-12 text-center text-[#74777f] bg-white rounded-xl border border-[#e0e3e5]">
                            No {filter.toLowerCase()} classes found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LearnerClasses;
