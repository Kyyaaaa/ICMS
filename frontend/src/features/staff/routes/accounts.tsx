import { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, Edit, Ban, CheckCircle2, ShieldAlert, X, RefreshCw, EyeOff, Eye, Unlock } from 'lucide-react';
import Cookies from 'js-cookie';
import { validateFullName, validatePassword } from '@/lib/utils';

type Role = 'ADMIN' | 'STAFF' | 'TUTOR' | 'LEARNER';

interface Account {
    id: string;
    full_name: string;
    email: string;
    role: Role;
    status: 'ACTIVE' | 'BANNED';
    created_at: string;
    avatar_url?: string;
}

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
            const token = Cookies.get('access_token');
            const url = new URL('http://localhost:5000/api/accounts');
            url.searchParams.append('page', currentPage.toString());
            url.searchParams.append('limit', limit.toString());
            if (roleFilter !== 'All') url.searchParams.append('role', roleFilter);
            if (searchTerm) url.searchParams.append('search', searchTerm);

            const res = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                const accountsData = Array.isArray(data.data) ? data.data : data.data.data || [];
                const total = !Array.isArray(data.data) ? data.data.total : accountsData.length;
                const sortedData = accountsData.sort((a: Account, b: Account) => {
                    const roleOrder: Record<Role, number> = { 'ADMIN': 1, 'STAFF': 2, 'TUTOR': 3, 'LEARNER': 4 };
                    return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
                });
                setAccounts(sortedData);
                setTotalAccounts(total);
            } else {
                setError(data.message || 'Failed to fetch accounts');
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
            const token = Cookies.get('access_token');
            if (modalMode === 'create') {
                const res = await fetch('http://localhost:5000/api/accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
                const data = await res.json();
                if (data.success) {
                    setIsModalOpen(false);
                    fetchAccounts();
                } else {
                    alert(data.message || 'Failed to create account');
                }
            } else {
                const res = await fetch(`http://localhost:5000/api/accounts/${formData.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
                const data = await res.json();
                if (data.success) {
                    setIsModalOpen(false);
                    fetchAccounts();
                } else {
                    alert(data.message || 'Failed to update account');
                }
            }
        } catch {
            alert('An error occurred while saving account');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleBan = async (id: string, currentStatus: boolean) => {
        try {
            const token = Cookies.get('access_token');
            const res = await fetch(`http://localhost:5000/api/accounts/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: currentStatus ? 'BANNED' : 'ACTIVE' } : acc));
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch {
            alert('An error occurred while updating status');
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'UN';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="space-y-[24px] animate-fade-in-up pb-[40px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[#002045]">Account Management</h1>
                    <p className="text-[#43474e] text-[15px] mt-1">Create and manage Learner and Tutor accounts. Banned accounts cannot log in.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="px-5 py-2.5 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] transition-colors flex items-center gap-2 shadow-sm"
                >
                    <UserPlus className="w-5 h-5" />
                    Create New Account
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden relative min-h-[300px]">
                <div className="p-5 border-b border-[#e0e3e5] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8f9fa]">
                    <div className="relative w-full max-w-md">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5]" 
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <select 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as Role | 'All')}
                            className="px-4 py-2 border border-[#c4c6cf] rounded-xl text-[14px] bg-white focus:outline-none focus:border-[#0061a5] font-semibold text-[#43474e] w-full sm:w-auto cursor-pointer"
                        >
                            <option value="All">All Roles</option>
                            <option value="LEARNER">Learner</option>
                            <option value="TUTOR">Tutor</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-white">
                            <tr>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">User</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Email</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Role</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Created At</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Status</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e0e3e5]">
                            {!loading && accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#74777f]">{error || "No accounts found matching your criteria."}</td>
                                </tr>
                            ) : (
                                accounts.map((user) => (
                                    <tr key={user.id} className={`hover:bg-[#f8f9fa] transition-colors ${user.status !== 'ACTIVE' ? 'opacity-80 bg-red-50/30' : ''}`}>
                                        <td className="p-4 font-bold text-[#002045] flex items-center gap-3">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#e0e3e5]" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] ${user.status !== 'ACTIVE' ? 'bg-red-100 text-red-700' : 'bg-[#e6f0fa] text-[#0061a5]'}`}>
                                                    {getInitials(user.full_name)}
                                                </div>
                                            )}
                                            <div>
                                                <div className={`text-[15px] ${user.status !== 'ACTIVE' ? 'text-[#ba1a1a]' : 'text-[#002045]'}`}>{user.full_name || ''}</div>
                                                {user.status !== 'ACTIVE' && <div className="text-[12px] text-[#ba1a1a] font-semibold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Restricted Access</div>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#43474e]">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full uppercase tracking-wider text-[11px] font-bold ${user.role === 'TUTOR' ? 'bg-[#e8def8] text-[#6750a4]' : 'bg-[#e6f4ea] text-[#137333]'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#74777f]">{new Date(user.created_at).toLocaleDateString('en-GB')}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold 
                                                ${user.status === 'ACTIVE' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#ffdad6] text-[#ba1a1a]'}`}
                                            >
                                                {user.status === 'ACTIVE' ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                {user.status === 'ACTIVE' ? 'Active' : 'Banned'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal('edit', user)}
                                                    className="p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors" title="Edit Account"
                                                >
                                                    <Edit className="w-4 h-4"/>
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleBan(user.id, user.status === 'ACTIVE')}
                                                    className={`p-2 rounded-lg transition-colors tooltip-trigger ${user.status === 'ACTIVE' ? 'text-[#ba1a1a] hover:bg-[#ffdad6]' : 'text-[#137333] hover:bg-[#e6f4ea]'}`} 
                                                    title={user.status === 'ACTIVE' ? "Ban Account" : "Unban Account"}
                                                >
                                                    {user.status === 'ACTIVE' ? <Ban className="w-4 h-4"/> : <Unlock className="w-4 h-4"/>}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination UI */}
                {totalAccounts > limit && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e3e5] bg-[#f8f9fa]">
                        <span className="text-[13px] text-[#43474e]">
                            Showing <span className="font-bold">{(currentPage - 1) * limit + 1}</span> to <span className="font-bold">{Math.min(currentPage * limit, totalAccounts)}</span> of <span className="font-bold">{totalAccounts}</span> accounts
                        </span>
                        <div className="flex gap-2">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1.5 border border-[#c4c6cf] rounded-lg text-[13px] font-bold text-[#43474e] bg-white hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button 
                                disabled={currentPage * limit >= totalAccounts}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-3 py-1.5 border border-[#c4c6cf] rounded-lg text-[13px] font-bold text-[#43474e] bg-white hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-scale-in">
                        <div className="flex justify-between items-center p-6 border-b border-[#e0e3e5]">
                            <h2 className="text-[20px] font-bold text-[#002045]">
                                {modalMode === 'create' ? 'Create New Account' : 'Edit Account'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#74777f] hover:text-[#181c1e] transition-colors p-1 rounded-lg hover:bg-[#f1f4f6]"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.full_name}
                                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {modalMode === 'create' ? (
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                        <select 
                                            value={formData.role}
                                            onChange={e => setFormData({...formData, role: e.target.value as Role})}
                                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors cursor-pointer"
                                        >
                                            <option value="LEARNER">Learner</option>
                                            <option value="TUTOR">Tutor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Password</label>
                                            <button type="button" onClick={generatePassword} className="text-[#0061a5] text-[12px] font-bold hover:underline flex items-center gap-1 transition-colors">
                                                <RefreshCw size={12} /> Generate
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                                                placeholder="Enter or generate"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors p-1">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                            <select 
                                                value={formData.role}
                                                onChange={e => setFormData({...formData, role: e.target.value as Role})}
                                                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors cursor-pointer"
                                            >
                                                <option value="LEARNER">Learner</option>
                                                <option value="TUTOR">Tutor</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Status</label>
                                            <select 
                                                value={formData.status}
                                                onChange={e => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'BANNED'})}
                                                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors cursor-pointer"
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="BANNED">Banned</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">New Password <span className="text-[#74777f] font-normal normal-case">(Leave blank to keep)</span></label>
                                            <button type="button" onClick={generatePassword} className="text-[#0061a5] text-[12px] font-bold hover:underline flex items-center gap-1 transition-colors">
                                                <RefreshCw size={12} /> Generate
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                                                placeholder="Enter new password"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors p-1">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {formData.status === 'BANNED' && modalMode === 'edit' && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 mt-2">
                                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <p className="text-[13px] text-red-700">This account is currently banned and cannot log in to the system.</p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t border-[#e0e3e5]">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[#43474e] font-bold rounded-xl hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                                <button type="submit" disabled={isSaving} className="bg-[#0061a5] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors disabled:opacity-70 flex items-center gap-2">
                                    {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                                    {modalMode === 'create' ? 'Create Account' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAccounts;