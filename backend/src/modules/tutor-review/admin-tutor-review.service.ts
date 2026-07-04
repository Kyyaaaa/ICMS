import { AdminTutorReviewRepository } from './admin-tutor-review.repository';

export class AdminTutorReviewService {
    static async getAllTutorRatings() {
        return await AdminTutorReviewRepository.getAllTutorRatings();
    }

    static async getTutorReviewDetail(tutorId: string) {
        return await AdminTutorReviewRepository.getTutorReviewDetail(tutorId);
    }
}
