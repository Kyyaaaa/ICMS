import { Request, Response } from 'express';
import { AnnouncementService } from './announcement.service';

export class AnnouncementController {
    static async getAnnouncements(_req: Request, res: Response) {
        try {
            const data = await AnnouncementService.getAnnouncements();
            res.status(200).json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getNotifications(req: Request, res: Response) {
        try {
            const { role } = req.query;
            const userId = (req as any).user?.id;
            if (!role || typeof role !== 'string') {
                return res.status(400).json({ success: false, message: 'Role query parameter is required' });
            }
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const data = await AnnouncementService.getNotificationsByRole(role, userId);
            res.status(200).json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getPublicNotifications(_req: Request, res: Response) {
        try {
            const data = await AnnouncementService.getNotificationsByRole('Guest');
            res.status(200).json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createAnnouncement(req: Request, res: Response) {
        try {
            const data = await AnnouncementService.createAnnouncement(req.body);
            res.status(201).json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async updateAnnouncement(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const data = await AnnouncementService.updateAnnouncement(id, req.body);
            res.status(200).json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async deleteAnnouncement(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await AnnouncementService.deleteAnnouncement(id);
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
