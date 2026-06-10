import { useState, useEffect } from 'react';
import { BookOpen, MapPin, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { RegistrationClassOption, RegistrationInvoicePreview } from '../types/registration';
import { LearnerRegistrationService } from '../services/registration.service';

const ClassRegistration = () => {
    const { courseId } = useParams();
    const [classOptions, setClassOptions] = useState<RegistrationClassOption[]>([]);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [invoicePreview, setInvoicePreview] = useState<RegistrationInvoicePreview | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            if (courseId) {
                const data = await LearnerRegistrationService.getAvailableClasses(courseId);
                setClassOptions(data);
            }
            setLoading(false);
        };
        fetchClasses();
    }, [courseId]);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (courseId && selectedClass) {
                const preview = await LearnerRegistrationService.getInvoicePreview(courseId, selectedClass);
                setInvoicePreview(preview);
            } else {
                setInvoicePreview(null);
            }
        };
        fetchInvoice();
    }, [courseId, selectedClass]);

    const handleConfirm = async () => {
        if (!courseId || !selectedClass) return;
        setIsConfirming(true);
        const success = await LearnerRegistrationService.confirmRegistration(courseId, selectedClass);
        if (success) {
            setIsSuccess(true);
        }
        setIsConfirming(false);
    };

    if (loading) {
        return <div className="text-center py-10">Loading available classes...</div>;
    }

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
                <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Available Classes</h2>
                
                <div className="space-y-[16px] mb-[32px]">
                    {classOptions.map((opt) => (
                        <label key={opt.id} className={`block border ${selectedClass === opt.id ? 'border-[#0061a5] bg-[#f7fafc]' : 'border-[#e0e3e5]'} rounded-[8px] p-[16px] cursor-pointer hover:border-[#0061a5] transition-colors`}>
                            <div className="flex items-start gap-[16px]">
                                <input type="radio" name="class" className="mt-1" checked={selectedClass === opt.id} onChange={() => setSelectedClass(opt.id)} />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-[#181c1e]">{opt.name}</h3>
                                        <span className="text-[#0061a5] font-semibold text-[14px]">{opt.availableSeats} seats left</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-[8px] mt-[12px] text-[14px] text-[#43474e]">
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {opt.schedule}</span>
                                        <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> {opt.time}</span>
                                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {opt.room}</span>
                                        <span className="flex items-center gap-2"><BookOpen className="w-4 h-4"/> {opt.sessions} Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Invoice Preview */}
                {invoicePreview && (
                    <div className="border-t border-[#e0e3e5] pt-[24px]">
                        <h2 className="text-[18px] font-bold text-[#181c1e] mb-[16px]">Invoice Summary</h2>
                        <div className="bg-[#f7fafc] rounded-[8px] p-[16px] space-y-[12px]">
                            <div className="flex justify-between text-[14px] text-[#43474e]">
                                <span>Course Tuition Fee</span>
                                <span>{invoicePreview.courseFee.toLocaleString()} đ</span>
                            </div>
                            <div className="flex justify-between text-[14px] text-[#43474e]">
                                <span>Discount</span>
                                <span>-{invoicePreview.discount.toLocaleString()} đ</span>
                            </div>
                            <div className="border-t border-[#e0e3e5] my-[8px]"></div>
                            <div className="flex justify-between text-[18px] font-bold text-[#181c1e]">
                                <span>Total Due</span>
                                <span>{invoicePreview.totalDue.toLocaleString()} đ</span>
                            </div>
                        </div>
                    </div>
                )}

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
