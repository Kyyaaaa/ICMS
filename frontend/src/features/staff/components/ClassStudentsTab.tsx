import type { EnrolledStudent } from '../types/class-detail';

interface ClassStudentsTabProps {
    students: EnrolledStudent[];
}

export const ClassStudentsTab = ({ students }: ClassStudentsTabProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-[#43474e] text-sm">
                    <tr>
                        <th className="p-4 font-semibold">Student Name</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Joined Date</th>
                        <th className="p-4 font-semibold">Attendance</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {students.map((student) => (
                        <tr key={student.id} className="border-b border-[#e0e3e5] hover:bg-[#f0f7ff]/50 transition-colors">
                            <td className="p-4 font-bold text-[#002045]">{student.name}</td>
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
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-[#74777f]">No enrolled students.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
