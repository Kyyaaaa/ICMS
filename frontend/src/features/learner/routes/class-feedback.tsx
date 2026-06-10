import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FeedbackService } from '../services/feedback.service';
import { FeedbackSuccess } from '../components/FeedbackSuccess';
import { FeedbackForm } from '../components/FeedbackForm';

const ClassFeedback = () => {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (rating: number, review: string) => {
        setIsSubmitting(true);
        try {
            await FeedbackService.submitFeedback({ rating, review, classId: id || '' });
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return <FeedbackSuccess classId={id} />;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/classes/${id}`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Class</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Tutor Evaluation</h1>
            
            <FeedbackForm 
                isSubmitting={isSubmitting} 
                onSubmit={handleSubmit} 
            />
        </div>
    );
};

export default ClassFeedback;
