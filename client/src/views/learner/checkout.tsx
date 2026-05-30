import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const PaymentCheckout = () => {
    const { id } = useParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto mt-[40px] bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[40px] text-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-[24px]">
                    <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
                </div>
                <h2 className="text-[24px] font-bold text-[#181c1e] mb-[16px]">Payment Successful!</h2>
                <p className="text-[16px] text-[#43474e] mb-[32px]">Your tuition payment of $450.00 for {id} has been processed successfully.</p>
                <Link to={`/learner/payments`} className="inline-block px-[24px] py-[10px] bg-[#002045] text-white rounded-[8px] font-semibold hover:bg-[#0061a5] transition-colors">
                    Back to Payments
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/payments`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Payments</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Checkout Payment</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
                <div className="lg:col-span-2 bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] md:p-[32px]">
                    <h2 className="text-[18px] font-bold text-[#181c1e] mb-[24px] flex items-center gap-[8px]"><CreditCard className="w-5 h-5"/> Payment Details</h2>
                    <form onSubmit={handlePay} className="space-y-[20px]">
                        <div className="space-y-[8px]">
                            <label className="text-[14px] font-semibold text-[#181c1e]">Cardholder Name</label>
                            <input type="text" placeholder="John Doe" className="w-full px-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required />
                        </div>
                        <div className="space-y-[8px]">
                            <label className="text-[14px] font-semibold text-[#181c1e]">Card Number</label>
                            <div className="relative">
                                <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full pl-[40px] pr-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required />
                                <CreditCard className="w-5 h-5 absolute left-[12px] top-1/2 -translate-y-1/2 text-[#74777f]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-[16px]">
                            <div className="space-y-[8px]">
                                <label className="text-[14px] font-semibold text-[#181c1e]">Expiry Date</label>
                                <input type="text" placeholder="MM/YY" maxLength={5} className="w-full px-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required />
                            </div>
                            <div className="space-y-[8px]">
                                <label className="text-[14px] font-semibold text-[#181c1e]">CVV</label>
                                <div className="relative">
                                    <input type="text" placeholder="123" maxLength={4} className="w-full pr-[40px] pl-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required />
                                    <Lock className="w-4 h-4 absolute right-[12px] top-1/2 -translate-y-1/2 text-[#74777f]" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-[24px]">
                            <button type="submit" disabled={isProcessing} className="w-full bg-[#002045] text-white py-[14px] rounded-[8px] font-semibold hover:bg-[#0061a5] transition-colors disabled:opacity-50 flex justify-center items-center gap-[8px]">
                                {isProcessing ? 'Processing Securely...' : 'Pay $450.00'} <ShieldCheck className="w-5 h-5"/>
                            </button>
                            <p className="text-[12px] text-center text-[#74777f] mt-[16px]">Payments are secure and encrypted by our payment gateway provider.</p>
                        </div>
                    </form>
                </div>

                <div className="bg-[#f7fafc] rounded-[12px] border border-[#e0e3e5] p-[24px] h-fit">
                    <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Order Summary</h2>
                    <div className="space-y-[12px] text-[14px] text-[#43474e]">
                        <div className="flex justify-between">
                            <span>Invoice ID</span>
                            <span className="font-semibold text-[#181c1e]">{id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Course</span>
                            <span className="font-semibold text-[#181c1e] text-right">IELTS Academic<br/>Writing</span>
                        </div>
                        <div className="border-t border-[#e0e3e5] my-[16px]"></div>
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$450.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>$0.00</span>
                        </div>
                        <div className="border-t border-[#e0e3e5] my-[16px]"></div>
                        <div className="flex justify-between text-[18px] font-bold text-[#002045]">
                            <span>Total</span>
                            <span>$450.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout;
