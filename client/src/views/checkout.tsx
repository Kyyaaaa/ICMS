import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Clock, Calendar, ShieldCheck, Ticket, CheckCircle2, CreditCard, MapPin, Users } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Support state passed from course-detail or use mock data for direct visits
    const course = location.state?.course || {
        title: 'IELTS Intensive Mastery',
        duration: '12 Weeks',
        sessions: 48,
        price: 899,
        originalPrice: 1200,
        format: 'Offline',
        band: '7.5 - 8.0'
    };
    
    const selectedClass = location.state?.class || {
        name: 'Class 1',
        schedule: 'Mon, Wed 18:00 - 20:00',
        room: 'Room 302',
        currentStudents: 12,
        maxStudents: 15
    };

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isApplied, setIsApplied] = useState(false);

    const priceValue = typeof course.price === 'string' 
        ? parseInt(course.price.replace(/[^0-9]/g, ''), 10) 
        : course.price;

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'ICMS2024') {
            setDiscount(50);
            setIsApplied(true);
        } else {
            alert('Invalid promo code');
            setDiscount(0);
            setIsApplied(false);
        }
    };

    const finalPrice = priceValue - discount;

    return (
        <div className="bg-[#f7fafc] text-[#181c1e] text-[16px] leading-[24px] font-sans min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-[#c4c6cf] sticky top-0 z-50 h-[80px] flex items-center px-4 lg:px-[32px]">
                <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#43474e] hover:text-[#0061a5] font-bold text-[14px] transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <Link to="/homepage" className="text-[24px] font-extrabold text-[#002045] flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-[#0061a5]" />
                        ICMS Checkout
                    </Link>
                    <div className="w-[80px] flex justify-end">
                        <ShieldCheck className="w-6 h-6 text-[#2e7d32]" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 lg:px-[32px] py-[40px]">
                <h1 className="text-[32px] font-extrabold text-[#002045] mb-[32px]">Order Summary</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
                    
                    {/* Left Column - Course & Class Details */}
                    <div className="lg:col-span-7 flex flex-col gap-[24px]">
                        <div className="bg-white rounded-3xl p-[32px] shadow-sm border border-[#e0e3e5]">
                            <h2 className="text-[20px] font-bold text-[#002045] mb-[24px] border-b border-[#e0e3e5] pb-[16px]">Item Details</h2>
                            
                            <div className="flex flex-col md:flex-row gap-[24px] mb-[32px]">
                                <div className="w-full md:w-[160px] h-[120px] bg-[#e6f0fa] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                                    <BookOpen className="w-12 h-12 text-[#0061a5] opacity-50" />
                                </div>
                                <div className="flex flex-col justify-center flex-1">
                                    <h3 className="text-[24px] font-extrabold text-[#002045] leading-tight mb-2">{course.title}</h3>
                                    <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#43474e]">
                                        <span className="bg-[#f1f4f6] px-3 py-1 rounded-full font-bold text-[#0061a5]">{course.band} Target</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration} ({course.sessions} sessions)</span>
                                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.format}</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-[16px] font-bold text-[#002045] mb-[16px]">Selected Class Schedule</h3>
                            <div className="bg-[#f7fafc] border border-[#c4c6cf] rounded-2xl p-[24px] flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#0061a5] rounded-full flex items-center justify-center text-white shrink-0">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[18px] font-bold text-[#002045] mb-2">{selectedClass.name}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[#43474e] text-[14px]">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[#74777f]" /> {selectedClass.schedule}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-[#74777f]" /> {selectedClass.room}
                                        </div>
                                        <div className="flex items-center gap-2 sm:col-span-2">
                                            <Users className="w-4 h-4 text-[#74777f]" /> Current Enrolled: <span className="font-bold text-[#002045]">{selectedClass.currentStudents}/{selectedClass.maxStudents}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-[13px] text-[#2e7d32] flex items-center gap-1 font-medium bg-[#e8f5e9] w-fit px-3 py-1 rounded-full">
                                        <CheckCircle2 className="w-4 h-4" /> Seat reserved for 15 minutes
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment & Summary */}
                    <div className="lg:col-span-5 flex flex-col gap-[24px]">
                        
                        {/* Promo Code Box */}
                        <div className="bg-white rounded-3xl p-[32px] shadow-sm border border-[#e0e3e5]">
                            <h2 className="text-[18px] font-bold text-[#002045] mb-[16px] flex items-center gap-2">
                                <Ticket className="text-[#0061a5] w-5 h-5" /> Promo Code
                            </h2>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter ICMS2024"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    disabled={isApplied}
                                    className="flex-1 border border-[#c4c6cf] bg-[#f7fafc] rounded-xl px-4 py-3 focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-[14px]"
                                />
                                <button 
                                    onClick={handleApplyPromo}
                                    disabled={!promoCode || isApplied}
                                    className="px-6 py-3 bg-[#002045] text-white font-bold rounded-xl hover:bg-[#00142d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px]"
                                >
                                    {isApplied ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                            {isApplied && (
                                <div className="mt-3 text-[13px] text-[#2e7d32] flex items-center gap-1 font-medium">
                                    <CheckCircle2 className="w-4 h-4" /> Promo code applied successfully!
                                </div>
                            )}
                        </div>

                        {/* Order Calculation Box */}
                        <div className="bg-[#002045] rounded-3xl p-[32px] shadow-lg text-white">
                            <h2 className="text-[20px] font-bold mb-[24px] border-b border-white/20 pb-[16px]">Payment Summary</h2>
                            
                            <div className="flex flex-col gap-[16px] mb-[24px] text-[15px]">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#adc7f7]">Course Tuition</span>
                                    <span className="font-bold">${priceValue}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#adc7f7]">Registration Fee</span>
                                    <span className="font-bold">Free</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-[#ffd200]">
                                        <span className="flex items-center gap-2"><Ticket className="w-4 h-4" /> Discount Applied</span>
                                        <span className="font-bold">-${discount}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="border-t border-white/20 pt-[24px] mb-[32px]">
                                <div className="flex justify-between items-end">
                                    <span className="text-[16px] font-bold text-[#adc7f7]">Total Due</span>
                                    <span className="text-[36px] font-extrabold leading-none">${finalPrice}</span>
                                </div>
                                <div className="text-right text-[12px] text-[#adc7f7] mt-2">Includes all taxes and fees</div>
                            </div>

                            <button 
                                className="w-full bg-[#0061a5] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#004a80] hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                                onClick={() => alert('Redirecting to secure payment gateway...')}
                            >
                                <CreditCard className="w-5 h-5" /> Proceed to Payment
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#adc7f7]">
                                <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Encryption
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
