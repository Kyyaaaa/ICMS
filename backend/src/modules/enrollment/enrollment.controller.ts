import { Response } from 'express';
import { EnrollmentService } from './enrollment.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class EnrollmentController {
  static async createEnrollment(req: AuthenticatedRequest, res: Response) {
    try {
      const learnerId = req.user.id;
      const data = req.body;

      const newEnrollment = await EnrollmentService.enrollLearner(learnerId, data);

      return res.status(201).json({
        success: true,
        data: newEnrollment,
        message: 'Successfully enrolled in class'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  static async getMyEnrollments(req: AuthenticatedRequest, res: Response) {
    try {
      const learnerId = req.user.id;
      const enrollments = await EnrollmentService.getLearnerEnrollments(learnerId);

      return res.status(200).json({
        success: true,
        data: enrollments,
        message: 'Retrieved enrollments successfully'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}
