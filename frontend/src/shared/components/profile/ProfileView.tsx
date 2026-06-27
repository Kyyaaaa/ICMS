import { getLocalDateString } from '../../../utils/date';
import { formatDate } from "../../utils/date";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Camera, Eye, EyeOff, CheckCircle2, User, Phone, Mail, CalendarDays, Users } from 'lucide-react';
import Cookies from 'js-cookie';
import { validatePassword, validatePhoneNumber, validateFullName, formatAccountID } from '@/shared/lib/utils';
import { ProfileService } from '@/shared/services/profile.service';
import type { ProfileData } from '@/shared/services/profile.service';
import { showAlertModal, showConfirmModal } from '@/utils/modal';

interface ProfileViewProps {
    title?: string;
    description?: string;
    emailHint?: string;
}

export const ProfileView = ({
    title = "My Profile",
    description = "Manage your personal information and account security.",
    emailHint = "Email address cannot be changed once registered."
}: ProfileViewProps) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isProfileSuccess, setIsProfileSuccess] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);
    
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const [account, setAccount] = useState<ProfileData>({
        id: '',
        full_name: '',
        phone_number: '',
        date_of_birth: '',
        gender: '',
        email: '',
        role: '',
        account_code: '',
        created_at: '',
        avatar_url: ''
    });

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
                
                const data = await ProfileService.getProfile(userInfo.id);
                if (data.success) {
                    if (data && typeof data === 'object' && 'data' in data && data.data) {
                        const responseData = data.data as ProfileData;
                        setAccount({
                            id: responseData.id,
                            full_name: responseData.full_name || '',
                            phone_number: responseData.phone_number || '',
                            date_of_birth: responseData.date_of_birth || '',
                            gender: responseData.gender ? responseData.gender.toLowerCase() : '',
                            email: responseData.email,
                            role: responseData.role,
                            account_code: responseData.account_code || '',
                            created_at: responseData.created_at || '',
                            avatar_url: responseData.avatar_url || ''
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (location.state?.requireProfileUpdate) {
            showAlertModal('Action Required', 'Please complete your profile (Phone Number, Date of Birth, Gender) before navigating to other pages.', 'warning');
            // Xóa state để không hiện lại nếu người dùng ấn F5
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (account.full_name && !validateFullName(account.full_name)) {
            showAlertModal('Error', 'Invalid full name. Must be 2-50 characters and contain only letters and spaces.', 'error');
            return;
        }
        
        if (account.phone_number && !validatePhoneNumber(account.phone_number)) {
            showAlertModal('Error', 'Invalid phone number. Must be a valid 10-digit Vietnamese phone number starting with 03, 05, 07, 08, or 09.', 'error');
            return;
        }
        
        if (account.date_of_birth) {
            const dob = new Date(account.date_of_birth);
            const today = new Date();
            if (isNaN(dob.getTime())) {
                showAlertModal('Error', 'Invalid Date of Birth format. Please use a valid date.', 'error');
                return;
            }
            const dateString = account.date_of_birth;
            if (getLocalDateString(dob) !== dateString) {
                showAlertModal('Error', 'Invalid Date of Birth. The date does not exist (e.g., February 30th).', 'error');
                return;
            }
            if (dob > today) {
                showAlertModal('Error', 'Invalid Date of Birth. Future dates are not allowed.', 'error');
                return;
            }
        }
        
        setIsSavingProfile(true);
        try {
            const isConfirmed = await showConfirmModal('Confirm Update', 'Are you sure you want to save these profile changes?', 'warning');
            if (!isConfirmed) {
                setIsSavingProfile(false);
                return;
            }
            const data = await ProfileService.updateProfile(account.id, {
                full_name: account.full_name.trim(),
                phone_number: account.phone_number,
                date_of_birth: account.date_of_birth,
                gender: account.gender
            });
            
            if (data.success) {
                const userInfoStr = Cookies.get('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    const updatedInfo = {
                        ...userInfo,
                        full_name: account.full_name.trim(),
                        phone_number: account.phone_number,
                        date_of_birth: account.date_of_birth,
                        gender: account.gender
                    };
                    Cookies.set('user_info', JSON.stringify(updatedInfo), { path: '/' });
                    // Gửi sự kiện để TopNav/Layout cập nhật ngay lập tức
                    window.dispatchEvent(new Event('profileUpdated'));
                }
                
                setIsProfileSuccess(true);
                setTimeout(() => setIsProfileSuccess(false), 3000);
            } else {
                showAlertModal('Notification', (data as { message?: string })?.message || 'Failed to save profile.', 'info');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            showAlertModal('Error', 'An error occurred. Please try again.', 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isConfirmed = await showConfirmModal('Confirm Avatar', 'Are you sure you want to update your avatar?', 'warning');
        if (!isConfirmed) {
            e.target.value = '';
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const uploadData = await ProfileService.uploadAvatar(file);
            
            if (uploadData.success) {
                const newAvatarUrl = (uploadData as { url: string }).url;
                const saveData = await ProfileService.updateProfile(account.id, { avatar_url: newAvatarUrl });
                
                if (saveData.success) {
                    setAccount({ ...account, avatar_url: newAvatarUrl });
                    
                    const userInfoStr = Cookies.get('user_info');
                    if (userInfoStr) {
                        const userInfo = JSON.parse(userInfoStr);
                        userInfo.avatar_url = newAvatarUrl;
                        Cookies.set('user_info', JSON.stringify(userInfo), { path: '/' });
                        window.dispatchEvent(new Event('profileUpdated'));
                    }
                } else {
                    showAlertModal('Error', 'Failed to save avatar to profile.', 'error');
                }
            } else {
                showAlertModal('Error', 'Upload failed: ' + ((uploadData as { message?: string })?.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            showAlertModal('Error', 'An error occurred during upload.', 'error');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            showAlertModal('Error', 'New passwords do not match!', 'error');
            return;
        }
        if (!validatePassword(passwords.newPassword)) {
            showAlertModal('Error', 'Invalid new password.\\nRequirements: 8-15 characters, including at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.', 'error');
            return;
        }
        setIsSavingPassword(true);
        try {
            const isConfirmed = await showConfirmModal('Confirm Update', 'Are you sure you want to update your password? You will be logged out after a successful update.', 'warning');
            if (!isConfirmed) {
                setIsSavingPassword(false);
                return;
            }
            const data = await ProfileService.updatePassword(account.id, {
                old_password: passwords.oldPassword,
                password: passwords.newPassword
            });
            
            if (data.success) {
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setIsPasswordSuccess(true);
                setTimeout(() => {
                    Cookies.remove('access_token', { path: '/' });
                    Cookies.remove('refresh_token', { path: '/' });
                    Cookies.remove('user_info', { path: '/' });
                    window.location.href = '/homepage';
                }, 2000);
            } else {
                showAlertModal('Notification', (data as { message?: string })?.message || 'Failed to update password.', 'info');
            }
        } catch {
            showAlertModal('Error', 'An error occurred. Please try again.', 'error');
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
        if (!name) return 'UN';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(account.full_name);
    const isPasswordMatch = passwords.confirmPassword.length > 0 && passwords.newPassword === passwords.confirmPassword;
    const isPasswordMismatch = passwords.confirmPassword.length > 0 && passwords.newPassword !== passwords.confirmPassword;
    
    const isProfileIncomplete = !account.phone_number || !account.date_of_birth || !account.gender;

    return (
        <div className="max-w-4xl space-y-6 animate-fade-in-up pb-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">{title}</h1>
                <p className="text-[#74777f] text-sm mt-1">{description}</p>
            </div>
            
            {isProfileIncomplete && (
                <div className="bg-[#fef7e0] border border-[#fbbc04] text-[#b06000] px-4 py-3 rounded-xl flex items-start gap-3">
                    <div className="mt-0.5">⚠️</div>
                    <div>
                        <h3 className="font-bold text-sm">Action Required: Complete Your Profile</h3>
                        <p className="text-xs mt-1">Please provide your Phone Number, Date of Birth, and Gender to continue using the system. You will not be able to navigate to other pages until your profile is complete.</p>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 flex flex-col items-center text-center">
                        <label className="relative w-32 h-32 rounded-full bg-[#edf4fb] flex items-center justify-center text-[#0061a5] font-bold text-5xl border-4 border-[#e6f0fa] shadow-sm overflow-hidden group cursor-pointer mb-4">
                            <span>{initials}</span>
                            {account.avatar_url && (
                                <img src={account.avatar_url} alt="Avatar" className="w-full h-full object-cover absolute inset-0 z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
                        <h2 className="text-xl font-bold text-[#002045]">{account.full_name || ''}</h2>
                        <div className="mt-2">
                            <span className="px-3 py-1 bg-[#eadef7] text-[#4a0080] text-xs font-bold rounded-md uppercase tracking-wide">{account.role}</span>
                        </div>
                        
                        <div className="w-full mt-6 pt-6 border-t border-[#e0e3e5] space-y-4">
                            <div className="flex items-center gap-3 text-sm text-[#43474e]">
                                <Users className="w-5 h-5 text-[#74777f] shrink-0" />
                                <span>ID: {formatAccountID(account.account_code || account.id, account.role)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#43474e]">
                                <CalendarDays className="w-5 h-5 text-[#74777f] shrink-0" />
                                <span>Joined {account.created_at ? formatDate(account.created_at) : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                            <h2 className="text-base font-bold text-[#002045]">Personal Information</h2>
                        </div>
                        <form onSubmit={handleSaveProfile} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="text" value={account.full_name} onChange={e => setAccount({...account, full_name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="tel" value={account.phone_number} onChange={e => setAccount({...account, phone_number: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Date of Birth</label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input type="date" value={account.date_of_birth} onChange={e => setAccount({...account, date_of_birth: e.target.value})} max={getLocalDateString()} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors text-[#181c1e]" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Gender</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <select value={account.gender?.toUpperCase() || ''} onChange={e => setAccount({...account, gender: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors text-[#181c1e] appearance-none" required>
                                            <option value="" disabled style={{ display: 'none' }}>Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                    <input type="email" value={account.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#e0e3e5] rounded-xl text-sm text-[#74777f] cursor-not-allowed" />
                                </div>
                                <p className="text-xs text-[#74777f] mt-1">{emailHint}</p>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e0e3e5]">
                                {isProfileSuccess && <span className="text-xs text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Saved successfully</span>}
                                <button type="submit" disabled={isSavingProfile} className="bg-[#0061a5] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#004d80] transition-colors disabled:opacity-70">
                                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6">
                        <div className="mb-6 pb-4 border-b border-[#e0e3e5]">
                            <h2 className="text-xl font-bold text-[#003366]">Change Password</h2>
                        </div>
                        <form onSubmit={handleSavePassword}>
                            <div className="space-y-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#181c1e]">Current Password</label>
                                    <div className="relative">
                                        <input type={showOld ? "text" : "password"} value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} placeholder="Current password" className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm text-[#181c1e] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required />
                                        <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                            {showOld ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#181c1e]">New Password</label>
                                        <div className="relative">
                                            <input type={showNew ? "text" : "password"} value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} placeholder="New password" className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm text-[#181c1e] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" required minLength={8} />
                                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                                {showNew ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#181c1e]">Confirm New Password</label>
                                        <div className="relative">
                                            <input type={showConfirm ? "text" : "password"} value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} placeholder="Confirm new password" className={`w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border ${isPasswordMatch ? 'border-green-500 shadow-[0_0_0_1px_#22c55e]' : isPasswordMismatch ? 'border-red-500 shadow-[0_0_0_1px_#ef4444]' : 'border-[#c4c6cf]'} rounded-xl text-sm text-[#181c1e] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors`} required minLength={8} />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045]">
                                                {showConfirm ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                {isPasswordSuccess && <span className="text-xs text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Password changed! Logging out...</span>}
                                <button type="submit" disabled={isSavingPassword} className="bg-white border-2 border-[#0061a5] text-[#0061a5] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#e6f0fa] transition-colors disabled:opacity-70">
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
