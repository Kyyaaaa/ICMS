import React, { useState } from 'react';
import { Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';

const LearnerChangePassword = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-2xl space-y-[24px] animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Change Password</h1>
            
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <form onSubmit={handleSave} className="p-[24px] md:p-[32px]">
                    
                    <div className="space-y-[20px]">
                        <div className="space-y-[8px] relative">
                            <label className="text-[14px] font-semibold text-[#181c1e]">Current Password</label>
                            <div className="relative">
                                <input type={showOld ? "text" : "password"} className="w-full pl-[16px] pr-[40px] py-[8px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required />
                                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#74777f]">
                                    {showOld ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-[8px] relative">
                            <label className="text-[14px] font-semibold text-[#181c1e]">New Password</label>
                            <div className="relative">
                                <input type={showNew ? "text" : "password"} className="w-full pl-[16px] pr-[40px] py-[8px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required minLength={8} />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#74777f]">
                                    {showNew ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                </button>
                            </div>
                            <p className="text-[12px] text-[#74777f]">Must be at least 8 characters and contain a number or symbol.</p>
                        </div>

                        <div className="space-y-[8px] relative">
                            <label className="text-[14px] font-semibold text-[#181c1e]">Confirm New Password</label>
                            <div className="relative">
                                <input type={showConfirm ? "text" : "password"} className="w-full pl-[16px] pr-[40px] py-[8px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required minLength={8} />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#74777f]">
                                    {showConfirm ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[32px] pt-[24px] border-t border-[#e0e3e5] flex items-center justify-end gap-[16px]">
                        {isSuccess && <span className="text-[14px] text-[#0061a5] font-medium flex items-center gap-1 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Password updated</span>}
                        <button type="submit" disabled={isSaving} className="bg-[#002045] text-white px-[24px] py-[10px] rounded-[8px] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[#0061a5] transition-colors disabled:opacity-50">
                            {isSaving ? 'Updating...' : <><Save className="w-4 h-4"/> Update Password</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LearnerChangePassword;
