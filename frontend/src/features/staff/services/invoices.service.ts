import type { Invoice, DetailedInvoice } from '../types/invoice';

const MOCK_INVOICES: Invoice[] = [
    {
        id: 'INV-10024',
        learner: 'Alex Johnson',
        course: 'IELTS Intensive Mastery',
        paymentMethod: 'Full',
        progress: '1/1',
        totalAmount: '500 đ',
        paidAmount: '500 đ',
        date: '24-10-2026',
        status: 'Paid',
        installments: [
            { id: '1', term: 'Full Payment', dueDate: '24-10-2026', status: 'Paid', method: 'Credit Card (*4421)', paidDate: '24-10-2026', amount: 500.00 }
        ],
        rawPaid: 500,
        rawTotal: 500,
        rawRemaining: 0
    },
    {
        id: 'INV-10025',
        learner: 'Sarah Connor',
        course: 'TOEIC Target 700+',
        paymentMethod: 'Installment',
        progress: '2/3',
        totalAmount: '300 đ',
        paidAmount: '200 đ',
        date: '22-10-2026',
        status: 'Partial',
        installments: [
            { id: '1', term: '1st Installment (Deposit)', dueDate: '01-10-2026', status: 'Paid', method: 'Credit Card (*4421)', paidDate: '01-10-2026', amount: 100.00 },
            { id: '2', term: '2nd Installment', dueDate: '01-11-2026', status: 'Paid', method: 'Bank Transfer', paidDate: '22-10-2026', amount: 100.00 },
            { id: '3', term: '3rd Installment (Final)', dueDate: '01-12-2026', status: 'Pending', method: '', paidDate: null, amount: 100.00 }
        ],
        rawPaid: 200,
        rawTotal: 300,
        rawRemaining: 100
    },
    {
        id: 'INV-10026',
        learner: 'Michael Smith',
        course: 'Basic Communication',
        paymentMethod: 'Installment',
        progress: '1/2',
        totalAmount: '200 đ',
        paidAmount: '100 đ',
        date: '10-09-2026',
        status: 'Overdue',
        installments: [
            { id: '1', term: '1st Installment (Deposit)', dueDate: '01-09-2026', status: 'Paid', method: 'Bank Transfer', paidDate: '10-09-2026', amount: 100.00 },
            { id: '2', term: '2nd Installment', dueDate: '01-10-2026', status: 'Overdue', method: '', paidDate: null, amount: 100.00 }
        ],
        rawPaid: 100,
        rawTotal: 200,
        rawRemaining: 100
    }
];

const MOCK_DETAILED_INVOICE: DetailedInvoice = {
    id: 'INV-10025',
    status: 'Partial',
    issueDate: '01-10-2026',
    dueDate: '01-12-2026',
    
    learner: {
        name: 'Sarah Connor',
        email: 'sarah.c@example.com',
        phone: '+1 987 654 321',
        id: 'L-8842'
    },
    
    course: {
        name: 'TOEIC Target 700+',
        code: 'TOEIC-B01',
        duration: '16 Weeks',
        startDate: '15-10-2026'
    },
    
    payment: {
        method: 'Installment (3 Terms)',
        totalAmount: 300.00,
        paidAmount: 200.00,
        remainingAmount: 100.00,
        installments: [
            { id: '1', term: '1st Installment (Deposit)', amount: 100.00, dueDate: '01-10-2026', paidDate: '01-10-2026', status: 'Paid', method: 'Credit Card (*4421)' },
            { id: '2', term: '2nd Installment', amount: 100.00, dueDate: '01-11-2026', paidDate: '22-10-2026', status: 'Paid', method: 'Bank Transfer' },
            { id: '3', term: '3rd Installment (Final)', amount: 100.00, dueDate: '01-12-2026', paidDate: null, status: 'Pending', method: '-' },
        ]
    }
};

export const InvoicesService = {
    getInvoices: async (): Promise<Invoice[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_INVOICES]), 200));
    },
    getInvoiceById: async (id: string): Promise<DetailedInvoice | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve({ ...MOCK_DETAILED_INVOICE, id }), 200));
    }
};

