import React, { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const ClassFeedback = () => {
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto mt-[40px] bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[40px] text-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-[24px]">
                    <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
                </div>
                <h2 className="text-[24px] font-bold text-[#181c1e] mb-[16px]">Feedback Submitted!</h2>
                <p className="text-[16px] text-[#43474e] mb-[32px]">Thank you for your valuable feedback. This helps us improve the quality of our teaching.</p>
                <Link to={`/learner/classes/${id}`} className="inline-block px-[24px] py-[10px] bg-[#002045] text-white rounded-[8px] font-semibold hover:bg-[#0061a5] transition-colors">
                    Back to Class
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/classes/${id}`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Class</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Tutor Evaluation</h1>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] md:p-[32px] space-y-[32px]">
                {/* Tutor Info */}
                <div className="flex items-center gap-[16px] pb-[24px] border-b border-[#e0e3e5]">
                    <div className="w-16 h-16 rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold text-[20px]">
                        SJ
                    </div>
                    <div>
                        <h2 className="text-[18px] font-bold text-[#181c1e]">Sarah Jenkins</h2>
                        <p className="text-[14px] text-[#74777f]">IELTS Academic - Reading</p>
                    </div>
                </div>

                {/* Rating */}
                <div className="space-y-[12px]">
                    <label className="block text-[16px] font-semibold text-[#181c1e]">Overall Rating</label>
                    <div className="flex gap-[8px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <Star className={`w-8 h-8 ${(hover || rating) >= star ? 'fill-[#c9a82c] text-[#c9a82c]' : 'text-[#c4c6cf]'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Written Feedback */}
                <div className="space-y-[12px]">
                    <label className="block text-[16px] font-semibold text-[#181c1e]">Your Review</label>
                    <textarea 
                        rows={5} 
                        className="w-full px-[16px] py-[12px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 resize-none"
                        placeholder="Tell us about your experience..."
                        required
                    ></textarea>
                </div>

                <div className="pt-[24px] border-t border-[#e0e3e5] flex justify-end">
                    <button 
                        type="submit" 
                        disabled={rating === 0 || isSubmitting} 
                        className="bg-[#002045] text-white px-[24px] py-[10px] rounded-[8px] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[#0061a5] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4"/> Submit Review</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClassFeedback;
