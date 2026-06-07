import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck, CheckCircle2, AlertCircle, BookOpen, ArrowLeft } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

    const handleChange = (index: number, value: string) => {
        setError(false);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code === '123456') {
            navigate('/reset-password');
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-[16px] md:p-[32px] font-sans antialiased bg-[#002045] relative overflow-hidden">
            {/* Immersive Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#0061a5]/30 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#00b4d8]/20 blur-[120px]"></div>
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-[480px]">
                {/* Branding Header */}
                <div className="flex justify-center mb-[32px] animate-fade-in-down">
                    <Link to="/login" className="flex items-center gap-[12px] group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors">
                            <BookOpen className="text-white w-7 h-7" />
                        </div>
                        <span className="text-[28px] font-bold text-white tracking-tight">ICMS</span>
                    </Link>
                </div>

                {/* Main Card */}
                <main className="bg-white w-full rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-[32px] md:p-[48px] border border-white/20 flex flex-col gap-[24px] animate-fade-in-up relative overflow-hidden">
                    <div className="flex flex-col gap-[8px]">
                        <div className="text-center mb-[8px]">
                            <div className="w-16 h-16 bg-[#f7fafc] rounded-2xl flex items-center justify-center mx-auto mb-[24px] shadow-sm border border-[#e0e3e5]">
                                <MailCheck className="text-[#0061a5] w-8 h-8" />
                            </div>
                            <h2 className="text-[24px] leading-[32px] font-bold text-[#181c1e] mb-[12px] tracking-tight">Check your email</h2>
                            <p className="text-[15px] leading-[24px] text-[#43474e] max-w-[320px] mx-auto">
                                We sent a verification code to <strong className="text-[#181c1e] font-semibold">admin@icms.edu.vn</strong>
                            </p>
                        </div>

                        <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-[4px] items-center">
                                <label className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e] self-start w-full text-center mb-[8px]">
                                    Enter Authorization Code
                                </label>
                                <div className="flex gap-2 justify-center w-full">
                                    {otp.map((digit, index) => (
                                        <React.Fragment key={index}>
                                            {index === 3 && <span className="text-[#c4c6cf] font-bold text-xl self-center mx-1">-</span>}
                                            <input
                                                ref={(el) => { inputRefs.current[index] = el; }}
                                                className={`w-[52px] h-[64px] text-center text-[28px] font-bold border rounded-xl shadow-sm transition-all duration-300 outline-none
                                                    ${error
                                                        ? 'border-[#ba1a1a] focus:ring-4 focus:ring-[#ba1a1a]/10 bg-[#f7fafc]'
                                                        : 'border-[#c4c6cf] bg-[#f7fafc] focus:border-[#0061a5] focus:ring-4 focus:ring-[#0061a5]/10 focus:bg-white hover:border-[#74777f]'
                                                    }
                                                    ${error ? 'animate-shake' : ''}
                                                `}
                                                maxLength={1}
                                                required
                                                type="text"
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                            />
                                        </React.Fragment>
                                    ))}
                                </div>
                                {error && (
                                    <div className="text-[14px] leading-[20px] text-[#ba1a1a] mt-3 flex items-center gap-[6px] animate-fade-in font-medium">
                                        <AlertCircle className="w-[18px] h-[18px]" />
                                        Invalid verification code. Please try again.
                                    </div>
                                )}
                            </div>

                            <button className="w-full h-[52px] bg-gradient-to-r from-[#003c71] to-[#0061a5] text-white text-[15px] font-semibold rounded-xl shadow-[0_8px_16px_rgba(0,97,165,0.2)] hover:shadow-[0_12px_24px_rgba(0,97,165,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-[8px] group/btn mt-[8px]" type="submit">
                                <span>Verify code</span>
                                <CheckCircle2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </form>

                        <div className="text-center mt-[24px]">
                            <p className="text-[15px] text-[#43474e] mb-[16px]">
                                Didn't receive the email? <button className="text-[#0061a5] font-semibold hover:text-[#002045] transition-colors">Click to resend</button>
                            </p>
                            <Link className="inline-flex items-center gap-[8px] text-[15px] font-semibold text-[#43474e] hover:text-[#002045] transition-colors group/link" to="/login">
                                <ArrowLeft className="w-[18px] h-[18px] group-hover/link:-translate-x-1 transition-transform" />
                                Back to log in
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer Links */}
                <div className="mt-[32px] text-center flex gap-[24px] justify-center text-[12px] leading-[16px] font-medium text-[#adc7f7] animate-fade-in">
                    <a className="hover:text-white transition-colors" href="#">Support</a>
                    <span className="text-[#0061a5]">•</span>
                    <a className="hover:text-white transition-colors" href="#">Security Policy</a>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
