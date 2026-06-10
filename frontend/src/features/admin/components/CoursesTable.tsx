import { BookOpen, Edit, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from '../types/course';

interface CoursesTableProps {
    courses: Course[];
    handleDelete: (id: string) => void;
}

export const CoursesTable = ({ courses, handleDelete }: CoursesTableProps) => {
    return (
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
                        {courses.map(course => (
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
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-[#74777f]">No courses found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
