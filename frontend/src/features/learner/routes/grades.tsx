import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, GraduationCap, Clock, MessageCircle, X, Info } from 'lucide-react';

// Mock Data để review UI
const MOCK_COURSES = [
    {
        id: 'c1',
        name: 'IELTS Intensive 6.5+',
        tutor: 'Ms. Emily Clark',
        status: 'IN_PROGRESS',
        attendanceRate: 92,
        overallScore: 6.5,
        defaultScale: 9,
        assessments: [
            { id: 'a1', title: 'Listening', date: '2026-05-10', score: 6.5, maxScore: 9, feedback: 'Good listening skills' },
            { id: 'a2', title: 'Reading', date: '2026-05-24', score: 7.0, maxScore: 9, feedback: 'Skimming needs practice' },
            { id: 'a3', title: 'Writing', date: '2026-06-05', score: 6.0, maxScore: 9, feedback: '' },
            { id: 'a4', title: 'Speaking', date: '2026-06-15', score: 6.5, maxScore: 9, feedback: 'Good fluency' }
        ]
    },
    {
        id: 'c2',
        name: 'IELTS Foundation 5.0+',
        tutor: 'Mr. John Doe',
        status: 'COMPLETED',
        attendanceRate: 100,
        overallScore: 5.5,
        defaultScale: 9,
        assessments: [
            { id: 'a4', title: 'Listening', date: '2026-03-15', score: 5.5, maxScore: 9, feedback: 'Good progress, need more vocabulary.' },
            { id: 'a5', title: 'Reading', date: '2026-04-20', score: 6.0, maxScore: 9, feedback: 'Great skimming skills.' },
            { id: 'a6', title: 'Writing', date: '2026-04-25', score: 5.0, maxScore: 9, feedback: 'Work on paragraph structure.' },
            { id: 'a7', title: 'Speaking', date: '2026-04-30', score: 5.5, maxScore: 9, feedback: 'Pronunciation is clear, need more fluency.' }
        ]
    }
];

const getScoreColor = (score: number, maxScore: number = 9) => {
    const percentage = score / maxScore;
    if (percentage >= 0.8) return '#059669'; // emerald-600
    if (percentage >= 0.65) return '#0284c7'; // sky-600
    if (percentage >= 0.5) return '#d97706'; // amber-600
    return '#e11d48'; // rose-600
};



const LearnerGrades = () => {
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [selectedFeedback, setSelectedFeedback] = useState<{title: string, content: string} | null>(null);

    // Stats calculations
    const totalCourses = MOCK_COURSES.length;
    const avgAttendance = Math.round(MOCK_COURSES.reduce((acc, curr) => acc + curr.attendanceRate, 0) / totalCourses);
    
    // Normalize global score to a 9.0-point scale for the hero overview
    const avgPercentage = MOCK_COURSES.reduce((acc, curr) => acc + (curr.overallScore / curr.defaultScale), 0) / totalCourses;
    const globalOverallScore = Math.round((avgPercentage * 9) * 2) / 2; // Round to nearest 0.5 (IELTS style)

    return (
        <div className="space-y-6 pb-12 relative">
            {/* Clean Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#002045] tracking-tight">Academic Results</h1>
                    <p className="text-[#43474e] text-[15px]">Track your overall performance and detailed assessments.</p>
                </div>
                
                <div className="flex items-center gap-8 lg:gap-12 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4]">
                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Overall Band</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-[36px] font-black leading-none tracking-tighter text-[#002045]">{globalOverallScore.toFixed(1)}</span>
                            <span className="text-[15px] font-bold text-slate-400 leading-none">/ 9.0</span>
                        </div>
                    </div>
                    
                    <div className="w-px h-12 bg-[#eef0f4] hidden md:block"></div>
                    
                    <div className="flex gap-8">
                        <div className="flex flex-col items-center">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Courses</p>
                            <div className="flex items-center gap-1.5 text-[#002045]">
                                <BookOpen className="w-5 h-5 opacity-50" />
                                <span className="text-[24px] font-bold leading-none">{totalCourses}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Attendance</p>
                            <div className="flex items-center gap-1.5 text-[#002045]">
                                <Clock className="w-5 h-5 opacity-50" />
                                <span className="text-[24px] font-bold leading-none">{avgAttendance}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
                {MOCK_COURSES.map((course) => {
                    const isExpanded = expandedCourse === course.id;

                    return (
                        <div key={course.id} className={`bg-white rounded-2xl border ${isExpanded ? 'border-[#0061a5] shadow-md' : 'border-[#e2e2e9] shadow-sm hover:shadow-md'} overflow-hidden transition-all duration-200`}>
                            {/* Course Header */}
                            <div 
                                onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                                className="p-5 md:p-6 cursor-pointer hover:bg-[#fcfdfd] flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${course.status === 'COMPLETED' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-linear-to-br from-[#e3f2fd] to-[#cce5ff] text-[#0061a5]'}`}>
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-[18px] font-extrabold text-[#002045] tracking-tight">{course.name}</h2>
                                            {course.status === 'COMPLETED' && (
                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#e6f4ea] text-[#137333] border border-[#137333]/20 uppercase tracking-widest">Completed</span>
                                            )}
                                        </div>
                                        <p className="text-[14px] text-[#43474e] flex items-center gap-2">
                                            Tutor: <span className="font-semibold text-[#002045]">{course.tutor}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                                    <div className="flex items-center gap-6 md:gap-8">
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-widest mb-1">Attendance</p>
                                            <p className="text-[16px] font-black text-[#002045]">{course.attendanceRate}%</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#e2e2e9]"></div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-[11px] font-bold text-[#74777f] uppercase tracking-widest mb-1">Avg Score</p>
                                            <div className="flex items-baseline gap-1" style={{ color: getScoreColor(course.overallScore, course.defaultScale) }}>
                                                <span className="text-[20px] font-black leading-none">{course.overallScore}</span>
                                                <span className="text-[13px] font-bold text-[#74777f] leading-none">/ {course.defaultScale}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={`p-2 flex shrink-0 items-center justify-center rounded-full transition-colors ${isExpanded ? 'bg-[#e3f2fd] text-[#0061a5]' : 'bg-transparent text-[#c4c6cf] group-hover:bg-[#f1f4f6] group-hover:text-[#0061a5]'}`}>
                                        <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details - Clean List View */}
                            {isExpanded && (
                                <div className="border-t border-[#e2e2e9] bg-[#fdfdfd] animate-in slide-in-from-top-2">
                                    <div className="p-2 md:p-4">
                                        {course.assessments.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-[#e2e2e9] bg-[#f8f9fc]">
                                                            <th className="py-3 px-5 md:px-6 font-bold text-[#43474e] text-[12px] uppercase tracking-widest">Assessment</th>
                                                            <th className="py-3 px-5 md:px-6 font-bold text-[#43474e] text-[12px] uppercase tracking-widest">Date</th>
                                                            <th className="py-3 px-5 md:px-6 font-bold text-[#43474e] text-[12px] uppercase tracking-widest text-right">Score</th>
                                                            <th className="py-3 px-5 md:px-6 font-bold text-[#43474e] text-[12px] uppercase tracking-widest text-center w-28">Feedback</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {course.assessments.map(ass => (
                                                            <tr key={ass.id} className="border-b last:border-0 border-[#f1f4f6] hover:bg-[#fcfdfd] transition-colors group">
                                                                <td className="py-3 px-5 md:px-6 font-semibold text-[#002045] text-[14px]">{ass.title}</td>
                                                                <td className="py-3 px-5 md:px-6 text-[#74777f] text-[13px]">{ass.date}</td>
                                                                <td className="py-3 px-5 md:px-6 text-right">
                                                                    <div className="inline-flex items-baseline justify-end gap-1.5">
                                                                        <span className="font-bold text-[15px] leading-none drop-shadow-sm" style={{ color: getScoreColor(ass.score, ass.maxScore) }}>{ass.score}</span>
                                                                        <span className="text-[#74777f] text-[12px] font-bold leading-none">/ {ass.maxScore}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-5 md:px-6 text-center">
                                                                    {ass.feedback ? (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); setSelectedFeedback({ title: ass.title, content: ass.feedback }); }}
                                                                            className="p-1.5 rounded-full hover:bg-[#f1f4f6] transition-colors mx-auto flex items-center justify-center text-[#c4c6cf] hover:text-[#0061a5]"
                                                                            title="Read Feedback"
                                                                        >
                                                                            <MessageCircle size={18} className="text-[#0061a5] fill-[#e3f2fd]" />
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-[#c4c6cf] text-[20px]">-</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center text-[#74777f]">
                                                <Info size={32} className="mx-auto mb-3 text-[#c4c6cf]" />
                                                <p>No assessments recorded yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Feedback Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#002045]/40 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedFeedback(null)}>
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-[14px] font-bold text-[#0061a5] uppercase tracking-wider mb-1">Tutor Feedback</h3>
                                <h4 className="text-xl font-extrabold text-[#002045] leading-tight">{selectedFeedback.title}</h4>
                            </div>
                            <button onClick={() => setSelectedFeedback(null)} className="p-2 text-[#74777f] hover:bg-[#f1f4f6] rounded-full transition-colors shrink-0">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="bg-[#f8f9fc] rounded-xl p-5 border border-[#e2e2e9]">
                            <p className="text-[15px] text-[#181c1e] leading-relaxed whitespace-pre-wrap">
                                {selectedFeedback.content}
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => setSelectedFeedback(null)}
                                className="px-6 py-2.5 bg-[#002045] text-white font-bold rounded-xl hover:bg-[#003366] transition-colors shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearnerGrades;
