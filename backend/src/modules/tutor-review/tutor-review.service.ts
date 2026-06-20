import { TutorReviewRepository } from './tutor-review.repository';
import { UpsertTutorReviewDTO } from './tutor-review.model';

export class TutorReviewService {
    static async getReview(learnerId: string, classId: string) {
        if (!learnerId || !classId) {
            throw new Error('Learner ID and Class ID are required');
        }
        return await TutorReviewRepository.getReviewByClass(learnerId, classId);
    }

    static async upsertReview(learnerId: string, dto: UpsertTutorReviewDTO) {
        if (!learnerId) throw new Error('Learner ID is required');
        if (!dto.class_id || !dto.tutor_id) throw new Error('Class ID and Tutor ID are required');
        if (typeof dto.rating !== 'number' || dto.rating < 1 || dto.rating > 5) {
            throw new Error('Rating must be a number between 1 and 5');
        }
        if (dto.review && dto.review.length > 500) {
            throw new Error('Review must not exceed 500 characters');
        }

        return await TutorReviewRepository.upsertReview(learnerId, dto);
    }
}
