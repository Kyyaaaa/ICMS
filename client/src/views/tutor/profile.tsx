import { useState, useEffect } from 'react';
import { Camera, Eye, EyeOff, CheckCircle2, User, Phone, Mail, CalendarDays, Users } from 'lucide-react';
import Cookies from 'js-cookie';
import { validatePassword, validatePhoneNumber } from '../../lib/utils';

const TutorProfile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isProfileSuccess, setIsProfileSuccess] = useState(false);

    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [account, setAccount] = useState({
        id: '',
        full_name: '',
        phone_number: '',
        date_of_birth: '',
        gender: '',
        email: '',
        role: '',
        created_at: '',
        avatar_url: ''
    });

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfoStr = Cookies.get('user_info');
                if (!userInfoStr) return;
                const userInfo = JSON.parse(userInfoStr);
                const token = Cookies.get('access_token');
                
                const res = await fetch(`http://localhost:5000/api/accounts/${userInfo.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setAccount({
                        id: data.data.id,
                        full_name: data.data.full_name || '',
                        phone_number: data.data.phone_number || '',
                        date_of_birth: data.data.date_of_birth || '',
                        gender: data.data.gender || '',
                        email: data.data.email,
                        role: data.data.role,
                        created_at: data.data.created_at || '',
                        avatar_url: data.data.avatar_url || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate phone number format before submitting
        if (account.phone_number && !validatePhoneNumber(account.phone_number)) {
            alert('Invalid phone number. Must be a valid 10-digit Vietnamese phone number starting with 03, 05, 07, 08, or 09.');
            return;
        }
        if (account.date_of_birth) {
            const dob = new Date(account.date_of_birth);
            const today = new Date();
            
            if (isNaN(dob.getTime())) {
                alert('Invalid Date of Birth format. Please use a valid date.');
                return;
            }
            
            const dateString = account.date_of_birth;
            if (dob.toISOString().split('T')[0] !== dateString) {
                alert('Invalid Date of Birth. The date does not exist (e.g., February 30th).');
                return;
            }

            if (dob > today) {
                alert('Invalid Date of Birth. Future dates are not allowed.');
                return;
            }
        }
        setIsSavingProfile(true);
        try {
            const token = Cookies.get('access_token');
            const res = await fetch(`http://localhost:5000/api/accounts/${account.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    full_name: account.full_name,
                    phone_number: account.phone_number,
                    date_of_birth: account.date_of_birth,
                    gender: account.gender
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update cookie to reflect new full_name across the app
                const userInfoStr = Cookies.get('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    userInfo.full_name = account.full_name;
                    Cookies.set('user_info', JSON.stringify(userInfo), { path: '/' });
                    window.dispatchEvent(new Event('profileUpdated'));
                }
                
                setIsProfileSuccess(true);
                setTimeout(() => setIsProfileSuccess(false), 3000);
            } else {
                alert(data.message || 'Failed to save profile.');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSavingProfile(false);
        }
    };


    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        try {
            const token = Cookies.get('access_token');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'avatar');

            const uploadRes = await fetch('http://localhost:5000/api/upload/image', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const uploadData = await uploadRes.json();
            
            if (uploadData.success) {
                const newAvatarUrl = uploadData.url;
                const saveRes = await fetch(`http://localhost:5000/api/accounts/${account.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ avatar_url: newAvatarUrl })
                });
                const saveData = await saveRes.json();
                
                if (saveData.success) {
                    setAccount({ ...account, avatar_url: newAvatarUrl });
                    
                    const userInfoStr = Cookies.get('user_info');
                    if (userInfoStr) {
                        const userInfo = JSON.parse(userInfoStr);
                        userInfo.avatar_url = newAvatarUrl;
                        Cookies.set('user_info', JSON.stringify(userInfo), { path: '/' });
                        window.location.reload();
                    }
                } else {
                    alert('Failed to save avatar to profile.');
                }
            } else {
                alert('Upload failed: ' + uploadData.message);
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            alert('An error occurred during upload.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        if (!validatePassword(passwords.newPassword)) {
            alert('Invalid new password.\nRequirements: 8-15 characters, including at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.');
            return;
        }
        setIsSavingPassword(true);
        try {
            const token = Cookies.get('access_token');
            const res = await fetch(`http://localhost:5000/api/accounts/${account.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    old_password: passwords.oldPassword,
                    password: passwords.newPassword
                })
            });
            const data = await res.json();
            if (data.success) {
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setIsPasswordSuccess(true);
                // Logout after successful password change
                setTimeout(() => {
                    Cookies.remove('access_token', { path: '/' });
                    Cookies.remove('refresh_token', { path: '/' });
                    Cookies.remove('user_info', { path: '/' });
                    window.location.href = '/homepage';
                }, 2000);
            } else {
                alert(data.message || 'Failed to update password.');
            }
        } catch {
            alert('An error occurred. Please try again.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const getInitials = (name: string) => {
        if (!name) return 'JD';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(account.full_name);
    
    const isPasswordMatch = passwords.confirmPassword.length > 0 && passwords.newPassword === passwords.confirmPassword;
    const isPasswordMismatch = passwords.confirmPassword.length > 0 && passwords.newPassword !== passwords.confirmPassword;

    return (
        <div className="max-w-4xl space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Profile</h1>
                <p className="text-[#74777f] text-[14px] mt-1">Manage your personal information and contact details.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6 flex flex-col items-center text-center">
                        <label className="relative w-32 h-32 rounded-full bg-[#edf4fb] flex items-center justify-center text-[#0061a5] font-bold text-[48px] border-4 border-[#e6f0fa] shadow-sm overflow-hidden group cursor-pointer mb-4">
                            {account.avatar_url ? (
                                <img src={account.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{initials}</span>
                            )}
                            <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isUploadingAvatar ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Camera className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
                        </label>
                        <h2 className="text-[20px] font-bold text-[#002045]">{account.full_name || ''}</h2>
                        <div className="mt-2">
                            <span className="px-3 py-1 bg-[#eadef7] text-[#4a0080] text-[12px] font-bold rounded-md uppercase tracking-wide">{account.role}</span>
                        </div>
                        
                        <div className="w-full mt-6 pt-6 border-t border-[#e0e3e5] space-y-4">
                            <div className="flex items-center gap-3 text-[14px] text-[#43474e]">
                                <CalendarDays className="w-5 h-5 text-[#74777f] shrink-0" />
                                <span>Joined {account.created_at ? new Date(account.created_at).toLocaleDateString() : ''}</span>
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
                                        <input type="text" value={account.full_name} onChange={e => setAccount({...account, full_name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="tel" value={account.phone_number} onChange={e => setAccount({...account, phone_number: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Date of Birth</label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="date" value={account.date_of_birth} onChange={e => setAccount({...account, date_of_birth: e.target.value})} max={new Date().toISOString().split('T')[0]} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors text-[#181c1e]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Gender</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <select value={account.gender} onChange={e => setAccount({...account, gender: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors text-[#181c1e] appearance-none">
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
                                    <input type="email" value={account.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#e0e3e5] rounded-xl text-[14px] text-[#74777f] cursor-not-allowed" />
                                </div>
                                <p className="text-[12px] text-[#74777f] mt-1">Institutional email address cannot be changed.</p>
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
                                        <input type={showOld ? "text" : "password"} value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} placeholder="Current password" className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] text-[#181c1e] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required />
                                        <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                            {showOld ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#181c1e]">New Password</label>
                                        <div className="relative">
                                            <input type={showNew ? "text" : "password"} value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} placeholder="New password" className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] text-[#181c1e] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required minLength={8} />
                                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                                {showNew ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#181c1e]">Confirm New Password</label>
                                        <div className="relative">
                                            <input type={showConfirm ? "text" : "password"} value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} placeholder="Confirm new password" className={`w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border ${isPasswordMatch ? 'border-green-500 shadow-[0_0_0_1px_#22c55e]' : isPasswordMismatch ? 'border-red-500 shadow-[0_0_0_1px_#ef4444]' : 'border-[#c4c6cf]'} rounded-xl text-[14px] text-[#181c1e] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors`} required minLength={8} />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                                {showConfirm ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                {isPasswordSuccess && <span className="text-[13px] text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Password changed! Logging out...</span>}
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

export default TutorProfile;
