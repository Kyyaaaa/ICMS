import { useState, useEffect } from 'react';
import { BookOpen, ArrowLeft, Clock, Calendar, ShieldCheck, CheckCircle2, MapPin, CalendarDays } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { LearnerPaymentsService } from '../services/payments.service';
import { showAlertModal } from '@/utils/modal';

const PaymentCheckout = () => {
    const { id } = useParams(); // Using invoice id or course id based on route

    const [invoiceData, setInvoiceData] = useState<{ amount: number, discount?: number, classes?: { courses?: { title: string, price: number, band?: number, sessions?: number, format?: string, allow_installments?: boolean, number_of_installments?: number }, name: string } } | null>(null);
    const [loading, setLoading] = useState(true);

    const [paymentPlan, setPaymentPlan] = useState<'full' | 'installment'>('full');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (id) {
                    const data = await LearnerPaymentsService.getCheckoutInvoice(id);
                    setInvoiceData(data);
                }
            } catch (error) {
                console.error("Failed to load invoice:", error);
                setErrorMsg('Failed to load invoice details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center py-10">Loading checkout details...</div>;
    }

    if (errorMsg || !invoiceData) {
        return <div className="text-center py-10 text-red-500">{errorMsg || 'Invoice not found'}</div>;
    }

    const courseData = invoiceData.classes?.courses;
    const classData = invoiceData.classes;
    const allowInstallments = courseData?.allow_installments;
    const numInstallments = courseData?.number_of_installments || 3;

    const priceValue = invoiceData.amount || 0;
    const recurringPayment = Math.round(priceValue / numInstallments);
    const firstPayment = priceValue - recurringPayment * (numInstallments - 1);
    const initialPayment = paymentPlan === 'full' ? priceValue : firstPayment;

        const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const vnpayUrl = await LearnerPaymentsService.getVnpayUrl(id || '', paymentPlan === 'installment' ? 'installments' : 'full');
            if (vnpayUrl) {
                window.location.href = vnpayUrl;
            } else {
                throw new Error("Failed to generate payment link");
            }
        } catch (error: unknown) {
            showAlertModal('Error', error instanceof Error ? error.message : 'Error processing payment', 'error');
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-fade-in-up max-w-300 mx-auto pb-12">
            <div className="flex items-center gap-4 mb-6">
                <Link to={`/learner/payments`} className="text-[#74777f] hover:text-[#0061a5] font-semibold text-sm flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-5 h-5"/> Back to Payments
                </Link>
            </div>
            
            <h1 className="text-3xl font-extrabold text-[#002045] mb-8">Secure Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Details & Payment Method */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    
                    {/* Item Details */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0e3e5]">
                        <h2 className="text-xl font-bold text-[#002045] mb-6 border-b border-[#e0e3e5] pb-4">Course Information</h2>
                        
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="w-full md:w-30 h-25 bg-[#e6f0fa] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                                <BookOpen className="w-10 h-10 text-[#0061a5] opacity-50" />
                            </div>
                            <div className="flex flex-col justify-center flex-1">
                                <h3 className="text-xl font-extrabold text-[#002045] leading-tight mb-2">{courseData?.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-[#43474e]">
                                    <span className="bg-[#f1f4f6] px-3 py-1 rounded-full font-bold text-[#0061a5]">{courseData?.band} Target</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {courseData?.sessions} Sessions</span>
                                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {courseData?.format}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-[#e0e3e5]">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-5 h-5 text-[#0061a5]" />
                                <span className="font-bold text-[#002045] text-base">{classData?.name}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#43474e]">
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#74777f]" /> Detailed schedule provided after enrollment</div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#74777f]" /> ICMS Campus</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Plan Selection */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e0e3e5]">
                        <h2 className="text-xl font-bold text-[#002045] mb-6">Payment Plan</h2>
                        
                        <div className="flex flex-col gap-4">
                            <label className={`relative p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentPlan === 'full' ? 'border-[#0061a5] bg-[#f0f7ff]' : 'border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                <input type="radio" name="plan" value="full" checked={paymentPlan === 'full'} onChange={() => setPaymentPlan('full')} className="absolute top-6 right-5 w-5 h-5 accent-[#0061a5]" />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentPlan === 'full' ? 'bg-[#0061a5] text-white' : 'bg-gray-100 text-[#74777f]'}`}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg font-bold text-[#002045]">Pay in Full</span>
                                </div>
                                <p className="text-sm text-[#43474e] ml-13">One-time payment of {priceValue.toLocaleString('en-US')} VND.</p>
                            </label>

                            {allowInstallments && (
                                <label className={`relative p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentPlan === 'installment' ? 'border-[#0061a5] bg-[#f0f7ff]' : 'border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                    <input type="radio" name="plan" value="installment" checked={paymentPlan === 'installment'} onChange={() => setPaymentPlan('installment')} className="absolute top-6 right-5 w-5 h-5 accent-[#0061a5]" />
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentPlan === 'installment' ? 'bg-[#0061a5] text-white' : 'bg-gray-100 text-[#74777f]'}`}>
                                            <CalendarDays className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg font-bold text-[#002045]">{numInstallments} Installments</span>
                                    </div>
                                    <p className="text-sm text-[#43474e] ml-13">
                                        Pay {firstPayment.toLocaleString('en-US')} VND today, and {recurringPayment.toLocaleString('en-US')} VND periodically for {numInstallments - 1} terms.
                                    </p>
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-5 flex flex-col gap-8">

                    {/* Order Summary */}
                    <div className="bg-[#002045] rounded-3xl p-8 shadow-lg text-white">
                        <h2 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">Order Summary</h2>
                        
                        <div className="flex flex-col gap-4 mb-6 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-[#adc7f7]">Course Tuition</span>
                                <span className="font-bold">{(priceValue + (invoiceData.discount || 0)).toLocaleString('en-US')} VND</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#adc7f7]">Registration Fee</span>
                                <span className="font-bold">Free</span>
                            </div>
                            {invoiceData.discount ? (
                                <div className="flex justify-between items-center text-[#ffb4ab]">
                                    <span className="text-[#adc7f7]">Discount</span>
                                    <span className="font-bold">-{(invoiceData.discount).toLocaleString('en-US')} VND</span>
                                </div>
                            ) : null}
                            {paymentPlan === 'installment' && (
                                <div className="flex justify-between items-center text-[#ffb4ab]">
                                    <span className="text-[#adc7f7]">Installment Plan</span>
                                    <span className="font-bold">{numInstallments} Terms</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="border-t border-white/20 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-[#adc7f7]">Amount Due Today</span>
                                <span className="text-4xl font-extrabold leading-none">{initialPayment.toLocaleString('en-US')} VND</span>
                            </div>
                            <div className="text-right text-xs text-[#adc7f7] mt-2">Includes all taxes and fees</div>
                        </div>

                        <button 
                            type="button"
                            onClick={handlePay}
                            disabled={isProcessing}
                            className="w-full bg-[#0061a5] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#004a80] hover:shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                        >
                            {isProcessing ? 'Redirecting to Payment Gateway...' : `Proceed to Pay ${initialPayment.toLocaleString('en-US')} VND`}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#adc7f7]">
                            <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Encryption
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCheckout;
