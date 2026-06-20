import { Request, Response } from 'express';
import { TutorReviewService } from './tutor-review.service';
import { UpsertTutorReviewDTO } from './tutor-review.model';

export class TutorReviewController {
    static async getReview(req: Request, res: Response): Promise<void> {
        try {
            const learnerId = (req as any).user?.id || (req as any).user?.sub;
            const classId = req.params.classId as string;

            if (!learnerId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const review = await TutorReviewService.getReview(learnerId, classId);
            res.status(200).json({ success: true, data: review });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async upsertReview(req: Request, res: Response): Promise<void> {
        try {
            const learnerId = (req as any).user?.id || (req as any).user?.sub;
            const classId = req.params.classId as string;
            const dto: UpsertTutorReviewDTO = req.body;
            dto.class_id = classId;

            if (!learnerId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const result = await TutorReviewService.upsertReview(learnerId, dto);
            res.status(200).json({ success: true, data: result, message: 'Tutor feedback submitted successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
