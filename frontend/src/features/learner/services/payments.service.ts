import type { PaymentInvoice, PaymentCourseInfo, PaymentClassInfo, PaymentInstallment } from '../types/payment';
import axiosClient from '@/shared/services/axiosClient';

export const LearnerPaymentsService = {
    getInvoices: async (): Promise<PaymentInvoice[]> => {
        try {
            const res = await axiosClient.get('/invoices') as { data: { id: string; invoice_code: string; amount: number; created_at: string; status: string; classes?: { courses?: { title: string } }; account?: { full_name?: string; email?: string } }[] };
            const data = res.data;
            return data.map((inv) => ({
                id: inv.invoice_code || inv.id,
                course: inv.classes?.courses?.title || 'Unknown Course',
                date: new Date(inv.created_at).toLocaleDateString('en-GB'),
                amount: inv.amount,
                discount: 0,
                status: inv.status.toLowerCase() as PaymentInvoice['status'],
                learnerName: inv.account?.full_name,
                learnerEmail: inv.account?.email
            }));
        } catch (error) {
            console.error("Failed to fetch invoices", error);
            return [];
        }
    },

    getInvoiceById: async (id: string): Promise<PaymentInvoice | undefined> => {
        try {
            const res = await axiosClient.get(`/invoices/${id}`) as { data: { id: string; invoice_code: string; amount: number; created_at: string; status: string; classes?: { courses?: { title: string } }; account?: { full_name?: string; email?: string }; invoice_installments?: { id: string; installment_number: number; amount: number; due_date: string; status: string; paid_date?: string }[] } };
            const inv = res.data;
            if (!inv) return undefined;

            const mappedInstallments = inv.invoice_installments?.map((inst: { id: string; installment_number: number; amount: number; due_date: string; status: string; paid_date?: string }) => ({
                id: inst.id,
                installmentNumber: inst.installment_number,
                amount: inst.amount,
                dueDate: new Date(inst.due_date).toLocaleDateString('en-GB'),
                status: inst.status.toLowerCase() as PaymentInstallment['status'],
                paidDate: inst.paid_date ? new Date(inst.paid_date).toLocaleDateString('en-GB') : undefined
            })) || [];

            return {
                id: inv.invoice_code || inv.id,
                course: inv.classes?.courses?.title || 'Unknown Course',
                date: new Date(inv.created_at).toLocaleDateString('en-GB'),
                amount: inv.amount,
                discount: 0,
                status: inv.status.toLowerCase() as PaymentInvoice['status'],
                installments: mappedInstallments,
                learnerName: inv.account?.full_name,
                learnerEmail: inv.account?.email,
                createdAt: inv.created_at
            };
        } catch {
            return undefined;
        }
    },

    cancelInvoice: async (invoiceId: string): Promise<boolean> => {
        try {
            await axiosClient.put(`/invoices/${invoiceId}/cancel`);
            return true;
        } catch (error) {
            console.error("Failed to cancel invoice", error);
            throw error;
        }
    },

    getCheckoutInvoice: async (invoiceId: string) => {
        const res = await axiosClient.get(`/invoices/${invoiceId}`) as { data: PaymentInvoice };
        return res.data;
    },

    getVnpayUrl: async (invoiceId: string, paymentPlan: string = 'full') => {
        const res = await axiosClient.post('/payments/vnpay/create-url', { invoice_id: invoiceId, payment_plan: paymentPlan }) as { data: { paymentUrl: string } };
        return res.data.paymentUrl;
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
