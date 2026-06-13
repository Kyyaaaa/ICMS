import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import type { CourseGroup } from '../types/class';
import { ClassesService } from '../services/classes.service';
import { CourseClassesSection } from '../components/CourseClassesSection';

const ManageClasses = () => {
    const [courses, setCourses] = useState<CourseGroup[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            const data = await ClassesService.getCourseGroups();
            setCourses(data);
            setLoading(false);
        };
        fetchCourses();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#002045]">Manage Classes</h1>
                    <p className="text-sm text-[#74777f]">Organize classes grouped by courses, assign tutors and rooms.</p>
                </div>
                <Link to="/staff/classes/create" className="px-4 py-2 bg-[#002045] text-white rounded-lg font-semibold hover:bg-[#0061a5] transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Create New Class
                </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e0e3e5] flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by class name..." 
                        className="w-full pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg text-sm focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" 
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer">
                            <option value="">All Courses</option>
                            <option value="ielts">IELTS Masterclass</option>
                            <option value="toeic">TOEIC Intensive</option>
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer">
                            <option value="">All Tutors</option>
                            <option value="sarah">Dr. Sarah Connor</option>
                            <option value="james">Mr. James Bond</option>
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer">
                            <option value="">All Statuses</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <input 
                            type="date" 
                            className="appearance-none pl-3 pr-3 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer tooltip-trigger"
                            title="Filter by specific date"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {courses.map((course) => (
                        <CourseClassesSection key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default ManageClasses;
