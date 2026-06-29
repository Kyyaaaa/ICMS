import { Request, Response } from 'express';
import { ChangeRequestService } from './change-request.service';

const changeRequestService = new ChangeRequestService();

export const ChangeRequestController = {
    getMyRequests: async (req: Request, res: Response) => {
        try {
            const tutorId = (req as any).user.id;
            const requests = await changeRequestService.getByTutorId(tutorId);
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    getAll: async (req: Request, res: Response) => {
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
            const requests = await changeRequestService.getByTutorId(tutorId);
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const newRequest = await changeRequestService.create(req.body);
            res.status(201).json(newRequest);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
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
