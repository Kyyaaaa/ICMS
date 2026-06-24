import { Request, Response } from 'express';
import { SessionService } from './session.service';

export class SessionController {
  static async getMySchedule(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { start_date, end_date } = req.query;
      const data = await SessionService.getMySchedule(user.id, user.role, start_date as string, end_date as string);

      return res.status(200).json({
        success: true,
        data,
        message: 'Retrieved schedule successfully'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  static async getAttendance(req: Request, res: Response) {
    try {
      const sessionId = req.params.session_id as string;
      const data = await SessionService.getAttendance(sessionId);

      return res.status(200).json({
        success: true,
        data,
        message: 'Retrieved attendance successfully'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  static async updateAttendance(req: Request, res: Response) {
    try {
      const sessionId = req.params.session_id as string;
      const updates = req.body;

      const data = await SessionService.updateAttendance(sessionId, updates);

      return res.status(200).json({
        success: true,
        data,
        message: 'Updated attendance successfully'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}
