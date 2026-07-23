import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../../shared/types/course';
import { CoursesService } from '../../../shared/services/courses.service';
import { CoursesFilters } from '../components/CoursesFilters';
import { CoursesTable } from '../components/CoursesTable';
import { showConfirmModal } from '@/utils/modal';
const AdminCourses = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tabFilter, setTabFilter] = useState<'Active' | 'Completed'>('Active');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            const data = await CoursesService.getCourses();
            setCourses(data);
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const handleDelete = async (id: string) => {
        const isConfirmed = await showConfirmModal('Confirm Delete', 'Are you sure you want to delete this course?', 'warning');
        if (isConfirmed) {
            try {
                await CoursesService.deleteCourse(id);
                setCourses(prev => prev.filter(c => c.id !== id));
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete course from server.';
                window.dispatchEvent(new CustomEvent('SHOW_GLOBAL_MODAL', {
                    detail: { title: 'Delete Failed', message: errorMessage, mode: 'alert', type: 'error' }
                }));
            }
        }
    };

    const handleCreate = () => {
        navigate(`/admin/courses/new`);
    };

    const activeCount = courses.filter(c => !c.is_completed).length;
    const completedCount = courses.filter(c => c.is_completed).length;

    const filteredCourses = courses.filter(c => {
        const tabMatch = tabFilter === 'Active' ? !c.is_completed : !!c.is_completed;
        const titleMatch = c.title ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const codeMatch = c.code ? c.code.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const searchMatch = titleMatch || codeMatch;
        const categoryMatch = categoryFilter === 'All' || c.category === categoryFilter;
        return tabMatch && searchMatch && categoryMatch;
    });

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Manage Courses</h1>
                <button onClick={handleCreate} className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#004d80] transition-colors">
                    <Plus size={20} />
                    Create Course
                </button>
            </div>

            <CoursesFilters 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
            />

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
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <CoursesTable courses={filteredCourses} handleDelete={handleDelete} />
            )}
        </div>
    );
};

export default AdminCourses;
