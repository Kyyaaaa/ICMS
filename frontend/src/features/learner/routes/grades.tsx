import { useState } from 'react';
import { BookOpen, ChevronDown, GraduationCap, MessageCircle, X, Info } from 'lucide-react';

import { useEffect } from 'react';
import axiosClient from '../../../shared/services/axiosClient';

interface TranscriptDetail {
    assessment_name: string;
    score: number;
    feedback: string;
}

interface TranscriptCourse {
    class_id: string;
    class_name: string;
    course_name: string;
    course_code: string;
    overall_score: number;
    details: TranscriptDetail[];
}

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
    const [courses, setCourses] = useState<TranscriptCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const res = await axiosClient.get<unknown>('/learners/transcript');
                const data = (res as { data?: TranscriptCourse[] }).data || (res as unknown as TranscriptCourse[]) || [];
                setCourses(data);
            } catch (error) {
                console.error('Failed to load transcript', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTranscript();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading your academic results...</div>;
    }

    // Stats calculations
    const totalCourses = courses.length;
    
    // Normalize global score to a 9.0-point scale for the hero overview
    const avgScore = totalCourses > 0 ? courses.reduce((acc, curr) => acc + curr.overall_score, 0) / totalCourses : 0;
    const globalOverallScore = Math.round(avgScore * 2) / 2; // Round to nearest 0.5 (IELTS style)

    return (
        <div className="space-y-6 pb-12 relative">
            {/* Clean Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#002045] tracking-tight">Academic Results</h1>
                    <p className="text-[#43474e] text-sm">Track your overall performance and detailed assessments.</p>
                </div>
                
                <div className="flex items-center gap-8 lg:gap-12 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4]">
                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Overall Band</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-black leading-none tracking-tighter text-[#002045]">{globalOverallScore.toFixed(1)}</span>
                            <span className="text-sm font-bold text-slate-400 leading-none">/ 9.0</span>
                        </div>
                    </div>
                    
                    <div className="w-px h-12 bg-[#eef0f4] hidden md:block"></div>
                    
                        <div className="flex gap-8">
                            <div className="flex flex-col items-center">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Courses</p>
                                <div className="flex items-center gap-1.5 text-[#002045]">
                                    <BookOpen className="w-5 h-5 opacity-50" />
                                    <span className="text-2xl font-bold leading-none">{totalCourses}</span>
                                </div>
                            </div>
                        </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
                {courses.map((course) => {
                    const isExpanded = expandedCourse === course.class_id;

                    return (
                        <div key={course.class_id} className={`bg-white rounded-2xl border ${isExpanded ? 'border-[#0061a5] shadow-md' : 'border-[#e2e2e9] shadow-sm hover:shadow-md'} overflow-hidden transition-all duration-200`}>
                            {/* Course Header */}
                            <div 
                                onClick={() => setExpandedCourse(isExpanded ? null : course.class_id)}
                                className="p-5 md:p-6 cursor-pointer hover:bg-[#fcfdfd] flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-[#e6f4ea] text-[#137333]">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-lg font-extrabold text-[#002045] tracking-tight">{course.course_name || course.class_name}</h2>
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#e6f4ea] text-[#137333] border border-[#137333]/20 uppercase tracking-widest">PUBLISHED</span>
                                        </div>
                                        <p className="text-sm text-[#43474e] flex items-center gap-2">
                                            Class: <span className="font-semibold text-[#002045]">{course.class_name}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                                    <div className="flex items-center gap-6 md:gap-8">
                                        <div className="flex flex-col items-end">
                                            <p className="text-xs font-bold text-[#74777f] uppercase tracking-widest mb-1">Overall Band</p>
                                            <div className="flex items-baseline gap-1" style={{ color: getScoreColor(course.overall_score, 9) }}>
                                                <span className="text-xl font-black leading-none">{course.overall_score.toFixed(1)}</span>
                                                <span className="text-xs font-bold text-[#74777f] leading-none">/ 9.0</span>
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
                                        {course.details && course.details.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-[#e2e2e9] bg-[#f8f9fc]">
                                                            <th className="py-3 px-5 md:px-6 font-bold text-[#43474e] text-xs uppercase tracking-widest">Assessment</th>
                                                            <th className="py-3 px-5 md:px-6 font-bold text-[#43474e] text-xs uppercase tracking-widest text-right">Score</th>
                                                            <th className="py-3 px-5 md:px-6 font-bold text-[#43474e] text-xs uppercase tracking-widest text-center w-28">Feedback</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {course.details.map((ass, idx) => (
                                                            <tr key={idx} className="border-b last:border-0 border-[#f1f4f6] hover:bg-[#fcfdfd] transition-colors group">
                                                                <td className="py-3 px-5 md:px-6 font-semibold text-[#002045] text-sm">{ass.assessment_name}</td>
                                                                <td className="py-3 px-5 md:px-6 text-right">
                                                                    <div className="inline-flex items-baseline justify-end gap-1.5">
                                                                        <span className="font-bold text-sm leading-none drop-shadow-sm" style={{ color: getScoreColor(ass.score, 9) }}>{ass.score}</span>
                                                                        <span className="text-[#74777f] text-xs font-bold leading-none">/ 9.0</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-5 md:px-6 text-center">
                                                                    {ass.feedback ? (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); setSelectedFeedback({ title: ass.assessment_name, content: ass.feedback }); }}
                                                                            className="p-1.5 rounded-full hover:bg-[#f1f4f6] transition-colors mx-auto flex items-center justify-center text-[#c4c6cf] hover:text-[#0061a5]"
                                                                            title="Read Feedback"
                                                                        >
                                                                            <MessageCircle size={18} className="text-[#0061a5] fill-[#e3f2fd]" />
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-[#c4c6cf] text-xl">-</span>
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
                                <h3 className="text-sm font-bold text-[#0061a5] uppercase tracking-wider mb-1">Tutor Feedback</h3>
                                <h4 className="text-xl font-extrabold text-[#002045] leading-tight">{selectedFeedback.title}</h4>
                            </div>
                            <button onClick={() => setSelectedFeedback(null)} className="p-2 text-[#74777f] hover:bg-[#f1f4f6] rounded-full transition-colors shrink-0">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="bg-[#f8f9fc] rounded-xl p-5 border border-[#e2e2e9]">
                            <p className="text-sm text-[#181c1e] leading-relaxed whitespace-pre-wrap">
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
