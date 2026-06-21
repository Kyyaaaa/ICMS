import axiosClient from '@/shared/services/axiosClient';
import type { Invoice, DetailedInvoice, Installment } from '../types/invoice';

type ApiInstallment = {
    id: string;
    status: string;
    amount: number;
    installment_number: number;
    due_date: string;
    payment_method?: string;
    payment_date?: string;
};

type ApiInvoice = {
    id: string;
    invoice_code?: string;
    amount?: number;
    status: string;
    created_at: string;
    invoice_installments?: ApiInstallment[];
    account?: { full_name?: string; email?: string; phone?: string; id?: string };
    classes?: { name?: string; courses?: { title?: string; sessions?: number } };
};

export const InvoicesService = {
    getInvoices: async (params?: { page?: number; limit?: number; status?: string }): Promise<{ data: Invoice[]; total: number }> => {
        try {
            const res = await axiosClient.get<unknown>('/invoices/all', {
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    status: params?.status === 'All' ? undefined : params?.status
                }
            });
            const responseData = (res as { data?: unknown[], total?: number });
            const rawInvoices = (Array.isArray(res) ? res : (responseData.data || [])) as ApiInvoice[];
            const total = responseData.total || rawInvoices.length;
            
            const data = rawInvoices.map((inv) => {
                const totalAmount = inv.amount || 0;
                let paidAmount = 0;
                let paidInstallments = 0;
                
                const installments: Installment[] = (inv.invoice_installments || []).map((inst) => {
                    if (inst.status === 'PAID') {
                        paidAmount += inst.amount;
                        paidInstallments++;
                    }
                    return {
                        id: inst.id,
                        term: `${inst.installment_number}${inst.installment_number === 1 ? 'st' : inst.installment_number === 2 ? 'nd' : inst.installment_number === 3 ? 'rd' : 'th'} Installment`,
                        dueDate: new Date(inst.due_date).toLocaleDateString('en-GB'),
                        status: inst.status === 'PENDING' ? 'Pending' : inst.status === 'PAID' ? 'Paid' : inst.status === 'OVERDUE' ? 'Overdue' : 'Cancelled',
                        method: inst.payment_method || '-',
                        paidDate: inst.payment_date ? new Date(inst.payment_date).toLocaleDateString('en-GB') : null,
                        amount: inst.amount
                    };
                });
                
                // Fix for full payments which do not generate installments
                if (inv.status === 'PAID' && installments.length === 0) {
                    paidAmount = totalAmount;
                    paidInstallments = 1;
                }

                const progress = `${paidInstallments}/${inv.invoice_installments?.length || 1}`;
                const paymentMethod = (inv.invoice_installments?.length || 0) > 1 ? 'Installment' : 'Full';
                
                const displayStatus = inv.status === 'PENDING' ? 'Pending' : inv.status === 'PARTIAL' ? 'Partial' : inv.status === 'PAID' ? 'Paid' : inv.status === 'OVERDUE' ? 'Overdue' : 'Cancelled';
                
                return {
                    id: inv.invoice_code || inv.id,
                    learner: inv.account?.full_name || 'Unknown Learner',
                    course: inv.classes?.courses?.title || 'Unknown Course',
                    paymentMethod,
                    progress,
                    totalAmount: totalAmount.toLocaleString('vi-VN') + ' đ',
                    paidAmount: paidAmount.toLocaleString('vi-VN') + ' đ',
                    date: new Date(inv.created_at).toLocaleDateString('en-GB'),
                    status: displayStatus,
                    installments,
                    rawPaid: paidAmount,
                    rawTotal: totalAmount,
                    rawRemaining: totalAmount - paidAmount
                };
            });
            
            return { data, total };
        } catch (error) {
            console.error('Error fetching invoices', error);
            throw error;
        }
    },
    
    getInvoiceById: async (id: string): Promise<DetailedInvoice | undefined> => {
        try {
            const res = await axiosClient.get<unknown>(`/invoices/${id}`);
            const inv = ((res as { data?: unknown }).data || res) as ApiInvoice;
            
            if (!inv) return undefined;
            
            let paidAmount = 0;
            const installments: Installment[] = (inv.invoice_installments || []).map((inst) => {
                if (inst.status === 'PAID') paidAmount += inst.amount;
                return {
                    id: inst.id,
                    term: `${inst.installment_number}${inst.installment_number === 1 ? 'st' : inst.installment_number === 2 ? 'nd' : inst.installment_number === 3 ? 'rd' : 'th'} Installment`,
                    dueDate: new Date(inst.due_date).toLocaleDateString('en-GB'),
                    status: inst.status === 'PENDING' ? 'Pending' : inst.status === 'PAID' ? 'Paid' : inst.status === 'OVERDUE' ? 'Overdue' : 'Cancelled',
                    method: inst.payment_method || '-',
                    paidDate: inst.payment_date ? new Date(inst.payment_date).toLocaleDateString('en-GB') : null,
                    amount: inst.amount
                };
            });
            
            // Fix for full payments which do not generate installments
            const totalAmount = inv.amount || 0;
            if (inv.status === 'PAID' && installments.length === 0) {
                paidAmount = totalAmount;
            }

            const displayStatus = inv.status === 'PENDING' ? 'Pending' : inv.status === 'PARTIAL' ? 'Partial' : inv.status === 'PAID' ? 'Paid' : inv.status === 'OVERDUE' ? 'Overdue' : 'Cancelled';
            
            return {
                id: inv.invoice_code || inv.id,
                status: displayStatus,
                issueDate: new Date(inv.created_at).toLocaleDateString('en-GB'),
                dueDate: installments.length > 0 ? installments[installments.length - 1].dueDate : new Date(inv.created_at).toLocaleDateString('en-GB'),
                learner: {
                    name: inv.account?.full_name || 'Unknown Learner',
                    email: inv.account?.email || 'N/A',
                    phone: inv.account?.phone || 'N/A',
                    id: inv.account?.id || 'Unknown ID'
                },
                course: {
                    name: inv.classes?.courses?.title || 'Unknown Course',
                    code: inv.classes?.name || 'N/A',
                    duration: `${inv.classes?.courses?.sessions || 0} Sessions`,
                    startDate: 'N/A'
                },
                payment: {
                    method: installments.length > 1 ? `Installment (${installments.length} Terms)` : 'Full Payment',
                    totalAmount,
                    paidAmount,
                    remainingAmount: totalAmount - paidAmount,
                    installments
                }
            };
        } catch (error) {
            console.error('Error fetching invoice by id', error);
            throw error;
        }
    }
};

