import type { RefundRequest } from '../types/refund';
import axiosClient from '../../../shared/services/axiosClient';

export const AdminRefundsService = {
    getRefunds: async (): Promise<RefundRequest[]> => {
        try {
            const res = await axiosClient.get('/refunds/admin') as { data: unknown[] };
            return res.data.map((r: unknown) => {
                let installment = 'Refund';
                let reason = r.reason;
                const match = r.reason.match(/^(Term \d+) \| (.*)$/);
                if (match) {
                    installment = match[1];
                    reason = match[2];
                }
                
                return {
                    id: r.refund_code,
                    invoiceId: r.invoices?.invoice_code || r.invoice_id,
                    installment: installment,
                    studentName: r.account?.full_name,
                    studentEmail: r.account?.email,
                    courseName: r.invoices?.classes?.courses?.title || 'Unknown Course',
                    totalPaid: r.amount,
                    refundAmount: r.amount,
                    reason: reason,
                    bankName: r.bank_name,
                    bankAccountName: r.bank_account_name,
                    bankAccountNumber: r.bank_account_number,
                    requestedDate: r.created_at,
                    processedDate: r.processed_at,
                    status: r.status === 'PENDING' ? 'Pending' : r.status === 'APPROVED' ? 'Approved' : r.status === 'REJECTED' ? 'Rejected' : 'Completed',
                    notes: r.admin_notes,
                    dbId: r.id
                };
            });
        } catch {
            return [];
        }
    },

    getRefundById: async (id: string): Promise<RefundRequest | null> => {
        const all = await AdminRefundsService.getRefunds();
        return all.find(r => r.id === id) || null;
    },

    updateStatus: async (dbId: string, status: 'APPROVED' | 'REJECTED' | 'COMPLETED', notes: string): Promise<boolean> => {
        try {
            await axiosClient.patch(`/refunds/admin/${dbId}/status`, { status, admin_notes: notes });
            return true;
        } catch {
            return false;
        }
    }
};
