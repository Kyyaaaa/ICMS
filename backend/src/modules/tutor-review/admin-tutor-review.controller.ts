import { Request, Response } from 'express';
import { AdminTutorReviewRepository } from './admin-tutor-review.repository';

export class AdminTutorReviewController {
    static async getAllTutorRatings(req: Request, res: Response): Promise<void> {
        try {
            const result = await AdminTutorReviewRepository.getAllTutorRatings();
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error('[AdminTutorReviewController] getAllTutorRatings Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getTutorReviewDetail(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.params.id;
            if (!tutorId) {
                res.status(400).json({ success: false, message: 'Tutor ID is required' });
                return;
            }

            const result = await AdminTutorReviewRepository.getTutorReviewDetail(tutorId);
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error('[AdminTutorReviewController] getTutorReviewDetail Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
