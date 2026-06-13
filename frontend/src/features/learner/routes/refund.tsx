import { useState, useEffect } from 'react';
import { FileWarning, Send, CheckCircle2 } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { PaymentInvoice } from '../types/payment';
import { LearnerPaymentsService } from '../services/payments.service';

const RefundRequest = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const installmentId = searchParams.get('installment');

    const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);
    const [loading, setLoading] = useState(true);

    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [accountName, setAccountName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (id) {
                const data = await LearnerPaymentsService.getInvoiceById(id);
                if (data) setInvoice(data);
            }
            setLoading(false);
        };
        fetchInvoice();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSubmitting(true);
        const success = await LearnerPaymentsService.requestRefund(id, reason, details);
        if (success) {
            setIsSuccess(true);
        }
        setIsSubmitting(false);
    };

    if (loading || !invoice) {
        return <div className="text-center py-10">Loading refund details...</div>;
    }

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-10 text-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
                </div>
                <h2 className="text-2xl font-bold text-[#181c1e] mb-4">Request Submitted!</h2>
                <p className="text-base text-[#43474e] mb-8">Your refund request for invoice {id} has been submitted to our administration. You will be notified of the result via email within 2-3 business days.</p>
                <Link to={`/learner/payments`} className="inline-block px-6 py-2.5 bg-[#002045] text-white rounded-lg font-semibold hover:bg-[#0061a5] transition-colors">
                    Back to Payments
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Link to={`/learner/payments`} className="text-[#0061a5] hover:underline font-medium text-sm">← Back to Payments</Link>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-[#ba1a1a]">Request Refund</h1>
            
            <div className="bg-[#ffebed] border border-[#ba1a1a] rounded-lg p-4 flex gap-3">
                <FileWarning className="w-6 h-6 text-[#ba1a1a] shrink-0" />
                <div>
                    <p className="text-sm font-bold text-[#ba1a1a]">Refund Policy Alert</p>
                    <p className="text-sm text-[#ba1a1a]">Refunds can only be approved if requested within 24 hours of successful payment, and provided that no class sessions have been attended.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 md:p-8 space-y-6">
                
                <div className="bg-[#f7fafc] rounded-lg p-4 border border-[#e0e3e5]">
                    <h3 className="text-sm font-bold text-[#181c1e] mb-2">Invoice Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-[#43474e]">
                        <span>Invoice ID:</span>
                        <span className="font-semibold text-[#181c1e]">
                            {invoice.id} {installmentId ? `(${installmentId})` : ''}
                        </span>
                        <span>Amount Paid:</span>
                        <span className="font-semibold text-[#181c1e]">
                            {(installmentId && invoice.installments ? 
                                (invoice.installments.find(i => i.id === installmentId)?.amount || invoice.amount) 
                                : invoice.amount).toLocaleString()} đ
                        </span>
                        <span>Course:</span>
                        <span className="font-semibold text-[#181c1e]">{invoice.course}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#181c1e]">Reason for Refund</label>
                    <select 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#c4c6cf] rounded-lg text-base focus:outline-none focus:border-[#ba1a1a] focus:ring-[3px] focus:ring-[#ba1a1a]/20" 
                        required
                    >
                        <option value="" disabled>Select a reason...</option>
                        <option value="schedule">Schedule conflict</option>
                        <option value="changed_mind">Changed my mind</option>
                        <option value="financial">Financial reasons</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#181c1e]">Additional Details (Optional)</label>
                    <textarea 
                        rows={4} 
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#c4c6cf] rounded-lg text-base focus:outline-none focus:border-[#ba1a1a] focus:ring-[3px] focus:ring-[#ba1a1a]/20 resize-none"
                        placeholder="Please provide any extra information that might help us process your request..."
                    ></textarea>
                </div>

                <div className="bg-[#f7fafc] rounded-lg p-4 border border-[#e0e3e5] space-y-4">
                    <h3 className="text-sm font-bold text-[#181c1e]">Bank Information for Refund</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#181c1e]">Bank Name</label>
                            <input 
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="e.g. Vietcombank"
                                className="w-full px-4 py-2.5 bg-white border border-[#c4c6cf] rounded-lg text-base focus:outline-none focus:border-[#ba1a1a] focus:ring-[3px] focus:ring-[#ba1a1a]/20" 
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#181c1e]">Account Number</label>
                            <input 
                                type="text"
                                value={accountNo}
                                onChange={(e) => setAccountNo(e.target.value)}
                                placeholder="e.g. 0123456789"
                                className="w-full px-4 py-2.5 bg-white border border-[#c4c6cf] rounded-lg text-base focus:outline-none focus:border-[#ba1a1a] focus:ring-[3px] focus:ring-[#ba1a1a]/20" 
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-[#181c1e]">Account Name</label>
                            <input 
                                type="text"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="e.g. NGUYEN VAN A"
                                className="w-full px-4 py-2.5 bg-white border border-[#c4c6cf] rounded-lg text-base focus:outline-none focus:border-[#ba1a1a] focus:ring-[3px] focus:ring-[#ba1a1a]/20" 
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-[#e0e3e5] flex justify-end">
                    <button 
                        type="submit" 
                        disabled={!reason || !bankName || !accountNo || !accountName || isSubmitting} 
                        className="bg-[#ba1a1a] text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#93000a] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4"/> Submit Request</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RefundRequest;
