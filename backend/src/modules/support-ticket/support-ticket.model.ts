export interface SupportTicket {
    id: string;
    ticket_number: string;
    title: string;
    category: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    sender_id: string;
    sender_role: string;
    sender_name?: string;
    last_message?: string;
    last_message_sender_id?: string;
    created_at: Date;
    updated_at: Date;
}

export interface TicketMessage {
    id: string;
    ticket_id: string;
    sender_id: string;
    sender_role: string;
    text: string;
    created_at: Date;
}

export interface CreateSupportTicketDTO {
    ticket_number: string;
    title: string;
    category: string;
    description: string;
    sender_id: string;
    sender_role: string;
}

export interface CreateTicketMessageDTO {
    ticket_id: string;
    sender_id: string;
    sender_role: string;
    text: string;
}
