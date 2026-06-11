import { useState, useEffect, useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import { validateFullName, validatePassword } from '@/shared/lib/utils';
import type { Account, Role } from '../types/account';
import { AccountsService } from '../services/accounts.service';
import { AccountsFilters } from '../components/AccountsFilters';
import { AccountsTable } from '../components/AccountsTable';
import { AccountFormModal } from '../components/AccountFormModal';
import Cookies from 'js-cookie';

const ManageAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const limit = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState<Partial<Account> & { password?: string }>({ full_name: '', email: '', role: 'LEARNER', status: 'ACTIVE', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);

    useEffect(() => {
        const userInfoStr = Cookies.get('user_info');
        if (userInfoStr) {
            try {
                setCurrentUser(JSON.parse(userInfoStr));
            } catch (e) {
                console.error('Error parsing user_info cookie', e);
            }
        }
    }, []);

    const generatePassword = () => {
        const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowers = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specials = '!@#$%^&*';
        
        let pass = '';
        pass += uppers[Math.floor(Math.random() * uppers.length)];
        pass += lowers[Math.floor(Math.random() * lowers.length)];
        pass += numbers[Math.floor(Math.random() * numbers.length)];
        pass += specials[Math.floor(Math.random() * specials.length)];
        
        const allChars = uppers + lowers + numbers + specials;
        for (let i = 0; i < 6; i++) {
            pass += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        pass = pass.split('').sort(() => 0.5 - Math.random()).join('');
        setFormData({ ...formData, password: pass });
        setShowPassword(true);
    };

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await AccountsService.getAccounts({
                page: currentPage,
                limit,
                role: roleFilter,
                search: searchTerm
            });
            
            if (data && typeof data === 'object' && 'success' in data && data.success) {
                const responseData = (data as { data: { data: Account[]; total: number } | Account[] }).data;
                const accountsData = Array.isArray(responseData) ? responseData : responseData.data || [];
                const total = !Array.isArray(responseData) ? responseData.total : accountsData.length;
                
                setAccounts(accountsData);
                setTotalAccounts(total);
            } else {
                setError((data as { message?: string })?.message || 'Failed to fetch accounts');
            }
        } catch {
            setError('An error occurred while fetching accounts');
        } finally {
            setLoading(false);
        }
    }, [roleFilter, searchTerm, currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAccounts();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchAccounts]);

    const handleOpenModal = (mode: 'create' | 'edit', account?: Account) => {
        setModalMode(mode);
        if (mode === 'edit' && account) {
            setFormData({ ...account, password: '' });
        } else {
            setFormData({ full_name: '', email: '', role: 'LEARNER', status: 'ACTIVE', password: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.full_name && !validateFullName(formData.full_name)) {
            alert('Invalid full name. Must be 2-50 characters and contain only letters and spaces.');
            return;
        }

        if (formData.password && !validatePassword(formData.password)) {
            alert('Password must be 8-15 characters long, and include at least one lowercase letter, one uppercase letter, one number, and one special character.');
            return;
        }

        setIsSaving(true);
        try {
            if (modalMode === 'create') {
                const data = await AccountsService.createAccount(formData);
                if (data && typeof data === 'object' && 'success' in data && data.success) {
                    setIsModalOpen(false);
                    fetchAccounts();
                    alert('Account created successfully!');
                } else {
                    alert((data as { message?: string })?.message || 'Failed to create account');
                }
            } else {
                if (!formData.id) return;
                const updatePayload: Record<string, unknown> = {
                    full_name: formData.full_name,
                    email: formData.email,
                    role: formData.role,
                    status: formData.status
                };
                if (formData.password) {
                    updatePayload.password = formData.password;
                }
                const data = await AccountsService.updateAccount(formData.id, updatePayload);
                if (data && typeof data === 'object' && 'success' in data && data.success) {
                    setIsModalOpen(false);
                    fetchAccounts();
                    
                    const userInfoStr = Cookies.get('user_info');
                    if (userInfoStr) {
                        try {
                            const userInfo = JSON.parse(userInfoStr);
                            if (userInfo.id === formData.id) {
                                const updatedUserInfo = {
                                    ...userInfo,
                                    full_name: formData.full_name,
                                    email: formData.email,
                                    role: formData.role
                                };
                                Cookies.set('user_info', JSON.stringify(updatedUserInfo), { path: '/' });
                                window.dispatchEvent(new Event('profileUpdated'));
                            }
                        } catch (e) {
                            console.error('Error parsing user_info cookie', e);
                        }
                    }

                    setTimeout(() => {
                        alert('Account updated successfully!');
                    }, 100);
                } else {
                    alert((data as { message?: string })?.message || 'Failed to update account');
                }
            }
        } catch (error: unknown) {
            console.error('Save account error:', error);
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to save account';
            alert(`An error occurred while saving account: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleBan = async (id: string, currentStatus: boolean) => {
        try {
            const data = await AccountsService.toggleBan(id, !currentStatus);
            if (data && typeof data === 'object' && 'success' in data && data.success) {
                setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: currentStatus ? 'BANNED' : 'ACTIVE' } : acc));
                alert(`Account successfully ${currentStatus ? 'banned' : 'unbanned'}.`);
            } else {
                alert((data as { message?: string })?.message || 'Failed to update status');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred while updating status';
            alert(`Failed to update status: ${errorMessage}`);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Account Management</h1>
                    <p className="text-[14px] text-[#43474e] mt-1">Manage Learner and Tutor accounts in the system.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="px-5 py-2.5 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <UserPlus size={20} />
                    New Account
                </button>
            </div>

            <AccountsFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
            />

            <AccountsTable 
                accounts={accounts}
                loading={loading}
                error={error}
                currentPage={currentPage}
                totalAccounts={totalAccounts}
                limit={limit}
                setCurrentPage={setCurrentPage}
                handleOpenModal={handleOpenModal}
                handleToggleBan={handleToggleBan}
                currentUser={currentUser}
            />

            <AccountFormModal 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                modalMode={modalMode}
                formData={formData}
                setFormData={setFormData}
                isSaving={isSaving}
                handleSave={handleSave}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                generatePassword={generatePassword}
            />
        </div>
    );
};

export default ManageAccounts;
