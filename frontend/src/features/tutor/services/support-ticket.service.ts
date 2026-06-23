import type { SupportTicket, CreateSupportTicketData, TicketMessage } from '../types/support-ticket';

const MOCK_TICKETS: SupportTicket[] = [
    {
        id: 'TCK-2041',
        title: 'Projector not working in Room 302',
        status: 'Open',
        category: 'Facility & Equipment',
        updatedAt: '10 mins ago',
        messages: [
            { id: 1, sender: 'user', text: 'Hi, I am currently teaching in Room 302 and the projector won\'t turn on. Please send IT support.', time: '18:05' }
        ]
    },
    {
        id: 'TCK-1981',
        title: 'Salary discrepancy for last month',
        status: 'In Progress',
        category: 'Payroll',
        updatedAt: 'Yesterday',
        messages: [
            { id: 1, sender: 'user', text: 'Hello, my teaching hours for the TOEIC Prep class on May 15th seem to be missing from the payroll.', time: 'May 20, 09:00 AM' },
            { id: 2, sender: 'support', text: 'Hi, we are checking the logs. We will get back to you shortly.', time: 'May 20, 10:15 AM' }
        ]
    },
    {
        id: 'TCK-1855',
        title: 'Air conditioning issue in Room 201',
        status: 'Resolved',
        category: 'Facility & Equipment',
        updatedAt: 'May 10',
        messages: [
            { id: 1, sender: 'user', text: 'The AC is leaking water near the whiteboard.', time: 'May 09, 02:00 PM' },
            { id: 2, sender: 'support', text: 'Thank you for reporting. Maintenance has fixed the issue.', time: 'May 10, 09:00 AM' },
            { id: 3, sender: 'user', text: 'Great, thanks!', time: 'May 10, 09:15 AM' }
        ]
    }
];

export const SupportTicketService = {
    getTickets: async (): Promise<SupportTicket[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_TICKETS), 200));
    },
    createTicket: async (data: CreateSupportTicketData): Promise<SupportTicket> => {
        return new Promise(resolve => setTimeout(() => {
            const newTicket: SupportTicket = {
                id: `TCK-${Math.floor(Math.random() * 9000) + 1000}`,
                title: data.subject,
                status: 'Open',
                category: data.category,
                updatedAt: 'Just now',
                messages: [
                    { id: 1, sender: 'user', text: data.description, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
                ]
            };
            resolve(newTicket);
        }, 200));
    },
    replyToTicket: async (_ticketId: string, text: string): Promise<TicketMessage> => {
        return new Promise(resolve => setTimeout(() => {
            const newMsg: TicketMessage = {
                id: Date.now(),
                sender: 'user',
                text,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            resolve(newMsg);
        }, 200));
    },
    resolveTicket: async (_ticketId: string): Promise<void> => {
        return new Promise(resolve => setTimeout(() => resolve(), 200));
    }
};
