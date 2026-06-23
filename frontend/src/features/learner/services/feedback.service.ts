import axiosClient from '@/shared/services/axiosClient';

export const FeedbackService = {
    getTutorFeedback: async (classId: string) => {
        try {
            const res: unknown = await axiosClient.get(`/learner/classes/${classId}/tutor-review`);
            return (res as { data: { rating: number, review: string } })?.data || null;
        } catch (_error) {
            return null;
        }
    },
    submitFeedback: async (data: { rating: number, review: string, classId: string, tutorId?: string }) => {
        const payload = {
            rating: data.rating,
            review: data.review,
            tutor_id: data.tutorId || '00000000-0000-0000-0000-000000000000' // mock fallback if no tutor id
        };
        const res: unknown = await axiosClient.post(`/learner/classes/${data.classId}/tutor-review`, payload);
        return (res as { data: unknown })?.data;
    }
};
