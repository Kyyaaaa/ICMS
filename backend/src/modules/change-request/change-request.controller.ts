import { Request, Response } from 'express';
import { ChangeRequestService } from './change-request.service';

const changeRequestService = new ChangeRequestService();

export const ChangeRequestController = {
    checkAvailability: async (req: Request, res: Response) => {
        try {
            const tutorId = (req as any).user.id;
            const { class_id, session_id, date, slot } = req.query;
            if (!class_id || !session_id || !date || !slot) {
                return res.status(400).json({ error: 'Missing required parameters: class_id, session_id, date, slot' });
            }
            const result = await changeRequestService.checkAvailability(tutorId, class_id as string, session_id as string, date as string, slot as string);
            res.json(result);
        } catch (error: any) {
            const responseStatus = error.message === 'Change request not found'
                ? 404
                : error.message?.includes('Invalid') || error.message?.includes('already') || error.message?.includes('Approval failed')
                    ? 400
                    : 500;
            res.status(responseStatus).json({ error: error.message });
        }
    },

    getMyRequests: async (req: Request, res: Response) => {
        try {
            const tutorId = (req as any).user.id;
            const requests = await changeRequestService.getByTutorId(tutorId);
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    getAll: async (_req: Request, res: Response) => {
        try {
            const requests = await changeRequestService.getAll();
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    getByTutorId: async (req: Request, res: Response) => {
        try {
            const tutorId = req.params.tutorId as string;
            const user = (req as any).user;
            if (user.role === 'TUTOR' && user.id !== tutorId) {
                return res.status(403).json({ error: 'Forbidden: You can only access your own requests' });
            }
            const requests = await changeRequestService.getByTutorId(tutorId);
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const tutorId = (req as any).user.id;
            const newRequest = await changeRequestService.create(req.body, tutorId);
            res.status(201).json(newRequest);
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message });
        }
    },

    updateStatus: async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const { status, staff_note, final_time, new_date, new_slot, new_room_id, substitute_tutor_id } = req.body;
            const updated = await changeRequestService.updateStatus(id, { 
                status, staff_note, final_time, new_date, new_slot, new_room_id, substitute_tutor_id 
            });
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};
