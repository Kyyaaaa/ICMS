import { useState, useEffect } from 'react';
import { BookOpen, MapPin, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { RegistrationClassOption, RegistrationInvoicePreview } from '../types/registration';
import { LearnerRegistrationService } from '../services/registration.service';
import { showAlertModal } from '@/utils/modal';

const ClassRegistration = () => {
    const { courseId } = useParams();
    const [classOptions, setClassOptions] = useState<RegistrationClassOption[]>([]);
    const [selectedClass, setSelectedClass] = useState<number | string | null>(null);
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
        try {
            await LearnerRegistrationService.confirmRegistration(courseId, selectedClass);
            setIsSuccess(true);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
            showAlertModal('Registration Failed', errorMsg, 'error');
        } finally {
            setIsConfirming(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading available classes...</div>;
    }

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-10 text-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
                </div>
                <h2 className="text-2xl font-bold text-[#181c1e] mb-4">Registration Successful!</h2>
                <p className="text-base text-[#43474e] mb-8">You have successfully enrolled in the class.</p>
                <div className="flex justify-center gap-4">
                    <Link to={`/learner/classes`} className="px-6 py-2.5 bg-[#002045] text-white rounded-lg font-semibold hover:bg-[#0061a5] transition-colors">
                        View My Classes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Link to={`/courses/${courseId}`} className="text-[#0061a5] hover:underline font-medium text-sm">← Back to Course</Link>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Class Registration</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 md:p-8">
                <h2 className="text-lg font-bold text-[#181c1e] mb-4">Available Classes</h2>
                
                <div className="space-y-4 mb-8">
                    {classOptions.map((opt) => (
                        <label key={opt.id} className={`block border ${selectedClass === opt.id ? 'border-[#0061a5] bg-[#f7fafc]' : 'border-[#e0e3e5]'} rounded-lg p-4 cursor-pointer hover:border-[#0061a5] transition-colors`}>
                            <div className="flex items-start gap-4">
                                <input type="radio" name="class" className="mt-1" checked={selectedClass === opt.id} onChange={() => setSelectedClass(opt.id)} />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-[#181c1e]">{opt.name}</h3>
                                        <span className="text-[#0061a5] font-semibold text-sm">{opt.availableSeats} seats left</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-[#43474e]">
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

                {/* Invoice Preview is hidden for Phase 1 & 3 */}

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedClass || isConfirming}
                        className="bg-[#002045] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0061a5] transition-colors disabled:opacity-50"
                    >
                        {isConfirming ? 'Processing...' : 'Confirm Registration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassRegistration;
