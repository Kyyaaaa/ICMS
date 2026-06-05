import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CheckCircle2, ShieldAlert, Save, Key, Eye, EyeOff } from 'lucide-react';

const AdminAccountDetail = () => {
    const { id } = useParams();
    
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isPasswordSaved, setIsPasswordSaved] = useState(false);
    
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Mock data for the specific user
    const [account, setAccount] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        address: '123 Education St, NY',
        role: 'Tutor',
        status: 'Active',
        joinedDate: '12-10-2024'
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }, 1000);
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingPassword(true);
        setTimeout(() => {
            setIsSavingPassword(false);
            setIsPasswordSaved(true);
            setTimeout(() => setIsPasswordSaved(false), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/accounts" className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Account Detail</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6 flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold text-[48px] border-4 border-[#e6f0fa] shadow-sm mb-4">
                            JD
                        </div>
                        <h2 className="text-[20px] font-bold text-[#002045]">{account.name}</h2>
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-[#e8def8] text-[#6750a4] text-[13px] font-bold rounded uppercase">{account.role}</span>
                            {account.status === 'Active' ? (
                                <span className="flex items-center gap-1.5 text-[#137333] text-[13px] font-bold">
                                    <CheckCircle2 size={16} /> Verified Active
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-[#ba1a1a] text-[13px] font-bold">
                                    <ShieldAlert size={16} /> Banned Account
                                </span>
                            )}
                        </div>
                        
                        <div className="w-full mt-6 pt-6 border-t border-[#e0e3e5] space-y-3">
                            <div className="flex items-center gap-3 text-[14px] text-[#43474e]">
                                <Calendar className="w-5 h-5 text-[#74777f] shrink-0" />
                                <span>Joined {account.joinedDate}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[14px] text-[#43474e]">
                                <MapPin className="w-5 h-5 text-[#74777f] shrink-0" />
                                <span className="text-left line-clamp-2">{account.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Settings Form */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e0e3e5] bg-[#f8f9fa] flex items-center justify-between">
                            <h2 className="text-[16px] font-bold text-[#002045] flex items-center gap-2">
                                <User size={20} />
                                Profile Information
                            </h2>
                        </div>
                        <form onSubmit={handleSaveProfile} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={account.name}
                                        onChange={e => setAccount({...account, name: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                    <select 
                                        value={account.role}
                                        onChange={e => setAccount({...account, role: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="Learner">Learner</option>
                                        <option value="Tutor">Tutor</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input 
                                            type="email" 
                                            value={account.email}
                                            onChange={e => setAccount({...account, email: e.target.value})}
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input 
                                            type="tel" 
                                            value={account.phone}
                                            onChange={e => setAccount({...account, phone: e.target.value})}
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Home Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                    <input 
                                        type="text" 
                                        value={account.address}
                                        onChange={e => setAccount({...account, address: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e0e3e5]">
                                {isSaved && <span className="text-[13px] text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Saved changes</span>}
                                <button type="submit" disabled={isSaving} className="bg-[#0061a5] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold flex items-center gap-2 hover:bg-[#004d80] transition-colors disabled:opacity-70">
                                    <Save size={18} />
                                    {isSaving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Reset Password Form */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e0e3e5] bg-[#f8f9fa] flex items-center justify-between">
                            <h2 className="text-[16px] font-bold text-[#002045] flex items-center gap-2">
                                <Key size={20} />
                                Reset Account Password
                            </h2>
                        </div>
                        <form onSubmit={handleSavePassword} className="p-6">
                            <p className="text-[14px] text-[#74777f] mb-6">
                                As an administrator, you can reset the password for this user without needing their current password. 
                                Make sure to communicate the new password securely to the user.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#181c1e]">New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? "text" : "password"} 
                                            className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                            required 
                                            minLength={8} 
                                        />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                            {showNewPassword ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#181c1e]">Confirm New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? "text" : "password"} 
                                            className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                            required 
                                            minLength={8} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end gap-4">
                                {isPasswordSaved && <span className="text-[13px] text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Password Updated</span>}
                                <button type="submit" disabled={isSavingPassword} className="bg-white border-2 border-[#0061a5] text-[#0061a5] px-6 py-2.5 rounded-xl text-[15px] font-bold hover:bg-[#e6f0fa] transition-colors disabled:opacity-70">
                                    {isSavingPassword ? 'Updating...' : 'Set New Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAccountDetail;
