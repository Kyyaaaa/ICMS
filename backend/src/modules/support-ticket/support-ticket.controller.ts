import { Request, Response } from 'express';
import { SupportTicketService } from './support-ticket.service';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const sender_id = user?.id || req.body.sender_id; // fallback if no auth middleware
        const sender_role = user?.role || req.body.sender_role;

        if (!sender_id || !sender_role) {
            return res.status(401).json({ message: 'Unauthorized or missing sender info' });
        }

        const data = {
            title: req.body.subject || req.body.title,
            category: req.body.category,
            description: req.body.description,
            sender_id,
            sender_role
        };

        const ticket = await SupportTicketService.createTicket(data);
        res.status(201).json(ticket);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTickets = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        // if user is not set by auth middleware, get from query for testing purposes
        const user_id = user?.id || req.query.user_id as string;
        const role = user?.role || req.query.role as string;

        if (!user_id || !role) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const tickets = await SupportTicketService.getTickets(user_id, role);
        res.json(tickets);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTicketMessages = async (req: Request, res: Response) => {
    try {
        const ticket_id = req.params.id;
        const messages = await SupportTicketService.getTicketMessages(ticket_id);
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const replyToTicket = async (req: Request, res: Response) => {
    try {
        const ticket_id = req.params.id;
        const user = (req as any).user;
        const sender_id = user?.id || req.body.sender_id;
        const sender_role = user?.role || req.body.sender_role;

        if (!sender_id || !sender_role) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const message = await SupportTicketService.replyToTicket({
            ticket_id,
            sender_id,
            sender_role,
            text: req.body.text
        });
        
        res.status(201).json(message);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
    try {
        const ticket_id = req.params.id;
        const status = req.body.status;
        const updatedTicket = await SupportTicketService.updateTicketStatus(ticket_id, status);
        res.json(updatedTicket);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
