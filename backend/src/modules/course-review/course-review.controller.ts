import { Request, Response } from 'express';
import { CourseReviewService } from './course-review.service';
import { UpsertCourseReviewDTO } from './course-review.model';

export class CourseReviewController {
    static async getReview(req: Request, res: Response): Promise<void> {
        try {
            const learnerId = (req as any).user?.id || (req as any).user?.sub;
            const classId = req.params.classId as string;

            if (!learnerId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const review = await CourseReviewService.getReview(learnerId, classId);
            res.status(200).json({ success: true, data: review });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async upsertReview(req: Request, res: Response): Promise<void> {
        try {
            const learnerId = (req as any).user?.id || (req as any).user?.sub;
            const classId = req.params.classId as string;
            const dto: UpsertCourseReviewDTO = req.body;
            dto.class_id = classId;

            if (!learnerId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const result = await CourseReviewService.upsertReview(learnerId, dto);
            res.status(200).json({ success: true, data: result, message: 'Course feedback submitted successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
