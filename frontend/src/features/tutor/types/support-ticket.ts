export interface TicketMessage {
    id: number;
    sender: 'user' | 'support';
    text: string;
    time: string;
}

export interface SupportTicket {
    id: string;
    title: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    category: string;
    updatedAt: string;
    messages: TicketMessage[];
}

export interface CreateSupportTicketData {
    category: string;
    subject: string;
    description: string;
}
