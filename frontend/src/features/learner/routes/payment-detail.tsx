import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { LearnerPaymentsService } from '../services/payments.service';
import type { PaymentInvoice } from '../types/payment';

const PaymentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (id) {
                const data = await LearnerPaymentsService.getInvoiceById(id);
                if (data) {
                    setInvoice(data);
                }
            }
            setLoading(false);
        };
        fetchInvoice();
    }, [id]);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'paid':
                return {
                    color: 'text-[#137333]',
                    bg: 'bg-[#e6f4ea]',
                    border: 'border-[#137333]/20',
                    icon: <CheckCircle2 className="w-5 h-5 text-[#137333]" />,
                    label: 'Paid',
                    message: 'This invoice has been successfully paid.'
                };
            case 'pending':
                return {
                    color: 'text-[#b45309]',
                    bg: 'bg-[#fff8e1]',
                    border: 'border-[#b45309]/20',
                    icon: <Clock className="w-5 h-5 text-[#b45309]" />,
                    label: 'Pending',
                    message: 'This invoice is pending payment. Please complete your payment soon.'
                };
            case 'refunded':
                return {
                    color: 'text-[#c53030]',
                    bg: 'bg-[#fce8e8]',
                    border: 'border-[#c53030]/20',
                    icon: <RefreshCw className="w-5 h-5 text-[#c53030]" />,
                    label: 'Refunded',
                    message: 'The amount for this invoice has been refunded to your original payment method.'
                };
            case 'cancelled':
                return {
                    color: 'text-[#74777f]',
                    bg: 'bg-[#f1f4f6]',
                    border: 'border-[#c4c6cf]/50',
                    icon: <XCircle className="w-5 h-5 text-[#74777f]" />,
                    label: 'Cancelled',
                    message: 'This invoice was cancelled by you.'
                };
            case 'partial':
                return {
                    color: 'text-[#0061a5]',
                    bg: 'bg-[#e3f2fd]',
                    border: 'border-[#0061a5]/20',
                    icon: <Clock className="w-5 h-5 text-[#0061a5]" />,
                    label: 'Partially Paid',
                    message: 'This invoice has been partially paid. You have upcoming installments.'
                };
            case 'expired':
                return {
                    color: 'text-[#c53030]',
                    bg: 'bg-[#fce8e8]',
                    border: 'border-[#c53030]/20',
                    icon: <AlertCircle className="w-5 h-5 text-[#c53030]" />,
                    label: 'Expired',
                    message: 'This invoice has expired due to non-payment within the required time (30 minutes).'
                };
            default:
                return {
                    color: 'text-gray-500',
                    bg: 'bg-gray-100',
                    border: 'border-gray-200',
                    icon: <FileText className="w-5 h-5 text-gray-500" />,
                    label: 'Unknown',
                    message: 'Invoice status unknown.'
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="text-center py-20 animate-fade-in-up">
                <div className="w-20 h-20 bg-[#f1f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-[#c4c6cf]" />
                </div>
                <h2 className="text-2xl font-bold text-[#002045] mb-2">Invoice Not Found</h2>
                <p className="text-[#74777f] mb-6">The invoice you are looking for does not exist or has been removed.</p>
                <button onClick={() => navigate('/learner/payments')} className="px-6 py-2.5 bg-[#0061a5] text-white font-bold rounded-xl hover:bg-[#004a77] transition-all">
                    Back to Payments
                </button>
            </div>
        );
    }

    const statusInfo = getStatusInfo(invoice.status);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-12">
            <button 
                onClick={() => navigate('/learner/payments')}
                className="flex items-center gap-2 text-[#43474e] hover:text-[#0061a5] font-semibold transition-colors w-fit"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Payment History</span>
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-[#eef0f4] overflow-hidden">
                {/* Header Section */}
                <div className="p-8 border-b border-[#eef0f4] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#002045] mb-2">Invoice {invoice.id}</h1>
                        <p className="text-[#74777f] flex items-center gap-2 font-medium">
                            <span>Issued on: {invoice.date}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} font-bold text-xs uppercase tracking-widest`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                        </span>
                    </div>
                </div>

                {/* Status Message */}
                <div className={`px-8 py-4 ${statusInfo.bg} border-b ${statusInfo.border} flex items-start gap-3`}>
                    <div className="mt-0.5">{statusInfo.icon}</div>
                    <p className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.message}</p>
                </div>

                {/* Invoice Details */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Billed To</h3>
                            <p className="text-base font-bold text-[#002045]">Learner User</p>
                            <p className="text-[#74777f] text-sm mt-1">learner@example.com</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Payment Method</h3>
                            {invoice.status === 'paid' || invoice.status === 'refunded' ? (
                                <p className="text-sm font-medium text-[#181c1e] flex items-center gap-2">
                                    <span className="w-8 h-5 bg-[#002045] rounded flex items-center justify-center text-white text-xs font-bold">VNPAY</span>
                                    Online Banking
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-[#74777f] italic">Not selected yet</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-[#f8f9fc] rounded-2xl p-6 border border-[#eef0f4]">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Order Summary</h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4 pb-4 border-b border-[#eef0f4]">
                                <div>
                                    <p className="font-bold text-[#181c1e] text-sm">{invoice.course}</p>
                                    <p className="text-xs text-[#74777f] mt-1">Tuition Fee</p>
                                </div>
                                <p className="font-semibold text-[#181c1e] whitespace-nowrap">{invoice.amount.toLocaleString('vi-VN')} đ</p>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm text-[#74777f]">
                                <span>Subtotal</span>
                                <span>{(invoice.amount + (invoice.discount || 0)).toLocaleString('vi-VN')} đ</span>
                            </div>
                            {invoice.discount && (
                                <div className="flex justify-between items-center text-sm text-[#137333]">
                                    <span>Discount applied</span>
                                    <span>-{invoice.discount.toLocaleString('vi-VN')} đ</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-sm text-[#74777f]">
                                <span>Tax (0%)</span>
                                <span>0 đ</span>
                            </div>
                            
                            <div className="pt-4 border-t border-[#eef0f4] flex justify-between items-center">
                                <span className="font-bold text-[#002045] text-base">Total</span>
                                <span className="font-black text-[#0061a5] text-2xl">{invoice.amount.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Installments Section */}
                {invoice.installments && invoice.installments.length > 0 && (
                    <div className="border-t border-[#eef0f4] p-8">
                        <h3 className="text-base font-bold text-[#002045] mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#0061a5]" />
                            Installment Schedule
                        </h3>
                        <div className="overflow-hidden border border-[#eef0f4] rounded-xl">
                            <table className="w-full text-left">
                                <thead className="bg-[#f8f9fc] border-b border-[#eef0f4]">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Due Date</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.installments.map((inst) => (
                                        <tr key={inst.id} className="border-b border-[#eef0f4] last:border-0 hover:bg-[#fcfdfd]">
                                            <td className="py-3 px-4 font-semibold text-[#002045]">{inst.id}</td>
                                            <td className="py-3 px-4 text-sm text-slate-600">
                                                {inst.dueDate}
                                                {inst.paidDate && <span className="block text-xs text-[#137333] mt-0.5">Paid on {inst.paidDate}</span>}
                                            </td>
                                            <td className="py-3 px-4 font-bold text-[#181c1e]">{inst.amount.toLocaleString('vi-VN')} đ</td>
                                            <td className="py-3 px-4">
                                                {inst.status === 'paid' ? (
                                                    <span className="px-2 py-1 bg-[#e6f4ea] text-[#137333] text-xs font-black rounded uppercase">Paid</span>
                                                ) : inst.status === 'overdue' ? (
                                                    <span className="px-2 py-1 bg-[#fce8e8] text-[#c53030] text-xs font-black rounded uppercase">Overdue</span>
                                                ) : inst.status === 'refunded' ? (
                                                    <span className="px-2 py-1 bg-[#fce8e8] text-[#c53030] text-xs font-black rounded uppercase">Refunded</span>
                                                ) : inst.status === 'cancelled' ? (
                                                    <span className="px-2 py-1 bg-[#f1f4f6] text-[#74777f] text-xs font-black rounded uppercase">Cancelled</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-[#fff8e1] text-[#b45309] text-xs font-black rounded uppercase">Pending</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {inst.status === 'paid' && (
                                                    <Link to={`/learner/payments/${invoice.id}/refund?installment=${inst.id}`} className="px-3 py-1.5 bg-white border border-[#c4c6cf] text-[#43474e] text-xs font-bold rounded-lg hover:bg-[#f8f9fc] transition-colors">
                                                        Refund
                                                    </Link>
                                                )}
                                                {(inst.status === 'pending' || inst.status === 'overdue') && (
                                                    <Link to={`/learner/payments/${invoice.id}/checkout?installment=${inst.id}`} className="px-4 py-1.5 bg-[#ef4444] text-white text-xs font-bold rounded-lg hover:bg-[#dc2626] transition-colors">
                                                        Pay
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions Footer */}
                <div className="px-8 py-6 bg-[#f8f9fc] border-t border-[#eef0f4] flex flex-col sm:flex-row justify-end items-center gap-4">
                    {invoice.status === 'pending' && (
                        <>
                            <button className="w-full sm:w-auto px-6 py-3 bg-white border border-[#c4c6cf] text-[#43474e] text-sm font-bold rounded-xl hover:bg-[#f1f4f6] transition-all">
                                Cancel Registration
                            </button>
                            <Link to={`/learner/payments/${invoice.id}/checkout`} className="w-full sm:w-auto px-8 py-3 bg-[#ef4444] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#dc2626] hover:shadow-lg hover:-translate-y-0.5 transition-all text-center">
                                Pay Now
                            </Link>
                        </>
                    )}
                    {invoice.status === 'partial' && (
                        <button className="w-full sm:w-auto px-6 py-3 bg-white border border-[#ef4444] text-[#ef4444] text-sm font-bold rounded-xl hover:bg-[#fce8e8] transition-all">
                            Cancel Remaining Installments
                        </button>
                    )}
                    {invoice.status === 'paid' && (
                        <Link to={`/learner/payments/${invoice.id}/refund`} className="w-full sm:w-auto px-6 py-3 bg-white border border-[#002045]/20 text-[#002045] text-sm font-bold rounded-xl hover:bg-[#f8f9fc] transition-all text-center">
                            Request Refund
                        </Link>
                    )}
                    {(invoice.status === 'cancelled' || invoice.status === 'expired' || invoice.status === 'refunded') && (
                        <Link to="/courses" className="w-full sm:w-auto px-6 py-3 bg-[#0061a5] text-white text-sm font-bold rounded-xl hover:bg-[#004a77] transition-all text-center">
                            Browse New Courses
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetail;
