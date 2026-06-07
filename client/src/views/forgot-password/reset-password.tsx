import { useState } from 'react';
import { EyeOff, Eye, Circle, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Validation Rules
    const isLength = newPassword.length >= 8 && newPassword.length <= 15;
    const isCases = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
    const isNumber = /[0-9]/.test(newPassword);
    const isSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    const score = [isLength, isCases, isNumber, isSpecial].filter(Boolean).length;

    const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
    const showMatchError = confirmPassword.length > 0 && !isMatch;
    const isValid = score === 4 && isMatch && newPassword.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 800);
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
                <main className="bg-white w-full rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-[32px] md:p-[48px] border border-white/20 overflow-hidden min-h-[500px] animate-fade-in-up">
                    
                    {/* View 1: Reset Password Form */}
                    <div className={`transition-opacity duration-300 flex flex-col h-full ${isSuccess ? 'opacity-0 pointer-events-none absolute inset-0 p-[40px]' : 'opacity-100 relative'}`}>
                        <div className="text-center mb-[24px]">
                            <h2 className="text-[24px] leading-[32px] font-bold text-[#181c1e] mb-[8px] tracking-tight">Set new password</h2>
                            <p className="text-[14px] leading-[22px] text-[#43474e] max-w-[320px] mx-auto">
                                Must be different from previously used passwords.
                            </p>
                        </div>
                        
                        <form className="flex flex-col gap-[16px] flex-grow" onSubmit={handleSubmit}>
                            {/* New Password Input */}
                            <div className="flex flex-col gap-[6px] relative">
                                <label className="text-[13px] font-semibold text-[#181c1e]" htmlFor="new-password">New Password</label>
                                <div className="relative w-full">
                                    <input 
                                        className="w-full h-[48px] px-[16px] bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[15px] text-[#181c1e] placeholder-[#74777f] focus:outline-none focus:border-[#0061a5] focus:ring-4 focus:ring-[#0061a5]/10 transition-all shadow-sm hover:border-[#74777f]" 
                                        id="new-password" 
                                        placeholder="Enter new password" 
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button 
                                        className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#43474e] hover:text-[#002045] transition-colors focus:outline-none" 
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <Eye className="w-[18px] h-[18px]" /> : <EyeOff className="w-[18px] h-[18px]" />}
                                    </button>
                                </div>
                                
                                {/* Password Strength Visual Indicator */}
                                <div className="mt-[6px]">
                                    <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden flex gap-1">
                                        <div className={`h-full w-1/4 transition-colors duration-300 ${newPassword.length > 0 && score >= 1 ? (score <= 2 ? 'bg-[#ba1a1a]' : (score === 3 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]')) : 'bg-transparent'}`}></div>
                                        <div className={`h-full w-1/4 transition-colors duration-300 ${newPassword.length > 0 && score >= 2 ? (score <= 2 ? 'bg-[#ba1a1a]' : (score === 3 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]')) : 'bg-transparent'}`}></div>
                                        <div className={`h-full w-1/4 transition-colors duration-300 ${newPassword.length > 0 && score >= 3 ? (score === 3 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]') : 'bg-transparent'}`}></div>
                                        <div className={`h-full w-1/4 transition-colors duration-300 ${newPassword.length > 0 && score === 4 ? 'bg-[#0061a5]' : 'bg-transparent'}`}></div>
                                    </div>
                                </div>
                                
                                {/* Validation Rules Checklist */}
                                <ul className="mt-[8px] space-y-[4px]">
                                    <li className={`flex items-center gap-[8px] text-[14px] leading-[20px] transition-colors ${isLength ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                        {isLength ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                        Length from 8 to 15 characters
                                    </li>
                                    <li className={`flex items-center gap-[8px] text-[14px] leading-[20px] transition-colors ${isCases ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                        {isCases ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                        Contains uppercase and lowercase letters
                                    </li>
                                    <li className={`flex items-center gap-[8px] text-[14px] leading-[20px] transition-colors ${isNumber ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                        {isNumber ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                        Contains a number
                                    </li>
                                    <li className={`flex items-center gap-[8px] text-[14px] leading-[20px] transition-colors ${isSpecial ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                        {isSpecial ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                        Contains a special symbol
                                    </li>
                                </ul>
                            </div>
                            
                            {/* Confirm Password Input */}
                            <div className="flex flex-col gap-[6px] relative">
                                <label className="text-[13px] font-semibold text-[#181c1e]" htmlFor="confirm-password">Confirm New Password</label>
                                <div className="relative w-full">
                                    <input 
                                        className={`w-full h-[48px] px-[16px] bg-[#f7fafc] border rounded-xl text-[15px] text-[#181c1e] placeholder-[#74777f] focus:outline-none focus:border-[#0061a5] focus:ring-4 focus:ring-[#0061a5]/10 transition-all shadow-sm hover:border-[#74777f] ${showMatchError ? 'border-[#ba1a1a]' : 'border-[#c4c6cf]'}`}
                                        id="confirm-password" 
                                        placeholder="Re-enter new password" 
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button 
                                        className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#43474e] hover:text-[#002045] transition-colors focus:outline-none" 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <Eye className="w-[18px] h-[18px]" /> : <EyeOff className="w-[18px] h-[18px]" />}
                                    </button>
                                </div>
                                {showMatchError && (
                                    <p className="text-[14px] leading-[20px] text-[#ba1a1a] mt-[4px] flex items-center gap-[4px] animate-fade-in">
                                        <AlertCircle className="w-4 h-4" /> Passwords do not match
                                    </p>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-[16px]">
                                <button 
                                    className={`w-full h-[48px] bg-gradient-to-r from-[#003c71] to-[#0061a5] text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-[8px] transition-all duration-300 ${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_12px_24px_rgba(0,97,165,0.3)] hover:-translate-y-0.5 active:scale-[0.98] group/btn'}`}
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-[18px] h-[18px] animate-spin" /> Processing...</>
                                    ) : (
                                        <>Reset password <ArrowRight className="w-5 h-5 opacity-0 -ml-5 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" /></>
                                    )}
                                </button>
                            </div>
                        </form>
                        
                        {/* Footer Link */}
                        <div className="mt-[24px] text-center">
                            <Link className="inline-flex items-center gap-[8px] text-[14px] font-semibold text-[#43474e] hover:text-[#002045] transition-colors group/link" to="/login">
                                <ArrowLeft className="w-[16px] h-[16px] group-hover/link:-translate-x-1 transition-transform" />
                                Back to log in
                            </Link>
                        </div>
                    </div>

                    {/* View 2: Success State */}
                    <div className={`absolute inset-0 bg-white flex flex-col items-center justify-center p-[40px] text-center transition-opacity duration-500 ${isSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <div className={`w-20 h-20 rounded-2xl bg-[#f7fafc] border border-[#e0e3e5] shadow-sm flex items-center justify-center mb-[24px] transition-transform duration-500 delay-100 ${isSuccess ? 'scale-100' : 'scale-0'}`}>
                            <CheckCircle2 className="text-[#0061a5] w-10 h-10" />
                        </div>
                        <h2 className={`text-[24px] leading-[32px] font-bold text-[#181c1e] mb-[12px] tracking-tight transform transition-all duration-500 delay-200 ${isSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            All done!
                        </h2>
                        <p className={`text-[15px] leading-[24px] text-[#43474e] max-w-[320px] mx-auto mb-[40px] transform transition-all duration-500 delay-300 ${isSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            Your password has been securely updated. You can now use your new credentials to log into the management system.
                        </p>
                        <Link 
                            className={`w-full h-[52px] bg-gradient-to-r from-[#003c71] to-[#0061a5] text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-[8px] transition-all duration-500 delay-400 hover:shadow-[0_12px_24px_rgba(0,97,165,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transform ${isSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} group/btn`} 
                            to="/login"
                        >
                            Continue to log in
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
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

export default ResetPassword;
