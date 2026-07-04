import axiosClient from './axiosClient';

export interface TicketMessage {
    id: string;
    ticket_id: string;
    sender_id: string;
    sender_role: string;
    sender_name?: string;
    text: string;
    created_at: string;
}

export interface SupportTicket {
    id: string;
    ticket_number: string;
    title: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    category: string;
    description: string;
    sender_id: string;
    sender_role: string;
    sender_name?: string;
    last_message?: string;
    last_message_sender_id?: string;
    created_at: string;
    updated_at: string;
    messages?: TicketMessage[];
}

export interface CreateSupportTicketData {
    category: string;
    subject: string;
    description: string;
    sender_id: string;
    sender_role: string;
}

export const SupportTicketService = {
    getTickets: async (userId: string, role: string): Promise<SupportTicket[]> => {
        return axiosClient.get(`/support-tickets?user_id=${userId}&role=${role}`);
    },
    
    getTicketMessages: async (ticketId: string): Promise<TicketMessage[]> => {
        return axiosClient.get(`/support-tickets/${ticketId}/messages`);
    },

    createTicket: async (data: CreateSupportTicketData): Promise<SupportTicket> => {
        return axiosClient.post('/support-tickets', data);
    },

    replyToTicket: async (ticketId: string, text: string, senderId: string, senderRole: string): Promise<TicketMessage> => {
        return axiosClient.post(`/support-tickets/${ticketId}/messages`, {
            text,
            sender_id: senderId,
            sender_role: senderRole
        });
    },

    updateTicketStatus: async (ticket_id: string, status: string) => {
        const response = await axiosClient.patch(`/support-tickets/${ticket_id}/status`, { status });
        return response.data;
    }
};
