import React, { useState, useEffect } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { showAlertModal } from '@/utils/modal';

interface TutorFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, review: string) => Promise<void>;
    tutorName: string;
    tutorTitle: string;
    tutorInitials: string;
    existingRating?: number;
    existingReview?: string;
}

export const TutorFeedbackModal: React.FC<TutorFeedbackModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    tutorName,
    tutorTitle,
    tutorInitials,
    existingRating = 0,
    existingReview = ''
}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setRating(existingRating);
                setReview(existingReview);
                setHover(0);
            }, 0);
        }
    }, [isOpen, existingRating, existingReview]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;
        
        setIsSubmitting(true);
        try {
            await onSubmit(rating, review);
            onClose();
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : JSON.stringify(error);
            showAlertModal('Error', 'Failed to submit feedback: ' + message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#00142d]/80 backdrop-blur-md animate-fade-in transition-all duration-300">
            {/* Modal Container */}
            <div className="w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-scale-up bg-white">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-[#43474e] hover:bg-black/10 hover:text-[#002045] transition-all z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Tutor Info (Gradient & Glassmorphism) */}
                <div className="w-full md:w-5/12 p-10 flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-br from-[#002045] via-[#004a80] to-[#0061a5]">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ffd200]/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        {/* Avatar */}
                        <div className="relative mb-6 group cursor-pointer">
                            <div className="absolute inset-0 bg-linear-to-tr from-[#ffd200] to-white rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-28 h-28 rounded-full bg-white text-[#002045] flex items-center justify-center font-black text-4xl shadow-xl relative border-4 border-white/20 backdrop-blur-sm">
                                {tutorInitials}
                            </div>
                        </div>

                        {/* Name and Title */}
                        <div className="text-center w-full space-y-4">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl shadow-sm">
                                <h3 className="text-white font-extrabold text-2xl truncate tracking-tight">{tutorName}</h3>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-5 rounded-2xl shadow-sm w-full">
                                <span className="inline-block px-3 py-1 bg-[#ffd200]/20 text-[#ffd200] text-xs font-bold uppercase tracking-wider rounded-lg mb-3">
                                    {tutorTitle}
                                </span>
                                <p className="text-[#adc7f7] text-sm leading-relaxed">
                                    Your honest feedback empowers our tutors to continuously improve the learning experience for everyone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Feedback Form */}
                <div className="w-full md:w-7/12 p-10 flex flex-col bg-white">
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-[#002045] tracking-tight mb-2">Evaluate Tutor</h2>
                        <p className="text-[#74777f] text-sm">Rate your experience and leave a constructive review.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8">
                        
                        {/* Rating Stars Section */}
                        <div className="flex items-center gap-6 p-5 bg-[#f8f9fa] rounded-2xl border border-[#e0e3e5]">
                            <div className="text-[#002045] font-bold text-lg">Rating</div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isActive = (hover || rating) >= star;
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            className="w-12 h-12 flex items-center justify-center focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(rating)}
                                        >
                                            <Star 
                                                className={`w-8 h-8 transition-colors duration-200 ${
                                                    isActive 
                                                    ? 'fill-[#ffd200] text-[#ffd200] drop-shadow-[0_0_8px_rgba(255,210,0,0.5)]' 
                                                    : 'fill-transparent text-[#c4c6cf]'
                                                }`} 
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Textarea Section */}
                        <div className="flex-1 flex flex-col relative">
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-[#002045] font-bold text-sm">Your Review</label>
                                <span className={`text-xs font-medium ${review.length >= 500 ? 'text-red-500' : 'text-[#74777f]'}`}>
                                    {review.length}/500
                                </span>
                            </div>
                            <textarea 
                                className="w-full flex-1 min-h-40 p-5 bg-[#f8f9fa] border border-[#e0e3e5] rounded-2xl resize-none focus:outline-none focus:border-[#0061a5] focus:ring-4 focus:ring-[#0061a5]/10 text-[#181c1e] text-base transition-all duration-300 placeholder:text-[#a8aeb4]"
                                placeholder="Describe your learning experience, what you liked, and areas for improvement..."
                                value={review}
                                maxLength={500}
                                onChange={(e) => setReview(e.target.value)}
                                required
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-auto pt-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl text-sm font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={rating === 0 || isSubmitting}
                                className="px-8 py-3 rounded-xl text-sm font-bold bg-[#0061a5] text-white hover:bg-[#004a80] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin"/> Submitting</>
                                ) : (
                                    'Submit Feedback'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};
