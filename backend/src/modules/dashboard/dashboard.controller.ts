import { Response } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const DashboardController = {
  async getLearnerStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await DashboardService.getLearnerStats(req.user.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getLearnerUpcomingClasses(req: AuthenticatedRequest, res: Response) {
    try {
      const classes = await DashboardService.getLearnerUpcomingClasses(req.user.id);
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getLearnerPendingTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await DashboardService.getLearnerPendingTasks(req.user.id);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getTutorStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await DashboardService.getTutorStats(req.user.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getTutorUpcomingClasses(req: AuthenticatedRequest, res: Response) {
    try {
      const classes = await DashboardService.getTutorUpcomingClasses(req.user.id);
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getTutorPendingTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await DashboardService.getTutorPendingTasks(req.user.id);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getStaffStats(_req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await DashboardService.getStaffStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getStaffUpcomingClasses(_req: AuthenticatedRequest, res: Response) {
    try {
      const classes = await DashboardService.getStaffUpcomingClasses();
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getStaffPendingTasks(_req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await DashboardService.getStaffPendingTasks();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAdminStats(_req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await DashboardService.getAdminStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
};
