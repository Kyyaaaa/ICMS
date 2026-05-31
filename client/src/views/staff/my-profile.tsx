import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Camera, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const StaffProfile = () => {
    const [isInfoSaved, setIsInfoSaved] = useState(false);
    const [isPasswordSaved, setIsPasswordSaved] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profile, setProfile] = useState({
        fullName: 'Admin Staff',
        email: 'admin.staff@icms.edu',
        phone: '+84 123 456 789',
        location: 'Ho Chi Minh City, Vietnam',
        employeeId: 'STF-2026-001',
        joinDate: 'Jan 15, 2026'
    });

    const handleSaveInfo = () => {
        setIsInfoSaved(true);
        setTimeout(() => setIsInfoSaved(false), 3000);
    };

    const handleUpdatePassword = () => {
        setIsPasswordSaved(true);
        setTimeout(() => setIsPasswordSaved(false), 3000);
    };

    return (
        <div className="space-y-[24px] animate-fade-in-up pb-[40px] max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[#002045]">My Profile</h1>
                    <p className="text-[#43474e] text-[15px] mt-1">Manage your personal information and staff settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                {/* Left Column: Avatar & ID */}
                <div className="md:col-span-1 space-y-[24px]">
                    <div className="bg-white p-[32px] rounded-3xl shadow-sm border border-[#e0e3e5] text-center relative">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 mx-auto rounded-full bg-[#002045] text-white flex items-center justify-center font-bold text-[48px] shadow-md">
                                {profile.fullName.split(' ').map(n => n[0]).join('').substring(0,2)}
                            </div>
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#0061a5] text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-[#004d80] transition-colors shadow-sm">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-[22px] font-extrabold text-[#002045] mt-4">{profile.fullName}</h2>
                        <p className="text-[#0061a5] font-bold text-[14px] mt-1 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> System Admin
                        </p>
                    </div>

                    <div className="bg-[#f8f9fa] p-[24px] rounded-3xl shadow-sm border border-[#e0e3e5]">
                        <h3 className="text-[14px] font-bold text-[#74777f] uppercase tracking-wider mb-4">Employee Details</h3>
                        <div className="space-y-4 text-[14px]">
                            <div className="flex justify-between">
                                <span className="text-[#74777f]">Employee ID</span>
                                <span className="font-bold text-[#181c1e]">{profile.employeeId}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-[#74777f]">Join Date</span>
                                <span className="font-bold text-[#181c1e]">{profile.joinDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information Form */}
                <div className="md:col-span-2 space-y-[24px]">
                    {/* Personal Information Section */}
                    <div className="bg-white p-[32px] rounded-3xl shadow-sm border border-[#e0e3e5]">
                        <div className="flex justify-between items-center mb-6 border-b border-[#e0e3e5] pb-4">
                            <h3 className="text-[20px] font-bold text-[#002045]">Personal Information</h3>
                            {isInfoSaved && (
                                <span className="text-green-600 font-bold text-[14px] flex items-center gap-1 animate-fade-in">
                                    <CheckCircle2 className="w-4 h-4" /> Saved!
                                </span>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#181c1e] flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#74777f]" /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    value={profile.fullName} 
                                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#181c1e] flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#74777f]" /> Email Address
                                </label>
                                <input 
                                    type="email" 
                                    value={profile.email} 
                                    disabled
                                    className="w-full px-4 py-2.5 bg-[#e0e3e5]/50 border border-[#c4c6cf] rounded-xl text-[#74777f] font-medium cursor-not-allowed focus:outline-none" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#181c1e] flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#74777f]" /> Phone Number
                                </label>
                                <input 
                                    type="text" 
                                    value={profile.phone} 
                                    onChange={e => setProfile({...profile, phone: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#181c1e] flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#74777f]" /> Location
                                </label>
                                <input 
                                    type="text" 
                                    value={profile.location} 
                                    onChange={e => setProfile({...profile, location: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors" 
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={handleSaveInfo}
                                className="px-6 py-2.5 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] transition-colors shadow-sm"
                            >
                                Save Info Changes
                            </button>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="bg-white p-[32px] rounded-3xl shadow-sm border border-[#e0e3e5]">
                        <div className="flex justify-between items-center mb-6 border-b border-[#e0e3e5] pb-4">
                            <h3 className="text-[20px] font-bold text-[#002045]">Change Password</h3>
                            {isPasswordSaved && (
                                <span className="text-green-600 font-bold text-[14px] flex items-center gap-1 animate-fade-in">
                                    <CheckCircle2 className="w-4 h-4" /> Password Updated!
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-[20px]">
                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#181c1e]">Current Password</label>
                                <div className="relative">
                                    <input 
                                        type={showCurrentPassword ? "text" : "password"} 
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors pr-12" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e]"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#181c1e]">New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? "text" : "password"} 
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors pr-12" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e]"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#181c1e]">Confirm New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors pr-12" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e]"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={handleUpdatePassword}
                                className="px-6 py-2.5 bg-white border border-[#0061a5] text-[#0061a5] rounded-xl font-bold hover:bg-[#e6f0fa] transition-colors shadow-sm"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
