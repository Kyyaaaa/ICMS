import { ChevronDown, BookOpen } from 'lucide-react';
import type { AttendanceClass } from '../types/attendance';

interface AttendanceClassSelectProps {
    classes: AttendanceClass[];
    selectedClass: AttendanceClass | undefined;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (open: boolean) => void;
    onSelectClass: (classId: string) => void;
}

export const AttendanceClassSelect = ({ classes, selectedClass, isDropdownOpen, setIsDropdownOpen, onSelectClass }: AttendanceClassSelectProps) => {
    return (
        <div className="w-full relative z-20">
            <span className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-1.5 block">Select Class</span>
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-[400px] flex items-center justify-between p-3 rounded-xl border border-[#c4c6cf] hover:border-[#0061a5] bg-white transition-colors text-left shadow-sm"
            >
                {selectedClass ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#e3f2fd] text-[#0061a5] flex items-center justify-center font-bold text-[13px]">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-bold text-[14px] text-[#002045] leading-none mb-1">{selectedClass.name}</div>
                            <div className="text-[11px] font-medium text-[#74777f]">
                                {selectedClass.id.toUpperCase()} • {selectedClass.students} students
                            </div>
                        </div>
                    </div>
                ) : (
                    <span className="text-[#74777f]">Select a class...</span>
                )}
                <ChevronDown className={`w-5 h-5 text-[#74777f] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[400px] bg-white border border-[#e0e3e5] rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
                        <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#c4c6cf] p-2 space-y-1">
                            {classes.map(cls => (
                                <button
                                    key={cls.id}
                                    onClick={() => onSelectClass(cls.id)}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f0f4f8] transition-colors ${selectedClass?.id === cls.id ? 'bg-[#e6f0fa]' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] ${selectedClass?.id === cls.id ? 'bg-[#0061a5] text-white' : 'bg-[#e0e3e5] text-[#43474e]'}`}>
                                        {cls.id.toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-bold text-[13px] leading-none mb-1 ${selectedClass?.id === cls.id ? 'text-[#0061a5]' : 'text-[#181c1e]'}`}>
                                            {cls.name}
                                        </div>
                                        <div className="text-[11px] text-[#74777f] leading-none">{cls.students} students</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
