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
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-[#e0e3e5]">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold text-xl">
                    SJ
                </div>
                <div>
                    <h2 className="text-lg font-bold text-[#181c1e]">Sarah Jenkins</h2>
                    <p className="text-sm text-[#74777f]">IELTS Academic - Reading</p>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-base font-semibold text-[#181c1e]">Overall Rating</label>
                <div className="flex gap-2">
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

            <div className="space-y-3">
                <label className="block text-base font-semibold text-[#181c1e]">Your Review</label>
                <textarea 
                    rows={5} 
                    className="w-full px-4 py-3 bg-white border border-[#c4c6cf] rounded-lg text-base focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 resize-none"
                    placeholder="Tell us about your experience..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                ></textarea>
            </div>

            <div className="pt-6 border-t border-[#e0e3e5] flex justify-end">
                <button 
                    type="submit" 
                    disabled={rating === 0 || isSubmitting} 
                    className="bg-[#002045] text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#0061a5] transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4"/> Submit Review</>}
                </button>
            </div>
        </form>
    );
};
