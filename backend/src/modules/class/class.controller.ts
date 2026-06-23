import { Request, Response } from 'express';
import { ClassService } from './class.service';

export class ClassController {
  static async getClasses(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as string;
      const courseId = req.query.course_id as string;
      const tutorId = req.query.tutor_id as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const result = await ClassService.getClasses(status, courseId, tutorId, page, limit);
      res.status(200).json({ success: true, data: result.data, total: result.total });
    } catch (error: any) {
      console.error('Error in ClassController.getClasses:', error);
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  static async getClassById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await ClassService.getClassById(id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  static async createClass(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      if (!data.name || !data.course_id || !data.start_date || !data.end_date || !data.capacity) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }
      
      const result = await ClassService.createClass(data);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  static async updateClass(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const updates = req.body;
      const result = await ClassService.updateClass(id, updates);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  static async updateClassSession(req: Request, res: Response): Promise<void> {
    try {
      const class_id = req.params.class_id as string;
      const session_id = req.params.session_id as string;
      const updates = req.body;
      
      const result = await ClassService.updateClassSession(class_id, session_id, updates);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  static async getClassStudents(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await ClassService.getClassStudents(id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }

  static async getOccupiedSessions(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        tutor_id: req.query.tutor_id as string,
        classroom_id: req.query.classroom_id as string,
        date: req.query.date as string,
        slot: req.query.slot as string,
        start_date: req.query.start_date as string,
        exclude_class_id: req.query.exclude_class_id as string
      };
      const result = await ClassService.getOccupiedSessions(filters);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }
  static async deleteClass(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await ClassService.deleteClass(id);
      res.status(200).json({ success: true, message: 'Class deleted successfully' });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, message: error.message });
    }
  }
}
