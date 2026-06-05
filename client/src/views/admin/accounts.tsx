import { useState, useMemo } from 'react';
import { Search, Plus, Eye, Ban, CheckCircle2, Lock, Unlock, X, RefreshCw, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

type Role = 'Admin' | 'Staff' | 'Tutor' | 'Learner';
type Status = 'Active' | 'Banned';

interface Account {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
    joinedDate: string;
    avatarInitials: string;
}

const mockAccounts: Account[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Tutor', status: 'Active', joinedDate: '12-10-2024', avatarInitials: 'JD' },
    { id: '2', name: 'Emily Watson', email: 'emily.w@example.com', role: 'Staff', status: 'Active', joinedDate: '15-01-2024', avatarInitials: 'EW' },
    { id: '3', name: 'Admin User', email: 'admin@icms.edu.vn', role: 'Admin', status: 'Active', joinedDate: '01-01-2024', avatarInitials: 'AD' },
    { id: '4', name: 'Sarah Smith', email: 'sarah.smith@example.com', role: 'Learner', status: 'Banned', joinedDate: '20-03-2024', avatarInitials: 'SS' },
];

const AdminAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<Role | 'All'>('All');
    
    // Create Account Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', email: '', role: 'Learner' as Role, password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 8; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewAccount({ ...newAccount, password: pass });
        setShowPassword(true);
    };

    const filteredAccounts = useMemo(() => {
        const roleOrder: Record<Role, number> = {
            Admin: 1,
            Staff: 2,
            Tutor: 3,
            Learner: 4
        };

        return accounts.filter(acc => {
            const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || acc.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = filterRole === 'All' || acc.role === filterRole;
            return matchesSearch && matchesRole;
        }).sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
    }, [accounts, searchQuery, filterRole]);

    const handleToggleBan = (id: string) => {
        setAccounts(accounts.map(acc => {
            if (acc.id === id) {
                // Cannot ban other admins directly from here (for safety)
                if (acc.role === 'Admin') {
                    alert("Cannot ban another Admin from this interface.");
                    return acc;
                }
                return { ...acc, status: acc.status === 'Active' ? 'Banned' : 'Active' };
            }
            return acc;
        }));
    };

    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        const initials = newAccount.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'UN';
        const newAcc: Account = {
            id: Date.now().toString(),
            name: newAccount.name,
            email: newAccount.email,
            role: newAccount.role,
            status: 'Active',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            avatarInitials: initials
        };
        setAccounts([newAcc, ...accounts]);
        setIsCreateModalOpen(false);
        setNewAccount({ name: '', email: '', role: 'Learner', password: '' });
    };

    const getRoleColor = (role: Role) => {
        switch (role) {
            case 'Admin': return 'bg-[#ffdad6] text-[#ba1a1a]';
            case 'Staff': return 'bg-[#d2e4ff] text-[#0061a5]';
            case 'Tutor': return 'bg-[#e8def8] text-[#6750a4]';
            case 'Learner': return 'bg-[#e6f4ea] text-[#137333]';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Manage Accounts</h1>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors"
                >
                    <Plus size={20} />
                    Create Account
                </button>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input 
                        className="pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" 
                        placeholder="Search users by name or email..." 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-2.5 bg-white border border-[#c4c6cf] rounded-xl text-[#43474e] font-bold focus:outline-none focus:border-[#0061a5] appearance-none cursor-pointer"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as Role | 'All')}
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Tutor">Tutor</option>
                    <option value="Learner">Learner</option>
                </select>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">User Info</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Role</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Status</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Joined Date</th>
                                <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length > 0 ? filteredAccounts.map((acc) => (
                                <tr key={acc.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold shrink-0">
                                                {acc.avatarInitials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#181c1e]">{acc.name}</p>
                                                <p className="text-[12px] text-[#74777f]">{acc.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 text-[12px] font-bold rounded uppercase ${getRoleColor(acc.role)}`}>
                                            {acc.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {acc.status === 'Active' ? (
                                            <span className="flex items-center gap-1.5 text-[#137333] text-[13px] font-bold">
                                                <CheckCircle2 size={16} /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[#ba1a1a] text-[13px] font-bold">
                                                <Lock size={16} /> Banned
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#43474e]">{acc.joinedDate}</td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/accounts/${acc.id}`} className="p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors tooltip-trigger" title="View & Edit Details">
                                                <Eye size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleToggleBan(acc.id)}
                                                className={`p-2 rounded-lg transition-colors tooltip-trigger ${acc.status === 'Active' ? 'text-[#ba1a1a] hover:bg-[#ffebed]' : 'text-[#137333] hover:bg-[#e6f4ea]'}`} 
                                                title={acc.status === 'Active' ? "Ban Account" : "Unban Account"}
                                            >
                                                {acc.status === 'Active' ? <Ban size={18} /> : <Unlock size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-[#74777f]">No accounts found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Account Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-[#e0e3e5]">
                            <h2 className="text-[20px] font-bold text-[#002045]">Create New Account</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-[#74777f] hover:text-[#181c1e] transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAccount} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newAccount.name}
                                    onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                    placeholder="e.g. Michael Scott"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={newAccount.email}
                                    onChange={e => setNewAccount({...newAccount, email: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                    placeholder="michael@example.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                    <select 
                                        value={newAccount.role}
                                        onChange={e => setNewAccount({...newAccount, role: e.target.value as Role})}
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="Learner">Learner</option>
                                        <option value="Tutor">Tutor</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Admin">Admin</option>
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
                                            value={newAccount.password}
                                            onChange={e => setNewAccount({...newAccount, password: e.target.value})}
                                            className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                            placeholder="Enter or generate"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-[#e0e3e5]">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 text-[#43474e] font-bold rounded-xl hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                                <button type="submit" className="bg-[#0061a5] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAccounts;
