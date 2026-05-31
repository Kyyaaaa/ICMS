import React, { useState } from 'react';
import { Camera, Save, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const LearnerProfile = () => {
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isProfileSuccess, setIsProfileSuccess] = useState(false);

    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setTimeout(() => {
            setIsSavingProfile(false);
            setIsProfileSuccess(true);
            setTimeout(() => setIsProfileSuccess(false), 3000);
        }, 1000);
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingPassword(true);
        setTimeout(() => {
            setIsSavingPassword(false);
            setIsPasswordSuccess(true);
            setTimeout(() => setIsPasswordSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-3xl space-y-[32px] animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Account Settings</h1>
            
            {/* Profile Section */}
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="px-[24px] md:px-[32px] py-[20px] border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    <h2 className="text-[18px] font-bold text-[#002045]">Personal Information</h2>
                    <p className="text-[13px] text-[#74777f]">Update your personal details and public profile.</p>
                </div>
                <form onSubmit={handleSaveProfile} className="p-[24px] md:p-[32px]">
                    <div className="flex flex-col md:flex-row gap-[32px]">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-[16px]">
                            <div className="relative w-32 h-32 rounded-full bg-[#d2e4ff] flex items-center justify-center text-[#0061a5] font-bold text-[48px] border-4 border-white shadow-sm overflow-hidden group cursor-pointer">
                                <span>JD</span>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <p className="text-[14px] text-[#74777f] text-center">Allowed *.jpeg, *.jpg, *.png<br/>max size of 3 MB</p>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 space-y-[20px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                                <div className="space-y-[8px]">
                                    <label className="text-[14px] font-semibold text-[#181c1e]">Full Name</label>
                                    <input type="text" defaultValue="John Doe" className="w-full px-[16px] py-[8px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" required />
                                </div>
                                <div className="space-y-[8px]">
                                    <label className="text-[14px] font-semibold text-[#181c1e]">Phone Number</label>
                                    <input type="tel" defaultValue="+1234567890" className="w-full px-[16px] py-[8px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" />
                                </div>
                            </div>

                            <div className="space-y-[8px]">
                                <label className="text-[14px] font-semibold text-[#181c1e]">Email Address</label>
                                <input type="email" defaultValue="johndoe@example.com" disabled className="w-full px-[16px] py-[8px] bg-[#f1f4f6] border border-[#e0e3e5] rounded-[8px] text-[16px] text-[#74777f] cursor-not-allowed" />
                                <p className="text-[12px] text-[#74777f]">Email address cannot be changed once registered.</p>
                            </div>

                            <div className="space-y-[8px]">
                                <label className="text-[14px] font-semibold text-[#181c1e]">Home Address</label>
                                <textarea rows={3} defaultValue="123 Academic St, Education City" className="w-full px-[16px] py-[8px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[32px] pt-[24px] border-t border-[#e0e3e5] flex items-center justify-end gap-[16px]">
                        {isProfileSuccess && <span className="text-[14px] text-[#0061a5] font-medium flex items-center gap-1 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Profile updated</span>}
                        <button type="submit" disabled={isSavingProfile} className="bg-[#002045] text-white px-[24px] py-[10px] rounded-[8px] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[#0061a5] transition-colors disabled:opacity-50">
                            {isSavingProfile ? 'Saving...' : <><Save className="w-4 h-4"/> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="px-[24px] md:px-[32px] py-[20px] border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    <h2 className="text-[18px] font-bold text-[#ba1a1a]">Security & Password</h2>
                    <p className="text-[13px] text-[#74777f]">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                <form onSubmit={handleSavePassword} className="p-[24px] md:p-[32px]">
                    <div className="space-y-[20px] max-w-xl">
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
                        {isPasswordSuccess && <span className="text-[14px] text-[#0061a5] font-medium flex items-center gap-1 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Password updated</span>}
                        <button type="submit" disabled={isSavingPassword} className="bg-[#002045] text-white px-[24px] py-[10px] rounded-[8px] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[#0061a5] transition-colors disabled:opacity-50">
                            {isSavingPassword ? 'Updating...' : <><Save className="w-4 h-4"/> Update Password</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LearnerProfile;
