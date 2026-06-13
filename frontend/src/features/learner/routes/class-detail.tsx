import { useState, useEffect } from 'react';
import { BookOpen, MapPin, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { ClassDetailData } from '../types/class-detail';
import { LearnerClassDetailService } from '../services/class-detail.service';

const ClassDetail = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState<ClassDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSessions, setExpandedSessions] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchClassDetail = async () => {
            if (id) {
                const data = await LearnerClassDetailService.getClassDetail(id);
                if (data) {
                    setClassData(data);
                    const initialExpanded: Record<number, boolean> = {};
                    data.curriculum.forEach(s => {
                        if (s.status === 'ongoing') {
                            initialExpanded[s.sessionNumber] = true;
                        }
                    });
                    setExpandedSessions(initialExpanded);
                }
            }
            setLoading(false);
        };
        fetchClassDetail();
    }, [id]);

    const toggleSession = (sessionNumber: number) => {
        setExpandedSessions(prev => ({
            ...prev,
            [sessionNumber]: !prev[sessionNumber]
        }));
    };

    if (loading) {
        return <div className="text-center py-10">Loading class details...</div>;
    }

    if (!classData) {
        return <div className="text-center py-10">Class not found.</div>;
    }

    const isCompleted = classData.status === 'Completed';

    return (
        <div className="space-y-6 max-w-5xl animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Link to="/learner/classes" className="text-[#0061a5] hover:underline font-medium text-sm">← Back to Classes</Link>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">{classData.courseName}</h1>
                <span className={`px-3 py-1 text-sm font-bold rounded uppercase tracking-wide ${isCompleted ? 'bg-[#d3e3fd] text-[#004a77]' : 'bg-[#d2e4ff] text-[#0061a5]'}`}>{classData.status}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6">
                        <h2 className="text-lg font-semibold text-[#181c1e] mb-4">Course Information</h2>
                        <p className="text-sm text-[#43474e] leading-relaxed mb-6">
                            {classData.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-xs text-[#74777f] font-medium">Schedule</p>
                                    <p className="text-sm text-[#181c1e] font-medium">{classData.schedule}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-xs text-[#74777f] font-medium">Time</p>
                                    <p className="text-sm text-[#181c1e] font-medium">{classData.time}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-xs text-[#74777f] font-medium">Classroom</p>
                                    <p className="text-sm text-[#181c1e] font-medium">{classData.classroom}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <BookOpen className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-xs text-[#74777f] font-medium">Total Sessions</p>
                                    <p className="text-sm text-[#181c1e] font-medium">{classData.totalSessions} Sessions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum Outline */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#e2e2e9] p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-extrabold text-[#002045]">Curriculum Outline</h2>
                            <span className="text-sm font-semibold text-[#74777f] bg-[#f8f9fc] px-3 py-1 rounded-full">{classData.totalSessions} Sessions</span>
                        </div>
                        <div className="space-y-0 max-h-125 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#c4c6cf] scrollbar-track-transparent">
                            {classData.curriculum.map((session, index) => {
                                const isCompleted = session.status === 'completed';
                                const isOngoing = session.status === 'ongoing';
                                
                                return (
                                    <div className="flex gap-6 group" key={session.sessionNumber}>
                                        {/* Timeline Column */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center font-bold text-sm transition-all duration-300
                                                ${isCompleted ? 'bg-[#e6f4ea] text-[#137333] border border-[#137333]/20' : 
                                                  isOngoing ? 'bg-[#0061a5] text-white shadow-md ring-4 ring-[#e3f2fd]' : 
                                                  'bg-[#f8f9fc] text-[#c4c6cf] border border-[#e2e2e9] group-hover:border-[#c4c6cf]'}
                                            `}>
                                                {session.sessionNumber}
                                            </div>
                                            {/* Connector Line */}
                                            {index < classData.curriculum.length - 1 && (
                                                <div className={`w-0.5 h-full my-2 rounded-full transition-colors duration-300
                                                    ${isCompleted ? 'bg-[#137333]/30' : 'bg-[#f1f4f6]'}
                                                `}></div>
                                            )}
                                        </div>
                                        
                                        {/* Content Column */}
                                        <div className={`pb-10 pt-2 w-full ${index === classData.curriculum.length - 1 ? 'pb-2' : ''}`}>
                                            <div 
                                                className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5 cursor-pointer group/item select-none"
                                                onClick={() => toggleSession(session.sessionNumber)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`font-bold text-base transition-colors duration-300
                                                        ${isCompleted ? 'text-[#002045] group-hover/item:text-[#0061a5]' : 
                                                          isOngoing ? 'text-[#0061a5]' : 
                                                          'text-[#74777f] group-hover/item:text-[#43474e]'}
                                                    `}>
                                                        {session.title}
                                                    </h3>
                                                    {expandedSessions[session.sessionNumber] ? (
                                                        <ChevronUp className="w-5 h-5 text-[#74777f]" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-[#c4c6cf] group-hover/item:text-[#74777f] transition-colors" />
                                                    )}
                                                </div>
                                                {isOngoing && (
                                                    <span className="inline-flex shrink-0 px-2.5 py-1 bg-[#e3f2fd] text-[#0061a5] text-xs font-black rounded-md uppercase tracking-widest animate-pulse">
                                                        Current Session
                                                    </span>
                                                )}
                                            </div>
                                            {expandedSessions[session.sessionNumber] && (
                                                <p className={`text-sm leading-relaxed mt-3 animate-fade-in-up
                                                    ${isCompleted ? 'text-[#43474e]' : 
                                                      isOngoing ? 'text-[#181c1e] font-medium' : 
                                                      'text-[#74777f]'}
                                                `}>
                                                    {session.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Tutor Profile */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold text-2xl mb-4">
                            {classData.tutor.initials}
                        </div>
                        <h2 className="text-lg font-bold text-[#181c1e]">{classData.tutor.name}</h2>
                        <p className="text-sm text-[#74777f] mb-4">{classData.tutor.title}</p>
                        <div className="flex items-center justify-center gap-1 text-[#c9a82c] mb-4">
                            ★ ★ ★ ★ ★ <span className="text-xs text-[#74777f] ml-1">({classData.tutor.rating})</span>
                        </div>
                        {isCompleted ? (
                            <Link to={`/learner/classes/${id}/feedback`} className="block w-full py-2 bg-[#002045] text-white rounded-lg text-sm font-semibold hover:bg-[#0061a5] transition-colors">
                                Leave Feedback
                            </Link>
                        ) : (
                            <div className="w-full py-2 bg-[#f8f9fa] text-[#74777f] rounded-lg text-sm font-semibold cursor-not-allowed border border-[#e0e3e5]" title="Feedback will be available after completing all sessions">
                                Leave Feedback
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6">
                        <h2 className="text-base font-semibold text-[#181c1e] mb-4">Attendance Progress</h2>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#43474e]">{classData.progress.completed} / {classData.totalSessions} Sessions</span>
                            <span className="font-bold text-[#0061a5]">{classData.progress.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0061a5]" style={{ width: `${classData.progress.percentage}%` }}></div>
                        </div>
                        <Link to={`/learner/classes/${id}/attendance`} className="block text-center mt-4 text-sm text-[#0061a5] font-medium hover:underline">
                            View Attendance Log
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetail;
