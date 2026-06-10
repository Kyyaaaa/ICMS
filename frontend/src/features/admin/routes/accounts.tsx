import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { validateFullName, validatePassword } from '@/shared/lib/utils';
import type { Account, Role } from '../types/account';
import { AccountsService } from '../services/accounts.service';
import { AccountsFilters } from '../components/AccountsFilters';
import { AccountsTable } from '../components/AccountsTable';
import { AccountFormModal } from '../components/AccountFormModal';

const AdminAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<Role | 'All'>('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const limit = 10;
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState<Partial<Account> & { password?: string }>({ full_name: '', email: '', role: 'LEARNER', status: 'ACTIVE', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    const handleOpenModal = (mode: 'create' | 'edit', account?: Account) => {
        setModalMode(mode);
        if (mode === 'edit' && account) {
            setFormData({ ...account, password: '' });
        } else {
            setFormData({ full_name: '', email: '', role: 'LEARNER', status: 'ACTIVE', password: '' });
        }
        setIsModalOpen(true);
    };

    const fetchAccounts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await AccountsService.getAccounts({
                page: currentPage,
                limit,
                role: filterRole,
                search: searchQuery
            });
            
            if (data && typeof data === 'object' && 'success' in data && data.success) {
                const responseData = (data as { data: { data: Account[]; total: number } | Account[] }).data;
                const accountsData = Array.isArray(responseData) ? responseData : responseData.data || [];
                const total = !Array.isArray(responseData) ? responseData.total : accountsData.length;
                const sortedData = accountsData.sort((a: Account, b: Account) => {
                    const roleOrder: Record<Role, number> = { 'ADMIN': 1, 'STAFF': 2, 'TUTOR': 3, 'LEARNER': 4 };
                    return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
                });
                setAccounts(sortedData);
                setTotalAccounts(total);
            } else {
                setError((data as { message?: string }).message || 'Failed to fetch accounts');
            }
        } catch {
            setError('An error occurred while fetching accounts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAccounts();
        }, 250); // Debounce search
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, filterRole, currentPage]);

    const handleToggleBan = async (id: string, currentStatus: boolean) => {
        try {
            const data = await AccountsService.toggleBan(id, !currentStatus);
            if (data && typeof data === 'object' && 'success' in data && data.success) {
                setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: currentStatus ? 'BANNED' : 'ACTIVE' } : acc));
            } else {
                alert((data as { message?: string })?.message || 'Failed to update status');
            }
        } catch {
            alert('An error occurred while updating status');
        }
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
                } else {
                    alert((data as { message?: string })?.message || 'Failed to create account');
                }
            } else {
                if (!formData.id) return;
                const data = await AccountsService.updateAccount(formData.id, formData);
                if (data && typeof data === 'object' && 'success' in data && data.success) {
                    setIsModalOpen(false);
                    fetchAccounts();
                } else {
                    alert((data as { message?: string })?.message || 'Failed to update account');
                }
            }
        } catch {
            alert('An error occurred while saving account');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Manage Accounts</h1>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="px-5 py-2.5 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus size={20} />
                    Create Account
                </button>
            </div>

            <AccountsFilters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
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

export default AdminAccounts;
