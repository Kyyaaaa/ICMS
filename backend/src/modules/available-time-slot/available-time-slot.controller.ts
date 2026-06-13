import { Request, Response } from 'express';
import { AvailableTimeSlotService } from './available-time-slot.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AvailableTimeSlotController {
  /**
   * GET /api/available-time-slots/my-availability
   */
  static async getMyAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const result = await AvailableTimeSlotService.getMyAvailability(userId);
      return res.status(200).json({ 
        success: true, 
        data: result 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching availability:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
      });
    }
  }

  /**
   * POST /api/available-time-slots/submit
   */
  static async submitAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const body = req.body || {};
      await AvailableTimeSlotService.submitAvailability(userId, body);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Availability submitted successfully' 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error submitting availability:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error submitting availability' 
      });
    }
  }

  /**
   * GET /api/available-time-slots/staff/tutors
   */
  static async getAllTutorsAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await AvailableTimeSlotService.getAllTutorsAvailability();
      return res.status(200).json({ 
        success: true, 
        data: result 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching all tutors availability:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
      });
    }
  }

  /**
   * PUT /api/available-time-slots/staff/tutors/:tutorId
   */
  static async staffUpdateTutorAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      const tutorId = req.params.tutorId as string;
      if (!tutorId) {
        return res.status(400).json({ success: false, message: 'tutorId is required' });
      }

      const body = req.body || {};
      await AvailableTimeSlotService.staffUpdateTutorAvailability(tutorId, body);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Tutor availability updated successfully' 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating tutor availability:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error updating tutor availability' 
      });
    }
  }
}
