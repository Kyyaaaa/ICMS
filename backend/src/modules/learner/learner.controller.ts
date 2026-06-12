import { Request, Response } from 'express';
import { LearnerService } from './learner.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class LearnerController {
  /**
   * GET /api/learners
   */
  static async getAll(req: Request, res: Response) {
    try {
      const learners = await LearnerService.getAll();
      return res.status(200).json({ 
        success: true, 
        data: learners 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching learners:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
      });
    }
  }

  /**
   * GET /api/learners/:id
   */
  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const userRole = req.user?.role;
      if (userRole === 'LEARNER' && req.user?.id !== req.params.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'Forbidden: You can only access your own profile' 
        });
      }

      const learner = await LearnerService.getById(req.params.id as string);
      return res.status(200).json({ 
        success: true, 
        data: learner 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching learner by ID:', err);
      return res.status(404).json({ 
        success: false, 
        message: 'Learner not found' 
      });
    }
  }

  /**
   * POST /api/learners
   */
  static async create(req: Request, res: Response) {
    try {
      const body = req.body || {};
      const { email, password, full_name, phone_number } = body;
      
      const newLearner = await LearnerService.create({ email, password, full_name, phone_number });
      return res.status(201).json({ 
        success: true, 
        message: 'Learner created successfully', 
        data: newLearner 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating learner:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error creating learner' 
      });
    }
  }

  /**
   * PUT /api/learners/:id
   */
  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const userRole = req.user?.role;
      if (userRole === 'LEARNER' && req.user?.id !== req.params.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'Forbidden: You can only update your own profile' 
        });
      }

      const body = req.body || {};

      const updatedLearner = await LearnerService.update(req.params.id as string, body);
      return res.status(200).json({ 
        success: true, 
        message: 'Learner updated successfully', 
        data: updatedLearner 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating learner:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error updating learner' 
      });
    }
  }

  /**
   * DELETE /api/learners/:id
   */
  static async delete(req: Request, res: Response) {
    try {
      await LearnerService.delete(req.params.id as string);
      return res.status(200).json({ 
        success: true, 
        message: 'Learner deleted successfully' 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting learner:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error deleting learner' 
      });
    }
  }
}
