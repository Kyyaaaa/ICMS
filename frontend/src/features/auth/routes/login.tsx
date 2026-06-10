import { BookOpen, LineChart, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

const Login = () => {
    return (
        <div className="bg-[#f7fafc] text-[#181c1e] min-h-screen flex font-sans">
            {/* Split Screen Container */}
            <div className="flex w-full min-h-screen">
                {/* Left Side - Form (Canvas) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-[16px] lg:px-[120px] py-[40px] bg-[#f7fafc] relative z-10 animate-fade-in">
                    {/* Branding Header */}
                    <div className="absolute top-0 left-0 w-full p-[16px] lg:p-[32px] flex items-center justify-between animate-fade-in-down">
                        <Link to="/homepage" className="flex items-center gap-2">
                            <BookOpen className="text-[#002045] w-8 h-8" />
                            <span className="text-[24px] leading-[32px] font-bold text-[#002045] tracking-tight">ICMS</span>
                        </Link>
                        <Link to="/homepage" className="flex items-center gap-2 text-[14px] font-semibold text-[#43474e] hover:text-[#0061a5] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-[#e0e3e5] hover:shadow-md">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </div>
                    
                    {/* Render LoginForm Component */}
                    <LoginForm />

                </div>
                {/* Right Side - Hero Image & Value Prop */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#002045] items-center justify-center p-[64px] group">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img alt="University Campus" className="w-full h-full object-cover opacity-30 mix-blend-overlay transition-transform duration-[10s] group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8MDHrR9urwQ7O37N-BpzAQXac_nesELLzttpXtVOtFwAH7fEFXOD-x3ET0kg3SV50IUwEHvwV_vk3I-oors6XsyhaKHSQZXOVdajlGYHH3gmIy9-scYPnG13SVNVer5yjQ0twJ8Yxw4XvCt_y-78LlUjZJTgNrgQVP4ccYnytW_q9PuBEzJ1dKXAmsm2dfw_RRG-76cSA6dp5qISIPL4iLPj_-ybMX26sD2EtFO7HUO-eXDKHdURXursXfiGRfrtCrRhkvzOvdnA" />
                    </div>
                    {/* Content Overlay */}
                    <div className="relative z-10 max-w-lg text-white animate-fade-in-up">
                        <div className="mb-[16px]">
                            <span className="inline-flex items-center justify-center p-3 bg-[#0061a5] rounded-[8px] shadow-lg mb-[24px] hover:scale-110 transition-transform duration-300">
                                <LineChart className="text-white w-6 h-6" />
                            </span>
                        </div>
                        <h2 className="text-[40px] leading-[48px] font-bold mb-[24px] tracking-[-0.02em]">Elevate Your Testing Administration</h2>
                        <p className="text-[18px] leading-[28px] text-[#adc7f7] mb-[64px] opacity-90">
                            Join over 500 institutions globally using ICMS to manage schedules, tutors, and student payments with unparalleled precision and security.
                        </p>
                        {/* Testimonial/Stat Card */}
                        <div className="bg-[#f7fafc]/10 backdrop-blur-md border border-[#c4c6cf]/20 rounded-xl p-[24px] hover:bg-[#f7fafc]/20 transition-colors duration-300">
                            <div className="flex items-center gap-[8px] mb-[8px]">
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                                <Star className="text-[#ffe17c] w-[18px] h-[18px] fill-[#ffe17c]" />
                            </div>
                            <p className="text-[16px] leading-[24px] text-white italic mb-[16px]">"ICMS has reduced our administrative overhead by 40%. The robust scheduling and tutor management tools are the gold standard for testing centers."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ebeef0] overflow-hidden border-2 border-transparent hover:border-white transition-colors duration-300 cursor-pointer">
                                    <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmzOtaHSaoNbhFqaNpYsMMBZKJUnrUU0KvXQJEX-SEsrIHDuF_gDjz-iF7-i6GyNYjaWmaTE0_I4mXi0hoGRmsbZjIBbzTBWQB9WCTQWJ0PrRevOaq7otWr_BKiWZmqKM1_mgcvJAxTK5JtV5FhmYqyyqNkoE4YrD3aV7851ar-R2C0lY4dNRNeH__IrZoxN7EY0AWusYOipOAFSY60G_5yhSQQhGs2MdgxUASmz63VEthF0XpwpS9ZanxnEbeW5vUD-O9-_JxxXw" />
                                </div>
                                <div>
                                    <p className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-white">Dr. Sarah Jenkins</p>
                                    <p className="text-[14px] leading-[20px] text-[#adc7f7]">Director of Testing, Global Standard University</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
