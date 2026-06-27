import { Request, Response } from 'express';
import { TutorClassService } from './tutor-class.service';
import { supabaseAdmin } from '../../configs/supabase';

export class TutorClassController {
  static async getGradebook(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId as string;
      const tutorId = (req as any).user?.id;

      // Verify tutor owns the class
      const { data: classData, error } = await supabaseAdmin
        .from('classes')
        .select('tutor_id')
        .eq('id', classId)
        .single();
        
      if (error || !classData) {
        res.status(404).json({ success: false, message: 'Class not found' });
        return;
      }
      
      // Allow ADMIN and STAFF to view as well, but for TUTOR verify ownership
      const role = (req as any).user?.role?.toUpperCase();
      if (role === 'TUTOR' && classData.tutor_id !== tutorId) {
        res.status(403).json({ success: false, message: 'You do not have permission to view this class' });
        return;
      }

      const gradebook = await TutorClassService.getGradebook(classId);
      res.status(200).json({ success: true, data: gradebook });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async saveGradebook(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId as string;
      const tutorId = (req as any).user?.id;

      // Verify tutor owns the class
      const { data: classData, error } = await supabaseAdmin
        .from('classes')
        .select('tutor_id')
        .eq('id', classId)
        .single();
        
      if (error || !classData) {
        res.status(404).json({ success: false, message: 'Class not found' });
        return;
      }

      const role = (req as any).user?.role?.toUpperCase();
      if (role === 'TUTOR' && classData.tutor_id !== tutorId) {
        res.status(403).json({ success: false, message: 'You do not have permission to edit this class' });
        return;
      }

      await TutorClassService.saveGradebook(classId, req.body);
      res.status(200).json({ success: true, message: 'Gradebook saved successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async publishGrades(req: Request, res: Response): Promise<void> {
    try {
      const classId = req.params.classId as string;
      const tutorId = (req as any).user?.id;

      // Verify tutor owns the class
      const { data: classData, error } = await supabaseAdmin
        .from('classes')
        .select('tutor_id')
        .eq('id', classId)
        .single();
        
      if (error || !classData) {
        res.status(404).json({ success: false, message: 'Class not found' });
        return;
      }

      const role = (req as any).user?.role?.toUpperCase();
      if (role === 'TUTOR' && classData.tutor_id !== tutorId) {
        res.status(403).json({ success: false, message: 'You do not have permission to edit this class' });
        return;
      }

      await TutorClassService.publishGrades(classId);
      res.status(200).json({ success: true, message: 'Grades published successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
