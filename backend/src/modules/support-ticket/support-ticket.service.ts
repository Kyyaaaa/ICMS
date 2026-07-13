import { SupportTicketRepository } from './support-ticket.repository';
import { CreateSupportTicketDTO, CreateTicketMessageDTO } from './support-ticket.model';

export const SupportTicketService = {
    async assertTicketAccess(ticket_id: string, user_id: string, role: string) {
        const ticket = await SupportTicketRepository.getTicketById(ticket_id);
        if (!ticket) {
            const error: any = new Error('Support ticket not found');
            error.status = 404;
            throw error;
        }
        const isPrivileged = role === 'ADMIN' || role === 'STAFF';
        if (!isPrivileged && ticket.sender_id !== user_id) {
            const error: any = new Error('Forbidden: You cannot access this support ticket');
            error.status = 403;
            throw error;
        }
        return ticket;
    },

    async createTicket(data: Omit<CreateSupportTicketDTO, 'ticket_number'>) {
        // Generate a random ticket number like TCK-1234
        const ticket_number = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTicket = await SupportTicketRepository.createTicket({ ...data, ticket_number });
        
        // Initial message (the description)
        if (data.description) {
            await SupportTicketRepository.createMessage({
                ticket_id: newTicket.id,
                sender_id: data.sender_id,
                sender_role: data.sender_role,
                text: data.description
            });
        }
        
        return newTicket;
    },

    async getTickets(user_id: string, role: string) {
        if (role === 'ADMIN' || role === 'STAFF') {
            return await SupportTicketRepository.getAllTickets();
        } else {
            return await SupportTicketRepository.getTicketsBySender(user_id);
        }
    },

    async getTicketMessages(ticket_id: string, user_id: string, role: string) {
        await this.assertTicketAccess(ticket_id, user_id, role);
        return await SupportTicketRepository.getTicketMessages(ticket_id);
    },

    async replyToTicket(data: CreateTicketMessageDTO, user_id: string, role: string) {
        await this.assertTicketAccess(data.ticket_id, user_id, role);
        return await SupportTicketRepository.createMessage(data);
    },

    async updateTicketStatus(ticket_id: string, status: string, user_id: string, role: string) {
        await this.assertTicketAccess(ticket_id, user_id, role);
        if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
            const error: any = new Error('Invalid support ticket status');
            error.status = 400;
            throw error;
        }
        return await SupportTicketRepository.updateTicketStatus(ticket_id, status);
    }
};
