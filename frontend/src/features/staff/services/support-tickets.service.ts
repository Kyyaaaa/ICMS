import type { SupportTicket } from '../types/support-ticket';

const mockTickets: SupportTicket[] = [
    {
        id: 'TCK-1042',
        title: 'Cannot access material for Writing Task 2',
        status: 'Open',
        category: 'Technical Issue',
        updatedAt: '10 mins ago',
        userName: 'Alex Johnson',
        userRole: 'Learner',
        messages: [
            { id: 1, sender: 'user', text: 'Hi, I am enrolled in the IELTS Intensive Mastery but I cannot download the PDF for week 3 Writing Task 2. It shows an error 404.', time: '10:30 AM' }
        ]
    },
    {
        id: 'TCK-0981',
        title: 'Request to change class schedule',
        status: 'In Progress',
        category: 'Course Management',
        updatedAt: 'Yesterday',
        userName: 'Dr. Sarah Connor',
        userRole: 'Tutor',
        messages: [
            { id: 1, sender: 'user', text: 'I would like to move from Class 1 to Class 2 if possible.', time: 'Oct 24, 09:00 AM' },
            { id: 2, sender: 'support', text: 'Hello! Let me check the availability for Class 2. I will get back to you shortly.', time: 'Oct 24, 10:15 AM' }
        ]
    },
    {
        id: 'TCK-0855',
        title: 'Payment receipt not received',
        status: 'Resolved',
        category: 'Billing',
        updatedAt: 'Oct 20',
        userName: 'Michael Smith',
        userRole: 'Learner',
        messages: [
            { id: 1, sender: 'user', text: 'I paid for the course but haven\'t received the email receipt.', time: 'Oct 19, 02:00 PM' },
            { id: 2, sender: 'support', text: 'We apologize for the delay. The receipt has been resent to your registered email.', time: 'Oct 20, 09:00 AM' },
            { id: 3, sender: 'user', text: 'Got it, thanks!', time: 'Oct 20, 09:15 AM' }
        ]
    }
];

export const SupportTicketsService = {
    getTickets: async (): Promise<SupportTicket[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...mockTickets]), 200));
    },

    updateTicket: async (_updatedTicket: SupportTicket): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 200));
    }
};
