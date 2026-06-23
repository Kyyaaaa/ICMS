import { BookOpen, CalendarDays } from 'lucide-react';
import type { CourseGroup } from '../types/class';
import { ClassCard } from './ClassCard';

interface CourseClassesSectionProps {
    course: CourseGroup;
}

export const CourseClassesSection = ({ course }: CourseClassesSectionProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
            <div className="bg-[#f8f9fa] px-6 py-4 border-b border-[#e0e3e5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-[#0061a5] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#002045]">{course.name}</h2>
                        <p className="text-xs text-[#74777f] mt-1 flex items-center gap-1 font-medium">
                            <CalendarDays className="w-3 h-3" /> Duration: {course.startDate ? new Date(course.startDate).toLocaleDateString('en-GB') : 'TBA'} - {course.endDate ? new Date(course.endDate).toLocaleDateString('en-GB') : 'TBA'}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 p-6">
                {course.classes.map((cls) => (
                    <ClassCard key={cls.id} cls={cls} />
                ))}
            </div>
        </div>
    );
};
