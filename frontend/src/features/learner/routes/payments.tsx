import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { PaymentInvoice } from '../types/payment';
import { LearnerPaymentsService } from '../services/payments.service';
import { Pagination } from '@/shared/components/common/Pagination';

const PaymentHistory = () => {
    const [invoices, setInvoices] = useState<PaymentInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchInvoices = async () => {
            const data = await LearnerPaymentsService.getInvoices();
            setInvoices(data);
            setLoading(false);
        };
        fetchInvoices();
    }, []);



    const getStatusBadge = (inv: PaymentInvoice) => {
        if (inv.hasPendingRefund) {
            return <span className="px-3 py-1.5 bg-[#fff3e0] text-[#e65100] text-xs font-black rounded-full uppercase tracking-widest border border-[#e65100]/20 shadow-sm animate-pulse">Refund Pending</span>;
        }
        switch (inv.status) {
            case 'paid': return <span className="px-3 py-1.5 bg-[#e6f4ea] text-[#137333] text-xs font-black rounded-full uppercase tracking-widest border border-[#137333]/20 shadow-sm">Paid</span>;
            case 'partial': return <span className="px-3 py-1.5 bg-[#e3f2fd] text-[#0061a5] text-xs font-black rounded-full uppercase tracking-widest border border-[#0061a5]/20 shadow-sm">Partially Paid</span>;
            case 'pending': return <span className="px-3 py-1.5 bg-[#fff8e1] text-[#b45309] text-xs font-black rounded-full uppercase tracking-widest border border-[#b45309]/20 shadow-sm animate-pulse">Pending</span>;
            case 'refunded': return <span className="px-3 py-1.5 bg-[#fce8e8] text-[#c53030] text-xs font-black rounded-full uppercase tracking-widest border border-[#c53030]/20 shadow-sm">Refunded</span>;
            case 'cancelled': return <span className="px-3 py-1.5 bg-[#f1f4f6] text-[#74777f] text-xs font-black rounded-full uppercase tracking-widest border border-[#c4c6cf]/50 shadow-sm">Cancelled</span>;
            case 'expired': return <span className="px-3 py-1.5 bg-[#fce8e8] text-[#c53030] text-xs font-black rounded-full uppercase tracking-widest border border-[#c53030]/20 shadow-sm">Expired</span>;
            default: return null;
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading payments...</div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-in-up pb-12">
            {/* Clean Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#002045] leading-tight">Payment History</h1>
                    <p className="text-sm text-[#43474e] max-w-lg">View your past transactions, download receipts, and manage pending payments.</p>
                </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef0f4] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-225">
                        <thead>
                            <tr className="bg-[#f8f9fc] border-b border-[#eef0f4]">
                                <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Invoice ID</th>
                                <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Course</th>
                                <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.slice((currentPage - 1) * limit, currentPage * limit).map((inv) => (
                                <tr key={inv.id} className="border-b border-[#eef0f4] last:border-0 hover:bg-[#fcfdfd] transition-colors group">
                                    <td className="py-5 px-6 font-bold text-[#002045]">{inv.id}</td>
                                    <td className="py-5 px-6 font-semibold text-slate-700">{inv.course}</td>
                                    <td className="py-5 px-6 text-slate-500 font-medium">{inv.date}</td>
                                    <td className="py-5 px-6 font-black text-slate-900">{inv.amount.toLocaleString('vi-VN')} đ</td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(inv)}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/learner/payments/${inv.id}`} className="inline-block px-5 py-2.5 bg-white border border-[#002045]/20 text-[#002045] text-xs font-bold rounded-xl hover:bg-[#f8f9fc] hover:border-[#002045]/50 transition-all">
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <Pagination
                    currentPage={currentPage}
                    totalItems={invoices.length}
                    itemsPerPage={limit}
                    onPageChange={setCurrentPage}
                    itemName="payments"
                />
            </div>
        </div>
    );
};

export default PaymentHistory;
