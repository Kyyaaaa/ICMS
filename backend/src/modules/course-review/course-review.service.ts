import { CourseReviewRepository } from './course-review.repository';
import { UpsertCourseReviewDTO } from './course-review.model';

export class CourseReviewService {
    static async getReview(learnerId: string, classId: string) {
        if (!learnerId || !classId) {
            throw new Error('Learner ID and Class ID are required');
        }
        return await CourseReviewRepository.getReviewByClass(learnerId, classId);
    }

    static async upsertReview(learnerId: string, dto: UpsertCourseReviewDTO) {
        if (!learnerId) throw new Error('Learner ID is required');
        if (!dto.class_id || !dto.course_id) throw new Error('Class ID and Course ID are required');
        if (typeof dto.rating !== 'number' || dto.rating < 1 || dto.rating > 5) {
            throw new Error('Rating must be a number between 1 and 5');
        }
        if (dto.review && dto.review.length > 500) {
            throw new Error('Review must not exceed 500 characters');
        }

        return await CourseReviewRepository.upsertReview(learnerId, dto);
    }
}
