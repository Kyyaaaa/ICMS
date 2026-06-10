
import { BookOpen, MapPin, Calendar, Clock, User, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnerClasses = () => {
    return (
        <div className="space-y-[24px] max-w-6xl animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Classes</h1>
            
            <div className="flex gap-[16px] mb-[24px]">
                <button className="px-[16px] py-[8px] bg-[#002045] text-white rounded-full text-[14px] font-semibold">Active (2)</button>
                <button className="px-[16px] py-[8px] bg-white border border-[#e0e3e5] text-[#43474e] rounded-full text-[14px] font-semibold hover:bg-[#f1f4f6]">Completed (1)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="p-[24px] flex-1">
                        <div className="flex justify-between items-start mb-[16px]">
                            <div className="w-12 h-12 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="px-[8px] py-[4px] bg-[#d2e4ff] text-[#0061a5] text-[12px] font-bold rounded uppercase tracking-wide">Ongoing</span>
                        </div>
                        <p className="text-[12px] font-semibold text-[#0061a5] mb-1 uppercase tracking-wide">Course: IELTS Academic</p>
                        <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Class: Reading Mastery (IE-R01)</h2>
                        
                        <div className="space-y-[8px] text-[14px] text-[#43474e]">
                            <div className="flex items-center gap-[8px]"><User className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Tutor:</span> Ms. Sarah Jenkins</div>
                            <div className="flex items-center gap-[8px]"><MapPin className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Room:</span> Room 302</div>
                            <div className="flex items-center gap-[8px]"><Calendar className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Schedule:</span> Tue, Thu</div>
                            <div className="flex items-center gap-[8px]"><Clock className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Time:</span> 18:00 - 20:00</div>
                            <div className="flex items-center gap-[8px]"><CalendarDays className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Duration:</span> Oct 01 - 31-12-2026</div>
                        </div>
                    </div>
                    <div className="p-[16px] border-t border-[#e0e3e5] bg-[#f7fafc] grid grid-cols-2 gap-[16px]">
                        <Link to="/learner/classes/1" className="text-center py-[8px] bg-[#002045] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#0061a5] transition-colors">Details</Link>
                        <Link to="/learner/classes/1/attendance" className="text-center py-[8px] bg-white border border-[#002045] text-[#002045] rounded-[8px] text-[14px] font-semibold hover:bg-[#d2e4ff] transition-colors">Attendance</Link>
                    </div>
                </div>

                {/* Second Class */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="p-[24px] flex-1">
                        <div className="flex justify-between items-start mb-[16px]">
                            <div className="w-12 h-12 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5]">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="px-[8px] py-[4px] bg-[#d2e4ff] text-[#0061a5] text-[12px] font-bold rounded uppercase tracking-wide">Ongoing</span>
                        </div>
                        <p className="text-[12px] font-semibold text-[#0061a5] mb-1 uppercase tracking-wide">Course: IELTS Academic</p>
                        <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Class: Writing Intensive (IE-W02)</h2>
                        
                        <div className="space-y-[8px] text-[14px] text-[#43474e]">
                            <div className="flex items-center gap-[8px]"><User className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Tutor:</span> Mr. James Bond</div>
                            <div className="flex items-center gap-[8px]"><MapPin className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Room:</span> Room 305</div>
                            <div className="flex items-center gap-[8px]"><Calendar className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Schedule:</span> Mon, Wed</div>
                            <div className="flex items-center gap-[8px]"><Clock className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Time:</span> 19:00 - 21:00</div>
                            <div className="flex items-center gap-[8px]"><CalendarDays className="w-4 h-4 text-[#74777f]"/> <span className="font-medium text-[#181c1e]">Duration:</span> Oct 01 - 31-12-2026</div>
                        </div>
                    </div>
                    <div className="p-[16px] border-t border-[#e0e3e5] bg-[#f7fafc] grid grid-cols-2 gap-[16px]">
                        <Link to="/learner/classes/2" className="text-center py-[8px] bg-[#002045] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#0061a5] transition-colors">Details</Link>
                        <Link to="/learner/classes/2/attendance" className="text-center py-[8px] bg-white border border-[#002045] text-[#002045] rounded-[8px] text-[14px] font-semibold hover:bg-[#d2e4ff] transition-colors">Attendance</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnerClasses;
