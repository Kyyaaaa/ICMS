import { useState, useEffect } from 'react';
import { BookOpen, MapPin, Calendar, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { ClassDetailData } from '../types/class-detail';
import { LearnerClassDetailService } from '../services/class-detail.service';

const ClassDetail = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState<ClassDetailData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassDetail = async () => {
            if (id) {
                const data = await LearnerClassDetailService.getClassDetail(id);
                if (data) setClassData(data);
            }
            setLoading(false);
        };
        fetchClassDetail();
    }, [id]);

    if (loading) {
        return <div className="text-center py-10">Loading class details...</div>;
    }

    if (!classData) {
        return <div className="text-center py-10">Class not found.</div>;
    }

    const isCompleted = classData.status === 'Completed';

    return (
        <div className="space-y-[24px] max-w-5xl animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to="/learner/classes" className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Classes</Link>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">{classData.courseName}</h1>
                <span className={`px-[12px] py-[4px] text-[14px] font-bold rounded uppercase tracking-wide ${isCompleted ? 'bg-[#d3e3fd] text-[#004a77]' : 'bg-[#d2e4ff] text-[#0061a5]'}`}>{classData.status}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-[24px]">
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                        <h2 className="text-[18px] font-semibold text-[#181c1e] mb-[16px]">Course Information</h2>
                        <p className="text-[14px] text-[#43474e] leading-relaxed mb-[24px]">
                            {classData.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                            <div className="flex items-start gap-[12px]">
                                <Calendar className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Schedule</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">{classData.schedule}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-[12px]">
                                <Clock className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Time</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">{classData.time}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-[12px]">
                                <MapPin className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Classroom</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">{classData.classroom}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-[12px]">
                                <BookOpen className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Total Sessions</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">{classData.totalSessions} Sessions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum Outline */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                        <h2 className="text-[18px] font-semibold text-[#181c1e] mb-[16px]">Curriculum Outline</h2>
                        <div className="space-y-[16px]">
                            {classData.curriculum.map((session, index) => (
                                <div className="flex gap-[16px]" key={session.sessionNumber}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] ${session.status === 'upcoming' ? 'bg-[#e0e3e5] text-[#74777f]' : 'bg-[#0061a5] text-white'}`}>{session.sessionNumber}</div>
                                        {index < classData.curriculum.length - 1 && <div className={`w-[2px] h-full mt-[8px] ${session.status === 'upcoming' ? 'bg-transparent' : 'bg-[#e0e3e5]'}`}></div>}
                                    </div>
                                    <div className="pb-[16px]">
                                        <h3 className={`font-bold text-[16px] ${session.status === 'upcoming' ? 'text-[#74777f]' : 'text-[#181c1e]'}`}>{session.title}</h3>
                                        <p className={`text-[14px] mt-1 ${session.status === 'upcoming' ? 'text-[#74777f]' : 'text-[#43474e]'}`}>{session.description}</p>
                                        {session.status === 'upcoming' && <span className="inline-block mt-2 px-2 py-1 bg-[#f8f9fa] text-[#43474e] text-[12px] font-bold rounded">Upcoming</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-[24px]">
                    {/* Tutor Profile */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold text-[24px] mb-[16px]">
                            {classData.tutor.initials}
                        </div>
                        <h2 className="text-[18px] font-bold text-[#181c1e]">{classData.tutor.name}</h2>
                        <p className="text-[14px] text-[#74777f] mb-[16px]">{classData.tutor.title}</p>
                        <div className="flex items-center justify-center gap-[4px] text-[#c9a82c] mb-[16px]">
                            ★ ★ ★ ★ ★ <span className="text-[12px] text-[#74777f] ml-1">({classData.tutor.rating})</span>
                        </div>
                        {isCompleted ? (
                            <Link to={`/learner/classes/${id}/feedback`} className="block w-full py-[8px] bg-[#002045] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#0061a5] transition-colors">
                                Leave Feedback
                            </Link>
                        ) : (
                            <div className="w-full py-[8px] bg-[#f8f9fa] text-[#74777f] rounded-[8px] text-[14px] font-semibold cursor-not-allowed border border-[#e0e3e5]" title="Feedback will be available after completing all sessions">
                                Leave Feedback
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                        <h2 className="text-[16px] font-semibold text-[#181c1e] mb-[16px]">Attendance Progress</h2>
                        <div className="flex justify-between text-[14px] mb-[8px]">
                            <span className="text-[#43474e]">{classData.progress.completed} / {classData.totalSessions} Sessions</span>
                            <span className="font-bold text-[#0061a5]">{classData.progress.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0061a5]" style={{ width: `${classData.progress.percentage}%` }}></div>
                        </div>
                        <Link to={`/learner/classes/${id}/attendance`} className="block text-center mt-[16px] text-[14px] text-[#0061a5] font-medium hover:underline">
                            View Attendance Log
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetail;
