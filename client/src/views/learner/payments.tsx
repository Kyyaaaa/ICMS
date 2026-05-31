import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentHistory = () => {
    const invoices = [
        { id: 'INV-2024-001', course: 'IELTS Academic - Reading', date: 'Oct 01, 2024', amount: 450, status: 'paid' },
        { id: 'INV-2024-002', course: 'IELTS Academic - Writing', date: 'Oct 15, 2024', amount: 450, status: 'pending' },
        { id: 'INV-2024-003', course: 'IELTS General - Speaking', date: 'Sep 10, 2024', amount: 350, status: 'refunded' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle2 className="w-4 h-4 text-[#0061a5]" />;
            case 'pending': return <Clock className="w-4 h-4 text-[#c9a82c]" />;
            case 'refunded': return <XCircle className="w-4 h-4 text-[#ba1a1a]" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid': return <span className="px-[8px] py-[4px] bg-[#d2e4ff] text-[#0061a5] text-[12px] font-bold rounded uppercase">Paid</span>;
            case 'pending': return <span className="px-[8px] py-[4px] bg-[#fff8e1] text-[#c9a82c] text-[12px] font-bold rounded uppercase">Pending</span>;
            case 'refunded': return <span className="px-[8px] py-[4px] bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-bold rounded uppercase">Refunded</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-[24px] max-w-6xl animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Payment History</h1>
            
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Invoice ID</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Course</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Date</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Amount</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Status</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc] transition-colors">
                                    <td className="py-[16px] px-[24px] font-medium text-[#181c1e]">{inv.id}</td>
                                    <td className="py-[16px] px-[24px] text-[#43474e]">{inv.course}</td>
                                    <td className="py-[16px] px-[24px] text-[#43474e]">{inv.date}</td>
                                    <td className="py-[16px] px-[24px] font-bold text-[#181c1e]">${inv.amount.toFixed(2)}</td>
                                    <td className="py-[16px] px-[24px]">
                                        <div className="flex items-center gap-[8px]">
                                            {getStatusIcon(inv.status)}
                                            {getStatusBadge(inv.status)}
                                        </div>
                                    </td>
                                    <td className="py-[16px] px-[24px] text-right">
                                        {inv.status === 'pending' && (
                                            <Link to={`/learner/payments/${inv.id}/checkout`} className="inline-block px-[16px] py-[6px] bg-[#ba1a1a] text-white text-[12px] font-semibold rounded hover:bg-[#93000a] transition-colors">
                                                Pay Now
                                            </Link>
                                        )}
                                        {inv.status === 'paid' && (
                                            <Link to={`/learner/payments/${inv.id}/refund`} className="inline-block px-[16px] py-[6px] bg-white border border-[#002045] text-[#002045] text-[12px] font-semibold rounded hover:bg-[#d2e4ff] transition-colors">
                                                Request Refund
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
