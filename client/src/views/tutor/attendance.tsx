
import { ClipboardCheck } from 'lucide-react';

const ClassAttendance = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5]">
                    <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-[28px] font-bold text-[#181c1e] tracking-tight">Class Attendance</h1>
                    <p className="text-[#43474e] text-[15px]">Manage and record attendance for your students.</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-12 text-center text-[#74777f]">
                Attendance tracking lists will go here.
            </div>
        </div>
    );
};

export default ClassAttendance;
