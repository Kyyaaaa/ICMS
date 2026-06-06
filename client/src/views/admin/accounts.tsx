import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Ban, CheckCircle2, Lock, X, RefreshCw, EyeOff, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

type Role = 'ADMIN' | 'STAFF' | 'TUTOR' | 'LEARNER';

interface Account {
    id: string;
    full_name: string;
    email: string;
    role: Role;
    is_active: boolean;
    created_at: string;
    avatar_url?: string;
}

const AdminAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<Role | 'All'>('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState<Partial<Account> & { password?: string }>({ full_name: '', email: '', role: 'LEARNER', is_active: true, password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 8; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, password: pass });
        setShowPassword(true);
    };

    const handleOpenModal = (mode: 'create' | 'edit', account?: Account) => {
        setModalMode(mode);
        if (mode === 'edit' && account) {
            setFormData({ ...account, password: '' });
        } else {
            setFormData({ full_name: '', email: '', role: 'LEARNER', is_active: true, password: '' });
        }
        setIsModalOpen(true);
    };

    const fetchAccounts = async () => {
        setLoading(true);
        setError('');
        try {
            const token = Cookies.get('access_token');
            const url = new URL('http://localhost:5000/api/accounts');
            if (filterRole !== 'All') url.searchParams.append('role', filterRole);
            if (searchQuery) url.searchParams.append('search', searchQuery);

            const res = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                const sortedData = data.data.sort((a: Account, b: Account) => {
                    const roleOrder: Record<Role, number> = { 'ADMIN': 1, 'STAFF': 2, 'TUTOR': 3, 'LEARNER': 4 };
                    return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
                });
                setAccounts(sortedData);
            } else {
                setError(data.message || 'Failed to fetch accounts');
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
    }, [searchQuery, filterRole]);

    const handleToggleBan = async (id: string, currentStatus: boolean) => {
        try {
            const token = Cookies.get('access_token');
            const res = await fetch(`http://localhost:5000/api/accounts/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state without refetching
                setAccounts(accounts.map(acc => acc.id === id ? { ...acc, is_active: !currentStatus } : acc));
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch {
            alert('An error occurred while updating status');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-[#ffdad6] text-[#ba1a1a]';
            case 'STAFF': return 'bg-[#d2e4ff] text-[#0061a5]';
            case 'TUTOR': return 'bg-[#e8def8] text-[#6750a4]';
            case 'LEARNER': return 'bg-[#e6f4ea] text-[#137333]';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'UN';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input 
                        className="pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full transition-colors" 
                        placeholder="Search users by name or email..." 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-2.5 bg-white border border-[#c4c6cf] rounded-xl text-[#43474e] font-bold focus:outline-none focus:border-[#0061a5] cursor-pointer transition-colors"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as Role | 'All')}
                >
                    <option value="All">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Staff</option>
                    <option value="TUTOR">Tutor</option>
                    <option value="LEARNER">Learner</option>
                </select>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden relative min-h-[300px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">User Info</th>
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Role</th>
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Joined Date</th>
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-[#74777f]">
                                        {error ? <span className="text-[#ba1a1a]">{error}</span> : "No accounts found matching your criteria."}
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((acc) => (
                                    <tr key={acc.id} className={`border-b border-[#e0e3e5] transition-colors ${!acc.is_active ? 'bg-[#fff5f6]' : 'hover:bg-[#f7fafc]'}`}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {acc.avatar_url ? (
                                                    <img src={acc.avatar_url} alt={acc.full_name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#e0e3e5]" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold shrink-0 border border-[#c4c6cf]">
                                                        {getInitials(acc.full_name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={`font-bold ${!acc.is_active ? 'text-[#ba1a1a]' : 'text-[#002045]'}`}>
                                                        {acc.full_name || ''}
                                                    </p>
                                                    <p className="text-[13px] text-[#74777f]">{acc.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 text-[12px] font-bold rounded-full uppercase tracking-wider ${getRoleColor(acc.role)}`}>
                                                {acc.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-[14px] text-[#43474e] font-medium">
                                            {new Date(acc.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="py-4 px-6">
                                            {acc.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e6f4ea] text-[#137333] text-[13px] font-bold rounded-full">
                                                    <CheckCircle2 size={16} /> Active
                                                </span>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffdad6] text-[#ba1a1a] text-[13px] font-bold rounded-full w-fit mb-1">
                                                        <Ban size={16} /> Banned
                                                    </span>
                                                    <span className="text-[11px] text-[#ba1a1a] font-semibold pl-1 flex items-center gap-1">
                                                        <Lock size={10} /> Restricted Access
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                <Link to={`/admin/accounts/${acc.id}`} className="p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors tooltip-trigger" title="View Details">
                                                    <Eye size={18} />
                                                </Link>
                                                <button onClick={() => handleOpenModal('edit', acc)} className="p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors tooltip-trigger" title="Edit Account">
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleBan(acc.id, acc.is_active)}
                                                    className={`p-2 rounded-lg transition-colors tooltip-trigger ${acc.is_active ? 'text-[#ba1a1a] hover:bg-[#ffdad6]' : 'text-[#137333] hover:bg-[#e6f4ea]'}`} 
                                                    title={acc.is_active ? "Ban Account" : "Unban Account"}
                                                >
                                                    {acc.is_active ? <Ban size={18} /> : <Lock size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Account Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#002045]/40" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="flex items-center justify-between p-6 border-b border-[#e0e3e5]">
                            <h2 className="text-[20px] font-extrabold text-[#002045]">
                                {modalMode === 'create' ? 'Create New Account' : 'Edit Account'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#74777f] hover:text-[#ba1a1a] transition-colors p-1 rounded-lg hover:bg-[#ffdad6]">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.full_name}
                                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                    placeholder="e.g. Michael Scott"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                    placeholder="michael@example.com"
                                />
                            </div>
                            
                            {modalMode === 'create' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                        <select 
                                            value={formData.role}
                                            onChange={e => setFormData({...formData, role: e.target.value as Role})}
                                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors cursor-pointer"
                                        >
                                            <option value="LEARNER">Learner</option>
                                            <option value="TUTOR">Tutor</option>
                                            <option value="STAFF">Staff</option>
                                            <option value="ADMIN">Admin</option>
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
                                                className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                                placeholder="Enter password"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors p-1">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                            <select 
                                                value={formData.role}
                                                onChange={e => setFormData({...formData, role: e.target.value as Role})}
                                                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors cursor-pointer"
                                            >
                                                <option value="LEARNER">Learner</option>
                                                <option value="TUTOR">Tutor</option>
                                                <option value="STAFF">Staff</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Status</label>
                                            <select 
                                                value={formData.is_active ? 'true' : 'false'}
                                                onChange={e => setFormData({...formData, is_active: e.target.value === 'true'})}
                                                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors cursor-pointer"
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Banned</option>
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
                                                className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                                placeholder="Enter new password"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors p-1">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="pt-4 flex justify-end gap-3 border-t border-[#e0e3e5]">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[#43474e] font-bold rounded-xl hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                                <button type="submit" disabled={isSaving} className="bg-[#0061a5] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                    {isSaving && <RefreshCw className="w-5 h-5 animate-spin" />}
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

export default AdminAccounts;
