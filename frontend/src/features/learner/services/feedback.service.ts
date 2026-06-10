import type { FeedbackSubmitData } from '../types/feedback';

export const FeedbackService = {
    submitFeedback: async (_data: FeedbackSubmitData): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, 1500));
    }
};
