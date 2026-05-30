import React from 'react';
import { BookOpen, MapPin, Calendar, Clock, Download, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const ClassDetail = () => {
    const { id } = useParams();

    return (
        <div className="space-y-[24px] max-w-5xl animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to="/learner/classes" className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Classes</Link>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">IELTS Academic - Reading</h1>
                <span className="px-[12px] py-[4px] bg-[#d2e4ff] text-[#0061a5] text-[14px] font-bold rounded uppercase tracking-wide">Ongoing</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-[24px]">
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                        <h2 className="text-[18px] font-semibold text-[#181c1e] mb-[16px]">Course Information</h2>
                        <p className="text-[14px] text-[#43474e] leading-relaxed mb-[24px]">
                            A rigorous program designed to push your academic English to the highest level. Focuses on complex reading passages and advanced essay structuring.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                            <div className="flex items-start gap-[12px]">
                                <Calendar className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Schedule</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">Tue, Thu</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-[12px]">
                                <Clock className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Time</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">18:00 - 20:00</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-[12px]">
                                <MapPin className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Classroom</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">Room 302</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-[12px]">
                                <BookOpen className="w-5 h-5 text-[#74777f] mt-1" />
                                <div>
                                    <p className="text-[12px] text-[#74777f] font-medium">Total Sessions</p>
                                    <p className="text-[14px] text-[#181c1e] font-medium">24 Sessions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                        <h2 className="text-[18px] font-semibold text-[#181c1e] mb-[16px]">Materials & Resources</h2>
                        <ul className="space-y-[12px]">
                            <li className="flex items-center justify-between p-[12px] border border-[#e0e3e5] rounded-[8px] hover:bg-[#f7fafc] transition-colors">
                                <span className="text-[14px] font-medium text-[#181c1e]">Syllabus_Reading_Advanced.pdf</span>
                                <button className="text-[#0061a5] hover:text-[#002045]"><Download className="w-5 h-5"/></button>
                            </li>
                            <li className="flex items-center justify-between p-[12px] border border-[#e0e3e5] rounded-[8px] hover:bg-[#f7fafc] transition-colors">
                                <span className="text-[14px] font-medium text-[#181c1e]">Mock_Test_1_Link.url</span>
                                <button className="text-[#0061a5] hover:text-[#002045]"><ExternalLink className="w-5 h-5"/></button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-[24px]">
                    {/* Tutor Profile */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold text-[24px] mb-[16px]">
                            SJ
                        </div>
                        <h2 className="text-[18px] font-bold text-[#181c1e]">Sarah Jenkins</h2>
                        <p className="text-[14px] text-[#74777f] mb-[16px]">Senior IELTS Tutor</p>
                        <div className="flex items-center justify-center gap-[4px] text-[#c9a82c] mb-[16px]">
                            ★ ★ ★ ★ ★ <span className="text-[12px] text-[#74777f] ml-1">(4.9)</span>
                        </div>
                        <Link to={`/learner/classes/${id}/feedback`} className="block w-full py-[8px] bg-[#002045] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#0061a5] transition-colors">
                            Leave Feedback
                        </Link>
                    </div>

                    {/* Progress */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px]">
                        <h2 className="text-[16px] font-semibold text-[#181c1e] mb-[16px]">Attendance Progress</h2>
                        <div className="flex justify-between text-[14px] mb-[8px]">
                            <span className="text-[#43474e]">12 / 24 Sessions</span>
                            <span className="font-bold text-[#0061a5]">50%</span>
                        </div>
                        <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0061a5] w-1/2"></div>
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
