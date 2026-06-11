import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../types/course';
import { CoursesService } from '../services/courses.service';
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
            const success = await CoursesService.deleteCourse(id);
            if (success) {
                setCourses(courses.filter(c => c.id !== id));
            }
        }
    };

    const handleCreate = () => {
        navigate(`/admin/courses/new`);
    };

    const filteredCourses = courses.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Manage Courses</h1>
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
