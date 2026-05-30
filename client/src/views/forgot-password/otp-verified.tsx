import { CheckCircle2, Unlock } from 'lucide-react';

const OTPVerified = () => {
    return (
        <div className="bg-[#f7fafc] text-[#181c1e] min-h-screen flex items-center justify-center p-[16px] md:p-[32px] font-sans antialiased">
            <div className="relative w-full max-w-[480px]">
                {/* Decorative background blurs */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d2e4ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0 pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#d6e3ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0 pointer-events-none"></div>
                
                {/* Main Card */}
                <main className="relative z-10 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,32,69,0.12)] p-[24px] md:p-[40px] border border-[#e0e3e5] flex flex-col gap-[24px] items-center text-center animate-fade-in-up">
                    <div className="w-16 h-16 rounded-full bg-emerald-100/50 flex items-center justify-center mb-[16px] shadow-[0_4px_12px_rgba(0,32,69,0.08)]">
                        <CheckCircle2 className="text-emerald-600 w-8 h-8 font-bold" />
                    </div>
                    
                    <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1e] mb-[8px]">
                        Identity Verified
                    </h2>
                    
                    <p className="text-[14px] leading-[20px] text-[#43474e] mb-[24px] max-w-[300px]">
                        Your authorization code has been confirmed. You may now securely establish a new password for your account.
                    </p>
                    
                    <button className="w-full py-3 bg-[#002045] text-white text-[14px] leading-[16px] font-semibold tracking-[0.05em] rounded-[8px] shadow-sm hover:shadow-[0_8px_24px_rgba(0,32,69,0.12)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-[8px] group">
                        <span>Proceed to Password Setup</span>
                        <Unlock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
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

export default OTPVerified;
