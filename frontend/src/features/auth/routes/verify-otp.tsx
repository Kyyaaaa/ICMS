import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MailCheck, CheckCircle2, AlertCircle, BookOpen, ArrowLeft, Loader2 } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Timer state
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        
        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleChange = (index: number, value: string) => {
        setError(false);
        setErrorMsg('');
        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError(false);
        setErrorMsg('');
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            if (pastedData.length < 6) {
                inputRefs.current[pastedData.length]?.focus();
            } else {
                inputRefs.current[5]?.focus();
            }
        }
    };

    const handleResend = async () => {
        if (isResending) return;
        setIsResending(true);
        setResendSuccess(false);
        setErrorMsg('');
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(true);
                setErrorMsg(data.message || 'Failed to resend code.');
                return;
            }

            setTimeLeft(300); // Reset timer to 5 minutes
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 5000);
        } catch {
            setError(true);
            setErrorMsg('Network error. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            setError(true);
            setErrorMsg('Please enter all 6 digits.');
            return;
        }

        setLoading(true);
        setError(false);
        setErrorMsg('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: code }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(true);
                setErrorMsg(data.message || 'Invalid verification code. Please try again.');
                return;
            }

            // Success: API có thể trả về reset_token trực tiếp hoặc nằm trong data.data
            const token = data.reset_token || (data.data && data.data.reset_token);
            
            if (!token) {
                setError(true);
                setErrorMsg('Lỗi hệ thống: Không nhận được reset token từ server.');
                return;
            }

            navigate('/reset-password', { state: { reset_token: token } });
        } catch {
            setError(true);
            setErrorMsg('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans antialiased bg-[#002045] relative overflow-hidden">
            {/* Immersive Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#0061a5]/30 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#00b4d8]/20 blur-[120px]"></div>
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-120">
                {/* Branding Header */}
                <div className="flex justify-center mb-8 animate-fade-in-down">
                    <Link to="/login" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors">
                            <BookOpen className="text-white w-7 h-7" />
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">ICMS</span>
                    </Link>
                </div>

                {/* Main Card */}
                <main className="bg-white w-full rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-8 md:p-12 border border-white/20 flex flex-col gap-6 animate-fade-in-up relative overflow-hidden">
                    <div className="flex flex-col gap-2">
                        <div className="text-center mb-2">
                            <div className="w-16 h-16 bg-[#f7fafc] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#e0e3e5]">
                                <MailCheck className="text-[#0061a5] w-8 h-8" />
                            </div>
                            <h2 className="text-2xl leading-8 font-bold text-[#181c1e] mb-3 tracking-tight">Check your email</h2>
                            <p className="text-sm leading-6 text-[#43474e] max-w-80 mx-auto">
                                We sent a verification code to <strong className="text-[#181c1e] font-semibold">{email}</strong>
                            </p>
                        </div>

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1 items-center">
                                <label className="text-sm leading-4 font-semibold tracking-[0.05em] text-[#181c1e] self-start w-full text-center mb-2">
                                    Enter Authorization Code
                                </label>
                                <div className="flex gap-2 justify-center w-full">
                                    {otp.map((digit, index) => (
                                        <React.Fragment key={index}>
                                            {index === 3 && <span className="text-[#c4c6cf] font-bold text-xl self-center mx-1">-</span>}
                                            <input
                                                ref={(el) => { inputRefs.current[index] = el; }}
                                                className={`w-13 h-16 text-center text-3xl font-bold border rounded-xl shadow-sm transition-all duration-300 outline-none
                                                    ${error
                                                        ? 'border-[#ba1a1a] focus:ring-4 focus:ring-[#ba1a1a]/10 bg-[#f7fafc]'
                                                        : 'border-[#c4c6cf] bg-[#f7fafc] focus:border-[#0061a5] focus:ring-4 focus:ring-[#0061a5]/10 focus:bg-white hover:border-[#74777f]'
                                                    }
                                                    ${error ? 'animate-shake' : ''}
                                                    ${timeLeft <= 0 ? 'opacity-50 cursor-not-allowed bg-[#ebeef0]' : ''}
                                                `}
                                                maxLength={1}
                                                required
                                                type="text"
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                disabled={loading || timeLeft <= 0}
                                            />
                                        </React.Fragment>
                                    ))}
                                </div>
                                {error && (
                                    <div className="text-sm leading-5 text-[#ba1a1a] mt-3 flex items-center gap-1.5 animate-fade-in font-medium text-center">
                                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                                        {errorMsg}
                                    </div>
                                )}
                            </div>

                            <button 
                                className="w-full h-13 bg-linear-to-r from-[#003c71] to-[#0061a5] text-white text-sm font-semibold rounded-xl shadow-[0_8px_16px_rgba(0,97,165,0.2)] hover:shadow-[0_12px_24px_rgba(0,97,165,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                                type="submit"
                                disabled={loading || otp.join('').length < 6 || timeLeft <= 0}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Verify code</span>
                                        <CheckCircle2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            {resendSuccess && (
                                <p className="text-sm text-[#0061a5] font-medium mb-2 animate-fade-in">
                                    A new code has been sent to your email.
                                </p>
                            )}
                            <p className="text-sm text-[#43474e] mb-4 flex items-center justify-center gap-2">
                                Didn't receive the email? 
                                {timeLeft > 0 ? (
                                    <span className="font-semibold text-[#181c1e]">Resend in {formatTime(timeLeft)}</span>
                                ) : (
                                    <button 
                                        className="text-[#0061a5] font-semibold hover:text-[#002045] transition-colors disabled:opacity-50 flex items-center gap-1"
                                        onClick={handleResend}
                                        disabled={isResending}
                                        type="button"
                                    >
                                        {isResending && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Click to resend
                                    </button>
                                )}
                            </p>
                            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#43474e] hover:text-[#002045] transition-colors group/link" to="/login">
                                <ArrowLeft className="w-4.5 h-4.5 group-hover/link:-translate-x-1 transition-transform" />
                                Back to log in
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer Links */}
                <div className="mt-8 text-center flex gap-6 justify-center text-xs leading-4 font-medium text-[#adc7f7] animate-fade-in">
                    <a className="hover:text-white transition-colors" href="#">Support</a>
                    <span className="text-[#0061a5]">•</span>
                    <a className="hover:text-white transition-colors" href="#">Security Policy</a>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
