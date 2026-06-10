import type { RefundRequest } from '../types/refund';

const MOCK_REFUNDS: RefundRequest[] = [
    {
        id: 'REF-1002',
        invoiceId: 'INV-2024-001',
        installment: 'Installment 2',
        studentName: 'Alex Smith',
        studentEmail: 'alex@example.com',
        courseName: 'IELTS Intensive Mastery',
        totalPaid: 6000000,
        refundAmount: 3000000,
        reason: 'Scheduling conflict due to new job, cannot attend evening sessions anymore.',
        bankName: 'Vietcombank',
        bankAccountName: 'ALEX SMITH',
        bankAccountNumber: '0123456789',
        requestedDate: '2026-05-30T10:00',
        status: 'Pending'
    },
    {
        id: 'REF-1003',
        invoiceId: 'INV-2024-055',
        installment: 'Full Payment',
        studentName: 'Maria Garcia',
        studentEmail: 'maria.g@example.com',
        courseName: 'Basic English Communication',
        totalPaid: 2000000,
        refundAmount: 2000000,
        reason: 'Health issues, requesting full refund before course starts.',
        bankName: 'Techcombank',
        bankAccountName: 'MARIA GARCIA',
        bankAccountNumber: '1903456789',
        requestedDate: '2026-05-28T14:30',
        processedDate: '2026-05-29T09:00',
        status: 'Completed',
        notes: 'Approved and transferred.'
    },
    {
        id: 'REF-1004',
        invoiceId: 'INV-2024-089',
        installment: 'Installment 1',
        studentName: 'David Lee',
        studentEmail: 'david.l@example.com',
        courseName: 'Advanced IELTS Writing',
        totalPaid: 4000000,
        refundAmount: 4000000,
        reason: 'Changed mind, requested refund after 3 sessions (not eligible).',
        bankName: 'MB Bank',
        bankAccountName: 'DAVID LEE',
        bankAccountNumber: '0987654321',
        requestedDate: '2026-05-25T11:15',
        processedDate: '2026-05-26T16:20',
        status: 'Rejected',
        notes: 'Refund policy states no refunds after 2nd session.'
    }
];

export const AdminRefundsService = {
    getRefunds: async (): Promise<RefundRequest[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_REFUNDS]), 300));
    },

    getRefundById: async (id: string): Promise<RefundRequest | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_REFUNDS.find(r => r.id === id)), 300));
    },

    processRefund: async (id: string, newStatus: 'Approved' | 'Completed' | 'Rejected', notes: string): Promise<RefundRequest> => {
        return new Promise((resolve, reject) => setTimeout(() => {
            const index = MOCK_REFUNDS.findIndex(r => r.id === id);
            if (index !== -1) {
                MOCK_REFUNDS[index] = {
                    ...MOCK_REFUNDS[index],
                    status: newStatus,
                    processedDate: new Date().toISOString().slice(0, 16),
                    notes
                };
                resolve(MOCK_REFUNDS[index]);
            } else {
                reject(new Error('Refund not found'));
            }
        }, 300));
    }
};
