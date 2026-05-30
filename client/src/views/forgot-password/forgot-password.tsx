import React from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/verify-otp');
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
                            <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1e] mb-[8px]">Reset your password</h2>
                            <p className="text-[14px] leading-[20px] text-[#43474e]">
                                Enter your institutional email address and we'll send you a secure OTP to reset your password.
                            </p>
                        </div>
                        
                        <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-[4px] group">
                                <label className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="email">
                                    Institutional Email
                                </label>
                                <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5 group-focus-within:text-[#0061a5] transition-colors" />
                                    <input 
                                        className="w-full pl-10 pr-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-[8px] text-[16px] leading-[24px] text-[#181c1e] focus:outline-none focus:border-[#0061a5] focus:ring-4 focus:ring-[#0061a5]/20 transition-all hover:border-[#74777f]" 
                                        id="email" 
                                        placeholder="admin@institution.edu" 
                                        required 
                                        type="email" 
                                    />
                                </div>
                            </div>
                            
                            <button className="w-full py-3 bg-[#0061a5] text-white text-[14px] leading-[16px] font-semibold tracking-[0.05em] rounded-[8px] shadow-sm hover:shadow-[0_8px_24px_rgba(0,32,69,0.12)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-[8px] group/btn" type="submit">
                                <span>Send Recovery OTP</span>
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </form>
                        
                        <div className="text-center mt-[8px]">
                            <Link className="text-[12px] leading-[16px] font-medium text-[#0061a5] hover:text-[#002045] transition-colors flex items-center justify-center gap-1 group/link" to="/login">
                                <ArrowLeft className="w-4 h-4 group-hover/link:-translate-x-1 transition-transform" />
                                Return to Login
                            </Link>
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

export default ForgotPassword;
