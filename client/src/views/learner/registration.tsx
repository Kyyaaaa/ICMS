import { useState } from 'react';
import { BookOpen, MapPin, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const ClassRegistration = () => {
    const { courseId } = useParams();
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleConfirm = () => {
        setIsConfirming(true);
        setTimeout(() => {
            setIsConfirming(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto mt-[40px] bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[40px] text-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-[24px]">
                    <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
                </div>
                <h2 className="text-[24px] font-bold text-[#181c1e] mb-[16px]">Registration Successful!</h2>
                <p className="text-[16px] text-[#43474e] mb-[16px]">You have successfully reserved a seat in the class. A tuition invoice has been generated.</p>
                <div className="bg-[#fff8e1] border border-[#c9a82c] p-[16px] rounded-[8px] mb-[32px] text-left">
                    <p className="text-[14px] text-[#c9a82c] font-semibold">Important: Payment Required</p>
                    <p className="text-[14px] text-[#c9a82c]">Your registration will be automatically canceled if the payment is not completed within 24 hours.</p>
                </div>
                <div className="flex justify-center gap-[16px]">
                    <Link to={`/learner/classes`} className="px-[24px] py-[10px] bg-white text-[#002045] border border-[#002045] rounded-[8px] font-semibold hover:bg-[#f1f4f6] transition-colors">
                        View Classes
                    </Link>
                    <Link to={`/learner/payments/1/checkout`} className="px-[24px] py-[10px] bg-[#ba1a1a] text-white rounded-[8px] font-semibold hover:bg-[#93000a] transition-colors flex items-center gap-[8px]">
                        Pay Now <ArrowRight className="w-4 h-4"/>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/courses/${courseId}`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Course</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Class Registration</h1>
            
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] md:p-[32px]">
                <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Available Classes for IELTS Academic</h2>
                
                <div className="space-y-[16px] mb-[32px]">
                    {/* Class Option 1 */}
                    <label className={`block border ${selectedClass === 1 ? 'border-[#0061a5] bg-[#f7fafc]' : 'border-[#e0e3e5]'} rounded-[8px] p-[16px] cursor-pointer hover:border-[#0061a5] transition-colors`}>
                        <div className="flex items-start gap-[16px]">
                            <input type="radio" name="class" className="mt-1" checked={selectedClass === 1} onChange={() => setSelectedClass(1)} />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-[#181c1e]">Class A - Evening</h3>
                                    <span className="text-[#0061a5] font-semibold text-[14px]">10 seats left</span>
                                </div>
                                <div className="grid grid-cols-2 gap-[8px] mt-[12px] text-[14px] text-[#43474e]">
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Mon, Wed</span>
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> 19:00 - 21:00</span>
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Room 305</span>
                                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4"/> 24 Sessions</span>
                                </div>
                            </div>
                        </div>
                    </label>

                    {/* Class Option 2 */}
                    <label className={`block border ${selectedClass === 2 ? 'border-[#0061a5] bg-[#f7fafc]' : 'border-[#e0e3e5]'} rounded-[8px] p-[16px] cursor-pointer hover:border-[#0061a5] transition-colors`}>
                        <div className="flex items-start gap-[16px]">
                            <input type="radio" name="class" className="mt-1" checked={selectedClass === 2} onChange={() => setSelectedClass(2)} />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-[#181c1e]">Class B - Weekend</h3>
                                    <span className="text-[#0061a5] font-semibold text-[14px]">2 seats left</span>
                                </div>
                                <div className="grid grid-cols-2 gap-[8px] mt-[12px] text-[14px] text-[#43474e]">
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Sat, Sun</span>
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> 09:00 - 11:00</span>
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Room 102</span>
                                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4"/> 24 Sessions</span>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>

                {/* Invoice Preview */}
                <div className="border-t border-[#e0e3e5] pt-[24px]">
                    <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Invoice Summary</h2>
                    <div className="bg-[#f7fafc] rounded-[8px] p-[16px] space-y-[12px]">
                        <div className="flex justify-between text-[14px] text-[#43474e]">
                            <span>Course Tuition Fee</span>
                            <span>450,000 đ</span>
                        </div>
                        <div className="flex justify-between text-[14px] text-[#43474e]">
                            <span>Discount</span>
                            <span>-0 đ</span>
                        </div>
                        <div className="border-t border-[#e0e3e5] my-[8px]"></div>
                        <div className="flex justify-between text-[18px] font-bold text-[#181c1e]">
                            <span>Total Due</span>
                            <span>450,000 đ</span>
                        </div>
                    </div>
                </div>

                <div className="mt-[32px] flex justify-end">
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedClass || isConfirming}
                        className="bg-[#002045] text-white px-[32px] py-[12px] rounded-[8px] font-semibold hover:bg-[#0061a5] transition-colors disabled:opacity-50"
                    >
                        {isConfirming ? 'Processing...' : 'Confirm Registration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassRegistration;
