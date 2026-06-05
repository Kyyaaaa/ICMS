
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Globe } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/verify-otp');
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
                            <Globe className="text-white w-7 h-7" />
                        </div>
                        <span className="text-[28px] font-bold text-white tracking-tight">ICMS</span>
                    </Link>
                </div>

                {/* Main Card */}
                <main className="bg-white w-full rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-[32px] md:p-[48px] border border-white/20 flex flex-col gap-[24px] animate-fade-in-up relative overflow-hidden">
                    <div className="flex flex-col gap-[8px]">
                        <div className="text-center mb-[8px]">
                            <div className="w-16 h-16 bg-[#f7fafc] rounded-2xl flex items-center justify-center mx-auto mb-[24px] shadow-sm border border-[#e0e3e5]">
                                <Mail className="text-[#0061a5] w-8 h-8" />
                            </div>
                            <h2 className="text-[24px] leading-[32px] font-bold text-[#181c1e] mb-[12px] tracking-tight">Forgot password?</h2>
                            <p className="text-[15px] leading-[24px] text-[#43474e] max-w-[320px] mx-auto">
                                No worries, we'll send you reset instructions. Please enter your institutional email.
                            </p>
                        </div>
                        
                        <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-[4px] group">
                                <label className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="email">
                                    Your Email
                                </label>
                                <div className="relative transition-transform duration-300 hover:scale-[1.01]">
                                    <Mail className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#74777f] w-[20px] h-[20px] group-focus-within:text-[#0061a5] transition-colors" />
                                    <input 
                                        className="w-full h-[52px] pl-[44px] pr-[16px] bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[16px] leading-[24px] text-[#181c1e] focus:outline-none focus:border-[#0061a5] focus:ring-4 focus:ring-[#0061a5]/10 transition-all hover:border-[#74777f] shadow-sm" 
                                        id="email" 
                                        placeholder="admin@icms.edu.vn" 
                                        required 
                                        type="email" 
                                    />
                                </div>
                            </div>
                            
                            <button className="w-full h-[52px] bg-gradient-to-r from-[#003c71] to-[#0061a5] text-white text-[15px] font-semibold rounded-xl shadow-[0_8px_16px_rgba(0,97,165,0.2)] hover:shadow-[0_12px_24px_rgba(0,97,165,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-[8px] group/btn mt-[8px]" type="submit">
                                <span>Reset password</span>
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </form>
                        
                        <div className="text-center mt-[24px]">
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

export default ForgotPassword;
