import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeedbackSuccessProps {
    classId?: string;
}

export const FeedbackSuccess = ({ classId }: FeedbackSuccessProps) => {
    return (
        <div className="max-w-2xl mx-auto mt-[40px] bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[40px] text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-[24px]">
                <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
            </div>
            <h2 className="text-[24px] font-bold text-[#181c1e] mb-[16px]">Feedback Submitted!</h2>
            <p className="text-[16px] text-[#43474e] mb-[32px]">Thank you for your valuable feedback. This helps us improve the quality of our teaching.</p>
            <Link to={`/learner/classes/${classId || ''}`} className="inline-block px-[24px] py-[10px] bg-[#002045] text-white rounded-[8px] font-semibold hover:bg-[#0061a5] transition-colors">
                Back to Class
            </Link>
        </div>
    );
};
