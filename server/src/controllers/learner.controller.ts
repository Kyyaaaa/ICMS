import { Request, Response } from 'express';
import { LearnerService } from '../services/learner.service';
import { validateEmail, validatePassword } from '../utils/validators';

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
    } catch (error: any) {
      console.error('Error fetching learners:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal Server Error' 
      });
    }
  }

  /**
   * GET /api/learners/:id
   */
  static async getById(req: Request, res: Response) {
    try {
      const learner = await LearnerService.getById(req.params.id as string);
      return res.status(200).json({ 
        success: true, 
        data: learner 
      });
    } catch (error: any) {
      console.error('Error fetching learner by ID:', error);
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
      
      if (!email || !password || !full_name) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email, password and full_name' 
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email format' 
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password must be 8-15 characters long, and include at least one lowercase letter, one uppercase letter, one number, and one special character' 
        });
      }
      
      const newLearner = await LearnerService.create({ email, password, full_name, phone_number });
      return res.status(201).json({ 
        success: true, 
        message: 'Learner created successfully', 
        data: newLearner 
      });
    } catch (error: any) {
      console.error('Error creating learner:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message || 'Error creating learner' 
      });
    }
  }

  /**
   * PUT /api/learners/:id
   */
  static async update(req: Request, res: Response) {
    try {
      const body = req.body || {};
      const updatedLearner = await LearnerService.update(req.params.id as string, body);
      return res.status(200).json({ 
        success: true, 
        message: 'Learner updated successfully', 
        data: updatedLearner 
      });
    } catch (error: any) {
      console.error('Error updating learner:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message || 'Error updating learner' 
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
    } catch (error: any) {
      console.error('Error deleting learner:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message || 'Error deleting learner' 
      });
    }
  }
}
