import { CheckCircle2, Ban, Lock, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pagination } from '@/shared/components/common/Pagination';
import type { Account } from '../types/account';

interface AccountsTableProps {
    accounts: Account[];
    loading: boolean;
    error: string;
    currentPage: number;
    totalAccounts: number;
    limit: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    handleOpenModal: (mode: 'create' | 'edit', account?: Account) => void;
    handleToggleBan: (id: string, currentStatus: boolean) => void;
    currentUser: { id: string; role: string } | null;
}

export const AccountsTable = ({
    accounts,
    loading,
    error,
    currentPage,
    totalAccounts,
    limit,
    setCurrentPage,
    handleOpenModal,
    handleToggleBan,
    currentUser
}: AccountsTableProps) => {

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
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden relative min-h-75">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-200">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e] uppercase tracking-wider">User Info</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e] uppercase tracking-wider">Role</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e] uppercase tracking-wider">Joined Date</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e] uppercase tracking-wider">Status</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e] uppercase tracking-wider text-right">Actions</th>
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
                                <tr key={acc.id} className={`border-b border-[#e0e3e5] transition-colors ${acc.status !== 'ACTIVE' ? 'bg-[#fff5f6]' : 'hover:bg-[#f7fafc]'}`}>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold absolute inset-0 border border-[#d2e4ff]">
                                                    {getInitials(acc.full_name)}
                                                </div>
                                                {acc.avatar_url && (
                                                    <img 
                                                        src={acc.avatar_url} 
                                                        alt={acc.full_name} 
                                                        className="w-10 h-10 rounded-full object-cover absolute inset-0 z-10 border border-[#e0e3e5]"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className={`font-bold ${acc.status !== 'ACTIVE' ? 'text-[#ba1a1a]' : 'text-[#002045]'}`}>
                                                    {acc.full_name || ''}
                                                </p>
                                                <p className="text-xs text-[#74777f]">
                                                    {acc.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getRoleColor(acc.role)}`}>
                                            {acc.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[#43474e] font-medium">
                                        {new Date(acc.created_at).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="py-4 px-6">
                                        {acc.status === 'ACTIVE' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e6f4ea] text-[#137333] text-xs font-bold rounded-full">
                                                <CheckCircle2 size={16} /> Active
                                            </span>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold rounded-full w-fit mb-1">
                                                    <Ban size={16} /> Banned
                                                </span>
                                                <span className="text-xs text-[#ba1a1a] font-semibold pl-1 flex items-center gap-1">
                                                    <Lock size={10} /> Restricted Access
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2 items-center">
                                            <Link to={`/staff/accounts/${acc.id}`} className="p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors tooltip-trigger" title="View Details">
                                                <Eye size={18} />
                                            </Link>
                                            
                                            {(() => {
                                                const isSelf = currentUser?.id === acc.id;
                                                const isSameRoleButDifferentId = currentUser?.role === acc.role && !isSelf;
                                                
                                                const canEdit = !isSameRoleButDifferentId;
                                                const canBan = !isSelf && !isSameRoleButDifferentId;
                                                
                                                const editTitle = isSameRoleButDifferentId ? "You cannot edit accounts with the same role." : "Edit Account";
                                                const banTitle = isSelf ? "You cannot ban your own account." : isSameRoleButDifferentId ? "You cannot ban accounts with the same role." : (acc.status === 'ACTIVE' ? "Ban Account" : "Unban Account");
                                                
                                                return (
                                                    <>
                                                        <button 
                                                            onClick={() => handleOpenModal('edit', acc)} 
                                                            className={`p-2 rounded-lg transition-colors tooltip-trigger ${canEdit ? 'text-[#0061a5] hover:bg-[#e6f0fa]' : 'text-[#c4c6cf] cursor-not-allowed'}`} 
                                                            title={editTitle}
                                                            disabled={!canEdit}
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleToggleBan(acc.id, acc.status === 'ACTIVE')}
                                                            className={`p-2 rounded-lg transition-colors tooltip-trigger ${!canBan ? 'text-[#c4c6cf] cursor-not-allowed' : acc.status === 'ACTIVE' ? 'text-[#ba1a1a] hover:bg-[#ffdad6]' : 'text-[#137333] hover:bg-[#e6f4ea]'}`} 
                                                            title={banTitle}
                                                            disabled={!canBan}
                                                        >
                                                            {acc.status === 'ACTIVE' ? <Ban size={18} /> : <Lock size={18} />}
                                                        </button>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {totalAccounts > limit && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalAccounts}
                    itemsPerPage={limit}
                    onPageChange={setCurrentPage}
                    itemName="accounts"
                />
            )}
        </div>
    );
};
