import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Clock, Calendar, ShieldCheck, CheckCircle2, MapPin, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentCheckout = () => {
    // Mock course and class info
    const course = {
        title: 'IELTS Intensive Mastery',
        duration: '12 Weeks',
        sessions: 48,
        price: 900,
        format: 'Offline',
        band: '7.5 - 8.0'
    };
    
    const selectedClass = {
        name: 'Class IELTS-A01',
        schedule: 'Mon, Wed 18:00 - 20:00',
        room: 'Room 302',
        currentStudents: 12,
        maxStudents: 15
    };

    const [paymentPlan, setPaymentPlan] = useState<'full' | 'installment'>('full');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const priceValue = course.price;
    const initialPayment = paymentPlan === 'full' ? priceValue : priceValue / 3;

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
            <div className="max-w-3xl mx-auto mt-[40px] bg-white rounded-3xl shadow-sm border border-[#e0e3e5] p-[40px] md:p-[60px] text-center animate-fade-in-up">
                <div className="w-24 h-24 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-[32px]">
                    <CheckCircle2 className="w-12 h-12 text-[#2e7d32]" />
                </div>
                <h2 className="text-[32px] font-extrabold text-[#002045] mb-[16px]">Payment Successful!</h2>
                <p className="text-[18px] text-[#43474e] mb-[32px] max-w-lg mx-auto">
                    Your payment of <strong>${initialPayment.toFixed(2)}</strong> for {course.title} has been processed. 
                    {paymentPlan === 'installment' && " The next installment will be automatically billed next month."}
                </p>
                <div className="bg-[#f7fafc] border border-[#e0e3e5] rounded-2xl p-6 mb-[40px] text-left max-w-md mx-auto">
                    <div className="flex justify-between mb-3 text-[15px]"><span className="text-[#74777f]">Invoice ID:</span> <span className="font-bold text-[#002045]">INV-10025</span></div>
                    <div className="flex justify-between mb-3 text-[15px]"><span className="text-[#74777f]">Payment Method:</span> <span className="font-bold text-[#002045]">Credit Card</span></div>
                    <div className="flex justify-between text-[15px]"><span className="text-[#74777f]">Date:</span> <span className="font-bold text-[#002045]">{new Date().toLocaleDateString()}</span></div>
                </div>
                <Link to={`/learner/payments`} className="inline-block px-[32px] py-[16px] bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] transition-colors shadow-md hover:shadow-lg">
                    Return to Payments
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up max-w-[1200px] mx-auto pb-12">
            <div className="flex items-center gap-[16px] mb-6">
                <Link to={`/learner/payments`} className="text-[#74777f] hover:text-[#0061a5] font-semibold text-[15px] flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-5 h-5"/> Back to Payments
                </Link>
            </div>
            
            <h1 className="text-[32px] font-extrabold text-[#002045] mb-[32px]">Secure Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
                {/* Left Column - Details & Payment Method */}
                <div className="lg:col-span-7 flex flex-col gap-[32px]">
                    
                    {/* Item Details */}
                    <div className="bg-white rounded-3xl p-[32px] shadow-sm border border-[#e0e3e5]">
                        <h2 className="text-[20px] font-bold text-[#002045] mb-[24px] border-b border-[#e0e3e5] pb-[16px]">Course Information</h2>
                        
                        <div className="flex flex-col md:flex-row gap-[24px] mb-[32px]">
                            <div className="w-full md:w-[120px] h-[100px] bg-[#e6f0fa] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                                <BookOpen className="w-10 h-10 text-[#0061a5] opacity-50" />
                            </div>
                            <div className="flex flex-col justify-center flex-1">
                                <h3 className="text-[22px] font-extrabold text-[#002045] leading-tight mb-2">{course.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#43474e]">
                                    <span className="bg-[#f1f4f6] px-3 py-1 rounded-full font-bold text-[#0061a5]">{course.band} Target</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.format}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f8f9fa] rounded-2xl p-[20px] border border-[#e0e3e5]">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-5 h-5 text-[#0061a5]" />
                                <span className="font-bold text-[#002045] text-[16px]">{selectedClass.name}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] text-[#43474e]">
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#74777f]" /> {selectedClass.schedule}</div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#74777f]" /> {selectedClass.room}</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Plan Selection */}
                    <div className="bg-white rounded-3xl p-[32px] shadow-sm border border-[#e0e3e5]">
                        <h2 className="text-[20px] font-bold text-[#002045] mb-[24px]">Payment Plan</h2>
                        
                        <div className="flex flex-col gap-4">
                            <label className={`relative p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentPlan === 'full' ? 'border-[#0061a5] bg-[#f0f7ff]' : 'border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                <input type="radio" name="plan" value="full" checked={paymentPlan === 'full'} onChange={() => setPaymentPlan('full')} className="absolute top-6 right-5 w-5 h-5 accent-[#0061a5]" />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentPlan === 'full' ? 'bg-[#0061a5] text-white' : 'bg-gray-100 text-[#74777f]'}`}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-[18px] font-bold text-[#002045]">Pay in Full</span>
                                </div>
                                <p className="text-[14px] text-[#43474e] ml-13">One-time payment of ${priceValue.toFixed(2)}.</p>
                            </label>

                            <label className={`relative p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentPlan === 'installment' ? 'border-[#0061a5] bg-[#f0f7ff]' : 'border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                <input type="radio" name="plan" value="installment" checked={paymentPlan === 'installment'} onChange={() => setPaymentPlan('installment')} className="absolute top-6 right-5 w-5 h-5 accent-[#0061a5]" />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentPlan === 'installment' ? 'bg-[#0061a5] text-white' : 'bg-gray-100 text-[#74777f]'}`}>
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                    <span className="text-[18px] font-bold text-[#002045]">3 Installments</span>
                                </div>
                                <p className="text-[14px] text-[#43474e] ml-13">Pay ${(priceValue/3).toFixed(2)} today, and ${(priceValue/3).toFixed(2)} monthly for 2 months.</p>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-5 flex flex-col gap-[32px]">

                    {/* Order Summary */}
                    <div className="bg-[#002045] rounded-3xl p-[32px] shadow-lg text-white">
                        <h2 className="text-[20px] font-bold mb-[24px] border-b border-white/20 pb-[16px]">Order Summary</h2>
                        
                        <div className="flex flex-col gap-[16px] mb-[24px] text-[15px]">
                            <div className="flex justify-between items-center">
                                <span className="text-[#adc7f7]">Course Tuition</span>
                                <span className="font-bold">${priceValue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#adc7f7]">Registration Fee</span>
                                <span className="font-bold">Free</span>
                            </div>
                            {paymentPlan === 'installment' && (
                                <div className="flex justify-between items-center text-[#ffb4ab]">
                                    <span className="text-[#adc7f7]">Installment Plan</span>
                                    <span className="font-bold">3 Terms</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="border-t border-white/20 pt-[24px] mb-[32px]">
                            <div className="flex justify-between items-end">
                                <span className="text-[16px] font-bold text-[#adc7f7]">Amount Due Today</span>
                                <span className="text-[36px] font-extrabold leading-none">${initialPayment.toFixed(2)}</span>
                            </div>
                            <div className="text-right text-[12px] text-[#adc7f7] mt-2">Includes all taxes and fees</div>
                        </div>

                        <button 
                            type="button"
                            onClick={handlePay}
                            disabled={isProcessing}
                            className="w-full bg-[#0061a5] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#004a80] hover:shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                        >
                            {isProcessing ? 'Redirecting to Payment Gateway...' : `Proceed to Pay $${initialPayment.toFixed(2)}`}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#adc7f7]">
                            <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Encryption
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout;
