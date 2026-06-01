import React, { useState } from 'react';
import { Search, UserPlus, Edit, Ban, CheckCircle2, ShieldAlert, X, RefreshCw, EyeOff, Eye } from 'lucide-react';

type Account = {
    id: string;
    name: string;
    email: string;
    role: string;
    date: string;
    status: 'Active' | 'Banned';
};

const ManageAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([
        { id: '1', name: 'Alice Nguyen', email: 'alice.ng@gmail.com', role: 'Learner', date: 'Oct 24, 2026', status: 'Active' },
        { id: '2', name: 'David Smith', email: 'david.tutor@icms.edu', role: 'Tutor', date: 'Oct 23, 2026', status: 'Active' },
        { id: '3', name: 'Bob Johnson', email: 'bob.j@gmail.com', role: 'Learner', date: 'Oct 20, 2026', status: 'Banned' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState<Partial<Account> & { password?: string }>({ name: '', email: '', role: 'Learner', status: 'Active', password: '' });
    const [showPassword, setShowPassword] = useState(false);

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
            setFormData({ name: '', email: '', role: 'Learner', status: 'Active', password: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            const newAccount: Account = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name || '',
                email: formData.email || '',
                role: formData.role || 'Learner',
                status: (formData.status as any) || 'Active',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };
            setAccounts([newAccount, ...accounts]);
        } else {
            setAccounts(accounts.map(acc => acc.id === formData.id ? { ...acc, ...formData } as Account : acc));
        }
        setIsModalOpen(false);
    };

    const handleBan = (id: string) => {
        if(window.confirm("Are you sure you want to ban this account? It will no longer be accessible.")) {
            setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: 'Banned' } : acc));
        }
    };

    const filteredAccounts = accounts.filter(acc => 
        (acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === '' || acc.role === roleFilter)
    );

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

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
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
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 border border-[#c4c6cf] rounded-xl text-[14px] bg-white focus:outline-none focus:border-[#0061a5] font-semibold text-[#43474e] w-full sm:w-auto"
                        >
                            <option value="">All Roles</option>
                            <option value="Learner">Learner</option>
                            <option value="Tutor">Tutor</option>
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
                            {filteredAccounts.length > 0 ? filteredAccounts.map((user) => (
                                <tr key={user.id} className={`hover:bg-[#f8f9fa] transition-colors ${user.status === 'Banned' ? 'opacity-70 bg-gray-50' : ''}`}>
                                    <td className="p-4 font-bold text-[#002045] flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] ${user.status === 'Banned' ? 'bg-red-100 text-red-700' : 'bg-[#e6f0fa] text-[#0061a5]'}`}>
                                            {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-[15px]">{user.name}</div>
                                            {user.status === 'Banned' && <div className="text-[12px] text-red-600 font-semibold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Restricted Access</div>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#43474e]">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold ${user.role === 'Tutor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-[#0061a5]'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[#74777f]">{user.date}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold 
                                            ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                              user.status === 'Banned' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {user.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {user.status === 'Banned' && <Ban className="w-3.5 h-3.5" />}
                                            {user.status}
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
                                            {user.status !== 'Banned' && (
                                                <button 
                                                    onClick={() => handleBan(user.id)}
                                                    className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors" title="Ban Account"
                                                >
                                                    <Ban className="w-4 h-4"/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#74777f]">No accounts found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-scale-in">
                        <div className="flex justify-between items-center p-6 border-b border-[#e0e3e5]">
                            <h2 className="text-[20px] font-bold text-[#002045]">
                                {modalMode === 'create' ? 'Create New Account' : 'Edit Account'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
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
                                            onChange={e => setFormData({...formData, role: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="Learner">Learner</option>
                                            <option value="Tutor">Tutor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Password</label>
                                            <button type="button" onClick={generatePassword} className="text-[#0061a5] text-[12px] font-bold hover:underline flex items-center gap-1 transition-colors">
                                                <RefreshCw size={12} /> Auto-generate
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
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors">
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
                                                onChange={e => setFormData({...formData, role: e.target.value})}
                                                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="Learner">Learner</option>
                                                <option value="Tutor">Tutor</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Status</label>
                                            <select 
                                                value={formData.status}
                                                onChange={e => setFormData({...formData, status: e.target.value as any})}
                                                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Banned">Banned</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">New Password <span className="text-[#74777f] font-normal normal-case">(Leave blank to keep current)</span></label>
                                            <button type="button" onClick={generatePassword} className="text-[#0061a5] text-[12px] font-bold hover:underline flex items-center gap-1 transition-colors">
                                                <RefreshCw size={12} /> Auto-generate
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
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {formData.status === 'Banned' && modalMode === 'edit' && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 mt-2">
                                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <p className="text-[13px] text-red-700">This account is currently banned and will not be able to log in to the system.</p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t border-[#e0e3e5]">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[#43474e] font-bold rounded-xl hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                                <button type="submit" className="bg-[#0061a5] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors">
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