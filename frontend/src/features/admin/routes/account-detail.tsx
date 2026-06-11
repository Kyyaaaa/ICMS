import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, CheckCircle2, ShieldAlert, Save, Key, Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { validatePassword, validatePhoneNumber, validateFullName } from '@/shared/lib/utils';
import { AccountsService } from '../services/accounts.service';

const AdminAccountDetail = () => {
    const { id } = useParams();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isPasswordSaved, setIsPasswordSaved] = useState(false);
    
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);

    const [account, setAccount] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        gender: '',
        role: 'LEARNER',
        is_active: true,
        created_at: '',
        password: '',
        confirm_password: '',
        avatar_url: ''
    });

    useEffect(() => {
        const fetchAccount = async () => {
            const userInfoStr = Cookies.get('user_info');
            if (userInfoStr) {
                try {
                    setCurrentUser(JSON.parse(userInfoStr));
                } catch (e) {
                    console.error('Error parsing user_info cookie', e);
                }
            }

            setIsLoading(true);
            try {
                if (!id) return;
                const data = await AccountsService.getAccountById(id);
                if (data && typeof data === 'object' && 'success' in data && data.success) {
                    setAccount(prev => ({
                        ...prev,
                        full_name: data.data.full_name || '',
                        email: data.data.email,
                        phone_number: data.data.phone_number || '',
                        date_of_birth: data.data.date_of_birth || '',
                        gender: data.data.gender || '',
                        role: data.data.role,
                        is_active: data.data.status === 'ACTIVE',
                        created_at: new Date(data.data.created_at).toLocaleDateString(),
                        avatar_url: data.data.avatar_url || ''
                    }));
                } else {
                    alert((data as { message?: string })?.message || 'Failed to fetch account details');
                }
            } catch (error) {
                console.error('Error fetching account:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccount();
    }, [id]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (account.full_name && !validateFullName(account.full_name)) {
            alert('Invalid full name. Must be 2-50 characters and contain only letters and spaces.');
            return;
        }
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
        setIsSaving(true);
        try {
            if (!id) return;
            const data = await AccountsService.updateAccount(id, {
                full_name: account.full_name,
                phone_number: account.phone_number,
                date_of_birth: account.date_of_birth,
                gender: account.gender
            });
            
            if (data && typeof data === 'object' && 'success' in data && data.success) {
                const userInfoStr = Cookies.get('user_info');
                if (userInfoStr && id) {
                    try {
                        const userInfo = JSON.parse(userInfoStr);
                        if (userInfo.id === id) {
                            const updatedUserInfo = {
                                ...userInfo,
                                full_name: account.full_name,
                            };
                            Cookies.set('user_info', JSON.stringify(updatedUserInfo), { path: '/' });
                            window.dispatchEvent(new Event('profileUpdated'));
                        }
                    } catch (e) {
                        console.error('Error parsing user_info cookie', e);
                    }
                }

                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                alert((data as { message?: string })?.message || 'Failed to save profile.');
            }
        } catch {
            alert('An error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (account.password !== account.confirm_password) {
            alert('Passwords do not match!');
            return;
        }
        if (!validatePassword(account.password)) {
            alert('Invalid password.\nRequirements: 8-15 characters, including at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.');
            return;
        }

        setIsSavingPassword(true);
        try {
            if (!id) return;
            const data = await AccountsService.updateAccount(id, {
                password: account.password
            });
            
            if (data && typeof data === 'object' && 'success' in data && data.success) {
                setAccount({ ...account, password: '', confirm_password: '' });
                setIsPasswordSaved(true);
                setTimeout(() => setIsPasswordSaved(false), 3000);
            } else {
                alert((data as { message?: string })?.message || 'Failed to update password.');
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

    const isSelf = currentUser?.id === id;
    const isSameRoleButDifferentId = currentUser?.role === account.role && !isSelf;
    const canEdit = !isSameRoleButDifferentId;

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/accounts" className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl md:text-4xl font-bold text-[#002045]">Account Detail</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6 flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold text-5xl border-4 border-[#e6f0fa] shadow-sm mb-4 overflow-hidden">
                            {account.avatar_url ? (
                                <img src={account.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                account.full_name ? account.full_name.charAt(0).toUpperCase() : 'U'
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-[#002045]">{account.full_name || ''}</h2>
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-[#e8def8] text-[#6750a4] text-[13px] font-bold rounded uppercase">{account.role}</span>
                            {account.is_active ? (
                                <span className="flex items-center gap-1.5 text-[#137333] text-[13px] font-bold">
                                    <CheckCircle2 size={16} /> Active Account
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
                                <span>Joined {account.created_at}</span>
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
                        {!canEdit && (
                            <div className="mx-6 mt-4 p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[13px] font-bold flex items-center gap-2 border border-[#ba1a1a]/20">
                                <ShieldAlert size={18} />
                                You cannot edit the profile of an account with the same role as yours.
                            </div>
                        )}
                        <form onSubmit={handleSaveProfile} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={account.full_name}
                                        onChange={e => setAccount({...account, full_name: e.target.value})}
                                        className={`w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors ${!canEdit ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                        required 
                                        disabled={!canEdit}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input 
                                            type="tel" 
                                            value={account.phone_number}
                                            onChange={e => setAccount({...account, phone_number: e.target.value})}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors ${!canEdit ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                            disabled={!canEdit}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input 
                                            type="date" 
                                            value={account.date_of_birth}
                                            onChange={e => setAccount({...account, date_of_birth: e.target.value})}
                                            max={new Date().toISOString().split('T')[0]}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors ${!canEdit ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                            disabled={!canEdit}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Gender</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <select 
                                            value={account.gender}
                                            onChange={e => setAccount({...account, gender: e.target.value})}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors appearance-none ${!canEdit ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                                            disabled={!canEdit}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                    <input 
                                        type="email" 
                                        value={account.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#e0e3e5] border border-[#c4c6cf] rounded-xl text-[14px] text-[#74777f] cursor-not-allowed" 
                                    />
                                </div>
                                <p className="text-[12px] text-[#74777f] mt-1">Email address cannot be changed.</p>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e0e3e5]">
                                {isSaved && <span className="text-[13px] text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Saved changes</span>}
                                <button type="submit" disabled={isSaving || !canEdit} className="bg-[#0061a5] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold flex items-center gap-2 hover:bg-[#004d80] transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
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
                        {!canEdit && (
                            <div className="mx-6 mt-4 p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[13px] font-bold flex items-center gap-2 border border-[#ba1a1a]/20">
                                <ShieldAlert size={18} />
                                You cannot reset the password of an account with the same role as yours.
                            </div>
                        )}
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
                                            value={account.password}
                                            onChange={e => setAccount({...account, password: e.target.value})}
                                            className={`w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors ${!canEdit ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                            required 
                                            minLength={8} 
                                            disabled={!canEdit}
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
                                            value={account.confirm_password}
                                            onChange={e => setAccount({...account, confirm_password: e.target.value})}
                                            className={`w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border ${account.confirm_password.length > 0 && account.password === account.confirm_password ? 'border-green-500 shadow-[0_0_0_1px_#22c55e]' : account.confirm_password.length > 0 && account.password !== account.confirm_password ? 'border-red-500 shadow-[0_0_0_1px_#ef4444]' : 'border-[#c4c6cf]'} rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors ${!canEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            required 
                                            minLength={8} 
                                            disabled={!canEdit}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end gap-4">
                                {isPasswordSaved && <span className="text-[13px] text-[#137333] font-bold flex items-center gap-1.5 animate-fade-in"><CheckCircle2 className="w-4 h-4"/> Password Updated</span>}
                                <button type="submit" disabled={isSavingPassword || !canEdit} className="bg-white border-2 border-[#0061a5] text-[#0061a5] px-6 py-2.5 rounded-xl text-[15px] font-bold hover:bg-[#e6f0fa] transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
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
