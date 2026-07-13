import { Response } from 'express';
import { EnrollmentService } from './enrollment.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class EnrollmentController {


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

  static async getLearnerAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const learnerId = req.user.id;
      const classId = req.params.class_id as string;
      const attendance = await EnrollmentService.getLearnerAttendance(learnerId, classId);

      return res.status(200).json({
        success: true,
        data: attendance,
        message: 'Retrieved learner attendance successfully'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  static async cancelEnrollment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const canceledEnrollment = await EnrollmentService.cancelEnrollment(id as string);

      return res.status(200).json({
        success: true,
        data: canceledEnrollment,
        message: 'Successfully canceled enrollment'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  static async manualEnrollment(req: AuthenticatedRequest, res: Response) {
    try {
      const { learner_id, class_id } = req.body;
      
      if (!learner_id || !class_id) {
        return res.status(400).json({ success: false, message: 'learner_id and class_id are required' });
      }

      const newEnrollment = await EnrollmentService.enrollLearner(learner_id, { class_id });

      return res.status(201).json({
        success: true,
        data: newEnrollment,
        message: 'Successfully enrolled learner manually'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}
