import { useState } from 'react';
import { Camera, Eye, EyeOff, CheckCircle2, User, Phone, Mail, MapPin, CalendarDays, Users, ShieldCheck, } from 'lucide-react';

const StaffProfile = () => {
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
        <div className="max-w-4xl space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Profile</h1>
                <p className="text-[#74777f] text-[14px] mt-1">Manage your personal information and staff settings.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6 flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 rounded-full bg-[#002045] flex items-center justify-center text-white font-bold text-[48px] border-4 border-[#e6f0fa] shadow-sm overflow-hidden group cursor-pointer mb-4">
                            <span>AS</span>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-[20px] font-bold text-[#002045]">Admin Staff</h2>
                        <p className="text-[14px] text-[#0061a5] font-bold flex items-center justify-center gap-1 mt-1">
                            <ShieldCheck className="w-4 h-4" /> System Admin
                        </p>
                        
                        <div className="w-full mt-6 pt-6 border-t border-[#e0e3e5] space-y-3 text-left">
                            <h3 className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-2">Employee Details</h3>
                            <div className="flex justify-between items-center text-[14px]">
                                <span className="text-[#74777f]">Employee ID</span>
                                <span className="font-bold text-[#181c1e]">STF-2026-001</span>
                            </div>
                            <div className="flex justify-between items-center text-[14px]">
                                <span className="text-[#74777f]">Join Date</span>
                                <span className="font-bold text-[#181c1e]">15-01-2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Form */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                            <h2 className="text-[16px] font-bold text-[#002045]">Personal Information</h2>
                        </div>
                        <form onSubmit={handleSaveProfile} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="text" defaultValue="Admin Staff" className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="tel" defaultValue="+84 123 456 789" className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Date of Birth</label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="date" defaultValue="1990-08-22" className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors text-[#181c1e]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Gender</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <select defaultValue="female" className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors text-[#181c1e] appearance-none">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-5">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                    <input type="email" defaultValue="admin.staff@icms.edu" disabled className="w-full pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#e0e3e5] rounded-xl text-[14px] text-[#74777f] cursor-not-allowed" />
                                </div>
                                <p className="text-[12px] text-[#74777f] mt-1">Staff email address cannot be changed.</p>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                    <input type="text" defaultValue="Ho Chi Minh City, Vietnam" className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e0e3e5]">
                                {isProfileSuccess && <span className="text-[13px] text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Saved successfully</span>}
                                <button type="submit" disabled={isSavingProfile} className="bg-[#0061a5] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold flex items-center gap-2 hover:bg-[#004d80] transition-colors disabled:opacity-70">
                                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password Form */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6">
                        <div className="mb-6 pb-4 border-b border-[#e0e3e5]">
                            <h2 className="text-[20px] font-bold text-[#003366]">Change Password</h2>
                        </div>
                        <form onSubmit={handleSavePassword}>
                            <div className="space-y-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#181c1e]">Current Password</label>
                                    <div className="relative">
                                        <input type={showOld ? "text" : "password"} defaultValue="password123" className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] text-[#74777f] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required />
                                        <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                            {showOld ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#181c1e]">New Password</label>
                                        <div className="relative">
                                            <input type={showNew ? "text" : "password"} defaultValue="password123" className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] text-[#74777f] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required minLength={8} />
                                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                                {showNew ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#181c1e]">Confirm New Password</label>
                                        <div className="relative">
                                            <input type={showConfirm ? "text" : "password"} defaultValue="password123" className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] text-[#74777f] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required minLength={8} />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                                {showConfirm ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                {isPasswordSuccess && <span className="text-[13px] text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Updated</span>}
                                <button type="submit" disabled={isSavingPassword} className="bg-white border-2 border-[#0061a5] text-[#0061a5] px-6 py-2.5 rounded-xl text-[15px] font-bold hover:bg-[#e6f0fa] transition-colors disabled:opacity-70">
                                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
