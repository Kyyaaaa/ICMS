import { Trash2 } from 'lucide-react';
import type { EnrolledStudent } from '../types/class-detail';

interface ClassStudentsTabProps {
    classId?: string;
    students: EnrolledStudent[];
    onRemoveStudent?: (studentId: string) => void;
}

export const ClassStudentsTab = ({ classId: _classId, students, onRemoveStudent, onAddStudent }: ClassStudentsTabProps & { onAddStudent?: () => void }) => {
    return (
        <div className="flex flex-col">
            <div className="p-4 border-b border-[#e0e3e5] flex justify-end gap-3">
                {onAddStudent && (
                    <button 
                        onClick={onAddStudent}
                        className="px-4 py-2 bg-[#0061a5] text-white rounded-lg font-bold text-sm hover:bg-[#004d84] transition-colors shadow-sm"
                    >
                        + Add Learner
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-[#43474e] text-sm">
                    <tr>
                        <th className="p-4 font-semibold w-30">ID</th>
                        <th className="p-4 font-semibold">Learner Name</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Joined Date</th>
                        <th className="p-4 font-semibold">Attendance</th>
                        <th className="p-4 font-semibold text-center w-24">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {students.map((student) => (
                        <tr key={student.id} className="border-b border-[#e0e3e5] hover:bg-[#f0f7ff]/50 transition-colors">
                            <td className="p-4 font-bold text-[#181c1e] uppercase">{student.code}</td>
                            <td className="p-4 font-bold text-[#002045]">
                                {student.name}
                            </td>
                            <td className="p-4 text-[#43474e]">{student.email}</td>
                            <td className="p-4 text-[#74777f]">{student.joinedDate}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-25">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${student.attendanceRate}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600">{student.attendanceRate}%</span>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                {onRemoveStudent && (
                                    <button 
                                        onClick={() => onRemoveStudent(student.id.toString())}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove student from class"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-[#74777f]">No enrolled students.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
        </div>
    );
};
