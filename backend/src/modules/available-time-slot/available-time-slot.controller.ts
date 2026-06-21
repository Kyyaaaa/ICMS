import { Request, Response } from 'express';
import { AvailableTimeSlotService } from './available-time-slot.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AvailableTimeSlotController {
  static async getCycles(req: AuthenticatedRequest, res: Response) {
    try {
      const cycles = await AvailableTimeSlotService.getCycles();
      return res.status(200).json({ success: true, data: cycles });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  static async updateCycleStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      // Ensure only valid status is set
      if (!['OPEN', 'SCHEDULING', 'ACTIVE', 'COMPLETED'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      const updatedCycle = await AvailableTimeSlotService.updateCycleStatus(id as string, status);
      return res.status(200).json({ success: true, data: updatedCycle });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
  }

  /**
   * GET /api/available-time-slots/my-availability
   */
  static async getMyAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const cycleId = req.query.cycle_id as string;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!cycleId) {
        return res.status(400).json({ success: false, message: 'cycle_id is required' });
      }

      const result = await AvailableTimeSlotService.getMyAvailability(userId, cycleId);
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
      const cycleId = req.query.cycle_id as string;
      if (!cycleId) {
        return res.status(400).json({ success: false, message: 'cycle_id is required' });
      }

      const result = await AvailableTimeSlotService.getAllTutorsAvailability(cycleId);
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

  /**
   * GET /api/available-time-slots/cycles/by-month
   * Get or auto-create cycle by month and year
   */
  static async getOrCreateCycleByMonth(req: AuthenticatedRequest, res: Response) {
    try {
      const month = parseInt(req.query.month as string);
      const year = parseInt(req.query.year as string);

      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return res.status(400).json({ success: false, message: 'Invalid month or year' });
      }

      const cycle = await AvailableTimeSlotService.getOrCreateCycleByMonth(month, year);
      
      return res.status(200).json({ 
        success: true, 
        data: cycle 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching or creating cycle by month:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
      });
    }
  }
}
