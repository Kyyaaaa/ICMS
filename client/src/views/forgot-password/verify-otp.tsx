import React, { useState, useRef } from 'react';
import { MailCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
            navigate('/otp-verified');
        } else {
            setError(true);
        }
    };

    return (
        <div className="bg-[#f7fafc] text-[#181c1e] min-h-screen flex items-center justify-center p-[16px] md:p-[32px] font-sans antialiased">
            <div className="relative w-full max-w-[480px]">
                {/* Decorative background blurs */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d2e4ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0 pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#d6e3ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0 pointer-events-none"></div>

                {/* Main Card */}
                <main className="relative z-10 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,32,69,0.12)] p-[24px] md:p-[40px] border border-[#e0e3e5] flex flex-col gap-[24px] animate-fade-in-up">
                    <div className="flex flex-col gap-[24px]">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-[16px]">
                                <MailCheck className="text-[#0061a5] w-6 h-6" />
                            </div>
                            <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1e] mb-[8px]">Check your email</h2>
                            <p className="text-[14px] leading-[20px] text-[#43474e]">
                                We sent a 6-digit verification code to <strong className="text-[#181c1e]">admin@institution.edu</strong>.
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
                                                className={`w-12 h-14 text-center text-2xl font-semibold border rounded-[8px] transition-all duration-200 outline-none
                                                    ${error
                                                        ? 'border-[#ba1a1a] shadow-[0_0_0_3px_rgba(186,26,26,0.2)] bg-[#f7fafc]'
                                                        : 'border-[#c4c6cf] bg-[#f7fafc] focus:border-[#0061a5] focus:shadow-[0_0_0_3px_rgba(0,97,165,0.2)] focus:bg-white'
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
                                    <div className="text-[14px] leading-[20px] text-[#ba1a1a] mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        Invalid verification code. Please try again.
                                    </div>
                                )}
                            </div>

                            <button className="w-full py-3 bg-[#0061a5] text-white text-[14px] leading-[16px] font-semibold tracking-[0.05em] rounded-[8px] shadow-sm hover:shadow-[0_8px_24px_rgba(0,32,69,0.12)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-[8px]" type="submit">
                                <span>Verify & Continue</span>
                                <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="flex justify-between items-center mt-[8px] text-[12px] leading-[16px] font-medium">
                            <Link className="text-[#43474e] hover:text-[#002045] transition-colors" to="/forgot-password">Change email</Link>
                            <button className="text-[#0061a5] hover:text-[#002045] transition-colors font-semibold">Resend Code</button>
                        </div>
                    </div>
                </main>

                {/* Footer Links */}
                <div className="mt-[40px] text-center flex gap-[24px] justify-center text-[12px] leading-[16px] font-medium text-[#43474e] animate-fade-in">
                    <a className="hover:text-[#002045] transition-colors" href="#">Support</a>
                    <span className="text-[#c4c6cf]">•</span>
                    <a className="hover:text-[#002045] transition-colors" href="#">Security Policy</a>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
