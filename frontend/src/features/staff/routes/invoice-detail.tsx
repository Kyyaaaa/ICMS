import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, DollarSign, User, BookOpen, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { DetailedInvoice } from '../types/invoice';
import { InvoicesService } from '../services/invoices.service';

const InvoiceDetail = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<DetailedInvoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInvoice = async () => {
            if (id) {
                const data = await InvoicesService.getInvoiceById(id);
                if (data) setInvoice(data);
            }
            setLoading(false);
        };
        loadInvoice();
    }, [id]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'Partial': return 'bg-blue-100 text-[#0061a5] border-blue-200';
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-4 h-4" />;
            case 'Partial': return <Clock className="w-4 h-4" />;
            case 'Overdue': return <AlertCircle className="w-4 h-4" />;
            case 'Pending': return <Clock className="w-4 h-4" />;
            default: return null;
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading invoice details...</div>;
    }

    if (!invoice) {
        return <div className="text-center py-10">Invoice not found.</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in-up max-w-250 mx-auto pb-12">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <Link to="/staff/invoices" className="text-[#74777f] hover:text-[#002045] font-semibold flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Invoices
                </Link>
                {/* Buttons removed as requested */}
            </div>

            {/* Main Invoice Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                {/* Top Banner */}
                <div className="bg-[#f8f9fa] p-8 border-b border-[#e0e3e5] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-[#002045]">Invoice {invoice.id}</h1>
                            <span className={`px-3 py-1 border rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusStyle(invoice.status)}`}>
                                {getStatusIcon(invoice.status)} {invoice.status}
                            </span>
                        </div>
                        <div className="text-[#43474e] flex flex-wrap items-center gap-4 text-sm">
                            <span>Issue Date: <strong className="text-[#181c1e]">{invoice.issueDate}</strong></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c4c6cf]"></span>
                            <span>Due Date: <strong className="text-[#181c1e]">{invoice.dueDate}</strong></span>
                        </div>
                    </div>
                    
                    <div className="text-left md:text-right">
                        <div className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">Total Amount</div>
                        <div className="text-4xl font-extrabold text-[#0061a5] leading-none">{invoice.payment.totalAmount.toLocaleString()} đ</div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#e0e3e5]">
                    {/* Billed To */}
                    <div>
                        <h3 className="text-sm font-bold text-[#74777f] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> Billed To
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="font-extrabold text-[#002045] text-lg">{invoice.learner.name}</div>
                            <div className="text-[#43474e]">Learner ID: {invoice.learner.id}</div>
                            <div className="text-[#43474e]">{invoice.learner.email}</div>
                            {invoice.learner.phone !== 'N/A' && <div className="text-[#43474e]">{invoice.learner.phone}</div>}
                        </div>
                    </div>

                    {/* Course Summary */}
                    <div>
                        <h3 className="text-sm font-bold text-[#74777f] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Course Information
                        </h3>
                        <div className="bg-[#f8f9fa] rounded-xl p-5 border border-[#e0e3e5] space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-[#002045] text-base">{invoice.course.name}</div>
                                <span className="bg-[#e6f0fa] text-[#0061a5] text-xs font-bold px-2 py-1 rounded">{invoice.course.code}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#43474e]">
                                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#74777f]" /> Starts: {invoice.course.startDate}</div>
                                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#74777f]" /> {invoice.course.duration}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-extrabold text-[#002045] flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#0061a5]" /> {invoice.payment.method === 'Full Payment' ? 'Payment Details' : 'Installment Breakdown'}
                        </h3>
                        <span className="text-sm font-bold text-[#43474e] bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                            Payment Method: <span className="text-[#002045]">{invoice.payment.method}</span>
                        </span>
                    </div>

                    <div className="border border-[#e0e3e5] rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Term / Description</th>
                                    <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Due Date</th>
                                    <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Payment Info</th>
                                    <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.payment.installments.map((inst, index) => (
                                    <tr key={inst.id} className={index !== invoice.payment.installments.length - 1 ? "border-b border-[#e0e3e5]" : ""}>
                                        <td className="p-4 font-bold text-[#002045]">{inst.term}</td>
                                        <td className="p-4 text-[#43474e]">{inst.dueDate}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 border rounded-md text-xs font-bold ${getStatusStyle(inst.status)}`}>
                                                {getStatusIcon(inst.status)} {inst.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {inst.status === 'Paid' ? (
                                                <div className="text-xs text-[#002045] font-semibold">
                                                    Paid on {inst.paidDate}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-[#74777f] italic">Awaiting Payment</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right font-bold text-[#181c1e]">
                                            {inst.amount.toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-[#f8f9fa] border-t border-[#e0e3e5]">
                                <tr>
                                    <td colSpan={4} className="p-4 text-right font-bold text-[#43474e]">Total Paid</td>
                                    <td className="p-4 text-right font-bold text-green-600">{invoice.payment.paidAmount.toLocaleString()} đ</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="p-4 text-right font-extrabold text-[#002045] text-base">Remaining Balance</td>
                                    <td className="p-4 text-right font-extrabold text-[#0061a5] text-lg">{invoice.payment.remainingAmount.toLocaleString()} đ</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                
                {/* Footer Notes */}
                <div className="bg-gray-50 p-6 border-t border-[#e0e3e5] text-center text-xs text-[#74777f]">
                    <p>This invoice is generated automatically by ICMS Financial System.</p>
                    <p>For any questions regarding this invoice, please contact the support team or open a support ticket.</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;
