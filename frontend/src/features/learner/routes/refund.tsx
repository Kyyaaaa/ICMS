import { useState, useEffect } from 'react';
import { FileWarning, Send, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { PaymentInvoice } from '../types/payment';
import { LearnerPaymentsService } from '../services/payments.service';

const RefundRequest = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);
    const [loading, setLoading] = useState(true);

    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
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
            <div className="max-w-2xl mx-auto mt-[40px] bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[40px] text-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-[24px]">
                    <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
                </div>
                <h2 className="text-[24px] font-bold text-[#181c1e] mb-[16px]">Request Submitted!</h2>
                <p className="text-[16px] text-[#43474e] mb-[32px]">Your refund request for invoice {id} has been submitted to our administration. You will be notified of the result via email within 2-3 business days.</p>
                <Link to={`/learner/payments`} className="inline-block px-[24px] py-[10px] bg-[#002045] text-white rounded-[8px] font-semibold hover:bg-[#0061a5] transition-colors">
                    Back to Payments
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/payments`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Payments</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#ba1a1a]">Request Refund</h1>
            
            <div className="bg-[#ffebed] border border-[#ba1a1a] rounded-[8px] p-[16px] flex gap-[12px]">
                <FileWarning className="w-6 h-6 text-[#ba1a1a] shrink-0" />
                <div>
                    <p className="text-[14px] font-bold text-[#ba1a1a]">Refund Policy Alert</p>
                    <p className="text-[14px] text-[#ba1a1a]">Refunds can only be approved if requested within 24 hours of successful payment, and provided that no class sessions have been attended.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] md:p-[32px] space-y-[24px]">
                
                <div className="bg-[#f7fafc] rounded-[8px] p-[16px] border border-[#e0e3e5]">
                    <h3 className="text-[14px] font-bold text-[#181c1e] mb-[8px]">Invoice Details</h3>
                    <div className="grid grid-cols-2 gap-[8px] text-[14px] text-[#43474e]">
                        <span>Invoice ID:</span>
                        <span className="font-semibold text-[#181c1e]">{invoice.id}</span>
                        <span>Amount Paid:</span>
                        <span className="font-semibold text-[#181c1e]">{invoice.amount.toLocaleString()} đ</span>
                        <span>Course:</span>
                        <span className="font-semibold text-[#181c1e]">{invoice.course}</span>
                    </div>
                </div>

                <div className="space-y-[8px]">
                    <label className="text-[14px] font-semibold text-[#181c1e]">Reason for Refund</label>
                    <select 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#ba1a1a] focus:ring-[3px] focus:ring-[#ba1a1a]/20" 
                        required
                    >
                        <option value="" disabled>Select a reason...</option>
                        <option value="schedule">Schedule conflict</option>
                        <option value="changed_mind">Changed my mind</option>
                        <option value="financial">Financial reasons</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="space-y-[8px]">
                    <label className="text-[14px] font-semibold text-[#181c1e]">Additional Details (Optional)</label>
                    <textarea 
                        rows={4} 
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full px-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#ba1a1a] focus:ring-[3px] focus:ring-[#ba1a1a]/20 resize-none"
                        placeholder="Please provide any extra information that might help us process your request..."
                    ></textarea>
                </div>

                <div className="pt-[16px] border-t border-[#e0e3e5] flex justify-end">
                    <button 
                        type="submit" 
                        disabled={!reason || isSubmitting} 
                        className="bg-[#ba1a1a] text-white px-[24px] py-[10px] rounded-[8px] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[#93000a] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4"/> Submit Request</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RefundRequest;
