import { useState } from 'react';
import { BookOpen, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminCourses = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const [courses, setCourses] = useState([
        { id: '1', title: 'IELTS Intensive Mastery', code: 'IEL-INT-01', category: 'Masterclass', status: 'Active', price: '899,000', classes: 3 },
        { id: '2', title: 'Academic 6.5+', code: 'IEL-ACA-01', category: 'Standard', status: 'Active', price: '499,000', classes: 5 }
    ]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(c => c.id !== id));
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

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input 
                        className="pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" 
                        placeholder="Search courses by name or code..." 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Course Name</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Category</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Classes</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Price</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Status</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map(course => (
                                <tr key={course.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#181c1e]">{course.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#43474e]">{course.category}</td>
                                    <td className="py-4 px-6 text-[14px] font-bold text-[#0061a5]">{course.classes} classes</td>
                                    <td className="py-4 px-6 text-[14px] font-bold text-[#181c1e]">{course.price} đ</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-[12px] font-bold rounded uppercase ${course.status === 'Active' ? 'bg-[#e6f4ea] text-[#137333]' : course.status === 'Hidden' ? 'bg-[#ffebed] text-[#ba1a1a]' : 'bg-[#f1f4f6] text-[#74777f]'}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/courses/${course.id}`} className="p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors" title="View"><Eye size={18} /></Link>
                                            <Link to={`/admin/courses/${course.id}?edit=true`} className="p-2 text-[#43474e] hover:bg-[#f1f4f6] rounded-lg transition-colors" title="Edit"><Edit size={18} /></Link>
                                            <button onClick={() => handleDelete(course.id)} className="p-2 text-[#ba1a1a] hover:bg-[#ffebed] rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCourses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#74777f]">No courses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;
