import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import type { CourseGroup } from '../types/class';
import { ClassesService } from '../services/classes.service';
import { CourseClassesSection } from '../components/CourseClassesSection';
import { CoursesService } from '@/shared/services/courses.service';
import { AccountsService } from '../services/accounts.service';

const ManageClasses = () => {
    const [courses, setCourses] = useState<CourseGroup[]>([]);
    const [rawCourses, setRawCourses] = useState<CourseGroup[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [courseFilter, setCourseFilter] = useState('');
    const [tutorFilter, setTutorFilter] = useState('');
    const [tabFilter, setTabFilter] = useState<'Active' | 'Completed'>('Active');

    const [allCourses, setAllCourses] = useState<{id: string, title: string}[]>([]);
    const [allTutors, setAllTutors] = useState<{id: string, full_name: string}[]>([]);

    useEffect(() => {
        const loadFiltersData = async () => {
            const [coursesData, tutorsData] = await Promise.all([
                CoursesService.getCourses(),
                AccountsService.getAccounts({ page: 1, limit: 100, role: 'TUTOR' })
            ]);
            setAllCourses(coursesData);
            setAllTutors((tutorsData as { data?: { data?: { id: string, full_name: string }[] } }).data?.data || []);
        };
        loadFiltersData();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            const data = await ClassesService.getCourseGroups({
                course_id: courseFilter || undefined,
                tutor_id: tutorFilter || undefined
            });
            setRawCourses(data);
            setLoading(false);
        };
        fetchClasses();
    }, [courseFilter, tutorFilter]);

    useEffect(() => {
        let filtered = rawCourses.map(group => ({
            ...group,
            classes: group.classes.filter(c => {
                if (tabFilter === 'Active') {
                    return c.status === 'UPCOMING' || c.status === 'ONGOING';
                } else {
                    return c.status === 'COMPLETED' || c.status === 'CANCELED';
                }
            })
        })).filter(group => group.classes.length > 0);

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.map(group => ({
                ...group,
                classes: group.classes.filter(c => c.name.toLowerCase().includes(term))
            })).filter(group => group.classes.length > 0);
        }
        
        setCourses(filtered);
    }, [rawCourses, tabFilter, searchTerm]);

    const activeCount = rawCourses.reduce((acc, group) => {
        return acc + group.classes.filter(c => c.status === 'UPCOMING' || c.status === 'ONGOING').length;
    }, 0);

    const completedCount = rawCourses.reduce((acc, group) => {
        return acc + group.classes.filter(c => c.status === 'COMPLETED' || c.status === 'CANCELED').length;
    }, 0);

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
                        <select 
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer w-37.5 truncate"
                        >
                            <option value="">All Courses</option>
                            {allCourses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select 
                            value={tutorFilter}
                            onChange={(e) => setTutorFilter(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer w-37.5 truncate"
                        >
                            <option value="">All Tutors</option>
                            {allTutors.map(t => (
                                <option key={t.id} value={t.id}>{t.full_name}</option>
                            ))}
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => setTabFilter('Active')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        tabFilter === 'Active' 
                            ? 'bg-[#002045] text-white' 
                            : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'
                    }`}
                >
                    Active ({activeCount})
                </button>
                <button 
                    onClick={() => setTabFilter('Completed')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        tabFilter === 'Completed' 
                            ? 'bg-[#002045] text-white' 
                            : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'
                    }`}
                >
                    Completed ({completedCount})
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {courses.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-[#e0e3e5] text-[#74777f]">
                            No {tabFilter.toLowerCase()} classes found.
                        </div>
                    ) : (
                        courses.map((course) => (
                            <CourseClassesSection key={course.id} course={course} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
export default ManageClasses;
