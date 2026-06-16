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
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

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

    const filteredCourses = courses.filter(c => {
        const titleMatch = c.title ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const codeMatch = c.code ? c.code.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        return titleMatch || codeMatch;
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

            <CoursesFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
