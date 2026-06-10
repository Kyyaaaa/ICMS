import { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface FeedbackFormProps {
    isSubmitting: boolean;
    onSubmit: (rating: number, review: string) => void;
}

export const FeedbackForm = ({ isSubmitting, onSubmit }: FeedbackFormProps) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(rating, review);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] md:p-[32px] space-y-[32px]">
            <div className="flex items-center gap-[16px] pb-[24px] border-b border-[#e0e3e5]">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold text-[20px]">
                    SJ
                </div>
                <div>
                    <h2 className="text-[18px] font-bold text-[#181c1e]">Sarah Jenkins</h2>
                    <p className="text-[14px] text-[#74777f]">IELTS Academic - Reading</p>
                </div>
            </div>

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

            <div className="space-y-[12px]">
                <label className="block text-[16px] font-semibold text-[#181c1e]">Your Review</label>
                <textarea 
                    rows={5} 
                    className="w-full px-[16px] py-[12px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 resize-none"
                    placeholder="Tell us about your experience..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
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
    );
};
