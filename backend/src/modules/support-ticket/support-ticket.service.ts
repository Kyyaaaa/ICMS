import { SupportTicketRepository } from './support-ticket.repository';
import { CreateSupportTicketDTO, CreateTicketMessageDTO } from './support-ticket.model';

export const SupportTicketService = {
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

    async getTicketMessages(ticket_id: string) {
        return await SupportTicketRepository.getTicketMessages(ticket_id);
    },

    async replyToTicket(data: CreateTicketMessageDTO) {
        return await SupportTicketRepository.createMessage(data);
    },

    async updateTicketStatus(ticket_id: string, status: string) {
        return await SupportTicketRepository.updateTicketStatus(ticket_id, status);
    }
};
