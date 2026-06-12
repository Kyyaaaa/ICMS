import type { PaymentInvoice, PaymentCourseInfo, PaymentClassInfo } from '../types/payment';

const MOCK_INVOICES: PaymentInvoice[] = [
    { id: 'INV-2024-001', course: 'IELTS Intensive 6.5+ (Reading)', date: '01-10-2024', amount: 4500000, discount: 500000, status: 'paid' },
    { id: 'INV-2024-002', course: 'IELTS Intensive 6.5+ (Writing)', date: '15-10-2024', amount: 4500000, status: 'pending' },
    { id: 'INV-2024-003', course: 'IELTS Foundation 5.0+ (Speaking)', date: '10-09-2024', amount: 3500000, status: 'refunded' },
    { id: 'INV-2024-004', course: 'IELTS Mastery 7.0+ (Listening)', date: '20-10-2024', amount: 4000000, status: 'cancelled' },
    { id: 'INV-2024-005', course: 'IELTS Basic 4.5+ (All Skills)', date: '25-10-2024', amount: 5500000, status: 'expired' },
    { 
        id: 'INV-2024-006', 
        course: 'IELTS Advanced 8.0+ (Installment Plan)', 
        date: '28-10-2024', 
        amount: 5400000, 
        discount: 600000,
        status: 'partial',
        installments: [
            { id: 'TXN-001', amount: 1800000, dueDate: '28-10-2024', status: 'paid', paidDate: '28-10-2024' },
            { id: 'TXN-002', amount: 1800000, dueDate: '28-11-2024', status: 'pending' },
            { id: 'TXN-003', amount: 1800000, dueDate: '28-12-2024', status: 'pending' }
        ]
    },
    { 
        id: 'INV-2024-008', 
        course: 'IELTS Foundation 5.0+ (Refunded Plan)', 
        date: '10-09-2024', 
        amount: 6000000, 
        status: 'refunded',
        installments: [
            { id: 'TXN-004', amount: 2000000, dueDate: '10-09-2024', status: 'refunded', paidDate: '10-09-2024' },
            { id: 'TXN-005', amount: 2000000, dueDate: '10-10-2024', status: 'cancelled' },
            { id: 'TXN-006', amount: 2000000, dueDate: '10-11-2024', status: 'cancelled' }
        ]
    },
    { 
        id: 'INV-2024-009', 
        course: 'IELTS Mastery 7.0+ (Quit midway)', 
        date: '01-09-2024', 
        amount: 6000000, 
        status: 'cancelled',
        installments: [
            { id: 'TXN-007', amount: 2000000, dueDate: '01-09-2024', status: 'paid', paidDate: '01-09-2024' },
            { id: 'TXN-008', amount: 2000000, dueDate: '01-10-2024', status: 'cancelled' },
            { id: 'TXN-009', amount: 2000000, dueDate: '01-11-2024', status: 'cancelled' }
        ]
    },
];

export const LearnerPaymentsService = {
    getInvoices: async (): Promise<PaymentInvoice[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_INVOICES]), 200));
    },

    getInvoiceById: async (id: string): Promise<PaymentInvoice | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_INVOICES.find(inv => inv.id === id) || MOCK_INVOICES[0]), 200));
    },

    getCourseInfo: async (): Promise<PaymentCourseInfo> => {
        return new Promise(resolve => setTimeout(() => resolve({
            title: 'IELTS Intensive Mastery',
            duration: '12 Weeks',
            sessions: 48,
            price: 900000,
            format: 'Offline',
            band: '7.5 - 8.0'
        }), 200));
    },

    getClassInfo: async (): Promise<PaymentClassInfo> => {
        return new Promise(resolve => setTimeout(() => resolve({
            name: 'Class IELTS-A01',
            schedule: 'Mon, Wed 18:00 - 20:00',
            room: 'Room 302',
            currentStudents: 12,
            maxStudents: 15
        }), 200));
    },
    
    processPayment: async (_invoiceId: string, _amount: number): Promise<boolean> => {
        return new Promise(resolve => setTimeout(() => resolve(true), 2000));
    },

    requestRefund: async (_invoiceId: string, _reason: string, _details?: string): Promise<boolean> => {
        return new Promise(resolve => setTimeout(() => resolve(true), 1500));
    }
};
