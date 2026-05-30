import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';

const LearnerProfile = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
        <div className="max-w-3xl space-y-[24px] animate-fade-in-up">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Profile</h1>
            
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <form onSubmit={handleSave} className="p-[24px] md:p-[32px]">
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
                        {isSuccess && <span className="text-[14px] text-[#0061a5] font-medium animate-fade-in">Profile updated successfully!</span>}
                        <button type="submit" disabled={isSaving} className="bg-[#002045] text-white px-[24px] py-[10px] rounded-[8px] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[#0061a5] transition-colors disabled:opacity-50">
                            {isSaving ? 'Saving...' : <><Save className="w-4 h-4"/> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LearnerProfile;
