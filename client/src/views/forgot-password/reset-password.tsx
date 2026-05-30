import React, { useState } from 'react';
import { EyeOff, Eye, Circle, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Validation Rules
    const isLength = newPassword.length >= 8;
    const isUpper = /[A-Z]/.test(newPassword);
    const isNumber = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    const score = [isLength, isUpper, isNumber].filter(Boolean).length;
    
    const strengthLabels = ['None', 'Weak', 'Medium', 'Strong'];
    const strengthLabel = newPassword.length === 0 ? 'None' : strengthLabels[score];
    
    let labelColor = 'text-[#74777f]';
    if (newPassword.length > 0) {
        if (score === 1) labelColor = 'text-[#ba1a1a]';
        else if (score === 2) labelColor = 'text-[#715c00]';
        else if (score === 3) labelColor = 'text-[#0061a5]';
    }

    const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
    const showMatchError = confirmPassword.length > 0 && !isMatch;
    const isValid = score === 3 && isMatch && newPassword.length > 0;

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
        <div className="bg-[#f7fafc] min-h-screen flex flex-col items-center justify-center p-[16px] md:p-[32px] font-sans antialiased">
            <div className="w-full max-w-[480px] flex flex-col items-center">
                <div className="bg-white w-full rounded-[8px] shadow-[0_4px_12px_rgba(0,32,69,0.08)] p-[40px] relative overflow-hidden min-h-[500px]">
                    
                    {/* View 1: Reset Password Form */}
                    <div className={`transition-opacity duration-300 flex flex-col h-full ${isSuccess ? 'opacity-0 pointer-events-none absolute inset-0 p-[40px]' : 'opacity-100 relative'}`}>
                        <h2 className="text-[24px] leading-[32px] font-semibold text-[#181c1e] mb-[4px]">Reset Your Password</h2>
                        <p className="text-[16px] leading-[24px] text-[#43474e] mb-[64px]">Please enter a secure, new password for your account to regain access.</p>
                        
                        <form className="flex flex-col gap-[24px] flex-grow" onSubmit={handleSubmit}>
                            {/* New Password Input */}
                            <div className="flex flex-col gap-[8px] relative">
                                <label className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="new-password">New Password</label>
                                <div className="relative w-full">
                                    <input 
                                        className="w-full h-12 px-[16px] py-[8px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] leading-[24px] text-[#181c1e] placeholder-[#74777f] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 transition-all" 
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
                                        {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                                
                                {/* Password Strength Visual Indicator */}
                                <div className="mt-[16px]">
                                    <div className="flex justify-between items-center mb-[4px]">
                                        <span className="text-[12px] leading-[16px] font-medium text-[#43474e]">Password Strength</span>
                                        <span className={`text-[12px] leading-[16px] font-medium ${labelColor}`}>{strengthLabel}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#e0e3e5] rounded-full overflow-hidden flex gap-1">
                                        <div className={`h-full w-1/3 transition-colors duration-300 ${newPassword.length > 0 && score >= 1 ? (score === 1 ? 'bg-[#ba1a1a]' : (score === 2 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]')) : 'bg-transparent'}`}></div>
                                        <div className={`h-full w-1/3 transition-colors duration-300 ${newPassword.length > 0 && score >= 2 ? (score === 2 ? 'bg-[#c9a82c]' : 'bg-[#0061a5]') : 'bg-transparent'}`}></div>
                                        <div className={`h-full w-1/3 transition-colors duration-300 ${newPassword.length > 0 && score === 3 ? 'bg-[#0061a5]' : 'bg-transparent'}`}></div>
                                    </div>
                                </div>
                                
                                {/* Validation Rules Checklist */}
                                <ul className="mt-[8px] space-y-[4px]">
                                    <li className={`flex items-center gap-[8px] text-[14px] leading-[20px] transition-colors ${isLength ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                        {isLength ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                        At least 8 characters
                                    </li>
                                    <li className={`flex items-center gap-[8px] text-[14px] leading-[20px] transition-colors ${isUpper ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                        {isUpper ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                        Contains an uppercase letter
                                    </li>
                                    <li className={`flex items-center gap-[8px] text-[14px] leading-[20px] transition-colors ${isNumber ? 'text-[#181c1e]' : 'text-[#43474e]'}`}>
                                        {isNumber ? <CheckCircle2 className="w-4 h-4 text-[#0061a5] fill-[#0061a5]/20" /> : <Circle className="w-4 h-4 text-[#74777f]" />}
                                        Contains a number or symbol
                                    </li>
                                </ul>
                            </div>
                            
                            {/* Confirm Password Input */}
                            <div className="flex flex-col gap-[8px] relative mt-[16px]">
                                <label className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#181c1e]" htmlFor="confirm-password">Confirm New Password</label>
                                <div className="relative w-full">
                                    <input 
                                        className={`w-full h-12 px-[16px] py-[8px] bg-white border rounded-[8px] text-[16px] leading-[24px] text-[#181c1e] placeholder-[#74777f] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 transition-all ${showMatchError ? 'border-[#ba1a1a]' : 'border-[#c4c6cf]'}`}
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
                                        {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                                {showMatchError && (
                                    <p className="text-[14px] leading-[20px] text-[#ba1a1a] mt-[4px] flex items-center gap-[4px] animate-fade-in">
                                        <AlertCircle className="w-4 h-4" /> Passwords do not match
                                    </p>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-[40px]">
                                <button 
                                    className={`w-full h-12 bg-[#002045] text-white text-[14px] leading-[16px] font-semibold tracking-[0.05em] rounded-[8px] flex items-center justify-center gap-[16px] transition-all duration-200 ${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-[1px]'}`}
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>
                        </form>
                        
                        {/* Footer Link */}
                        <div className="mt-[40px] pt-[24px] border-t border-[#e0e3e5] text-center">
                            <Link className="inline-flex items-center gap-[8px] text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#43474e] hover:text-[#002045] transition-colors group" to="/login">
                                <ArrowLeft className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </div>
                    </div>

                    {/* View 2: Success State */}
                    <div className={`absolute inset-0 bg-white flex flex-col items-center justify-center p-[40px] text-center transition-opacity duration-500 ${isSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <div className={`w-20 h-20 rounded-full bg-[#d2e4ff] flex items-center justify-center mb-[24px] transition-transform duration-500 delay-100 ${isSuccess ? 'scale-100' : 'scale-0'}`}>
                            <CheckCircle2 className="text-[#0061a5] w-10 h-10 fill-[#0061a5]/20" />
                        </div>
                        <h2 className={`text-[24px] leading-[32px] font-semibold text-[#181c1e] mb-[16px] transform transition-all duration-500 delay-200 ${isSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            Password Reset Successfully
                        </h2>
                        <p className={`text-[16px] leading-[24px] text-[#43474e] mb-[64px] transform transition-all duration-500 delay-300 ${isSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            Your password has been securely updated. You can now use your new credentials to log into the management system.
                        </p>
                        <Link 
                            className={`w-full h-12 bg-[#002045] text-white text-[14px] leading-[16px] font-semibold tracking-[0.05em] rounded-[8px] flex items-center justify-center gap-[16px] transition-all duration-500 delay-400 hover:shadow-md transform ${isSuccess ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} 
                            to="/login"
                        >
                            Continue to Login
                            <ArrowRight className="w-[18px] h-[18px]" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
