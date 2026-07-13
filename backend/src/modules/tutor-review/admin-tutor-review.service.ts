import { AdminTutorReviewRepository } from './admin-tutor-review.repository';
import { AdminTutorRatingSummary, AdminTutorProfileSummary } from './admin-tutor-review.model';

export class AdminTutorReviewService {
    static async getAllTutorRatings(): Promise<AdminTutorRatingSummary[]> {
        return await AdminTutorReviewRepository.getAllTutorRatings();
    }

    static async getTutorReviewDetail(tutorId: string): Promise<AdminTutorProfileSummary> {
        return await AdminTutorReviewRepository.getTutorReviewDetail(tutorId);
    }
}
