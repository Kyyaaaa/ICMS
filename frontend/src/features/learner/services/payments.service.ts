import type { PaymentInvoice, PaymentCourseInfo, PaymentClassInfo } from '../types/payment';

const MOCK_INVOICES: PaymentInvoice[] = [
    { id: 'INV-2024-001', course: 'IELTS Intensive 6.5+ (Reading)', date: '01-10-2024', amount: 4500000, status: 'paid' },
    { id: 'INV-2024-002', course: 'IELTS Intensive 6.5+ (Writing)', date: '15-10-2024', amount: 4500000, status: 'pending' },
    { id: 'INV-2024-003', course: 'IELTS Foundation 5.0+ (Speaking)', date: '10-09-2024', amount: 3500000, status: 'refunded' },
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
