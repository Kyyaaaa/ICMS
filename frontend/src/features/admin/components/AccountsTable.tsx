import { Eye, Ban, CheckCircle2, Lock, Edit, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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

    const totalPages = Math.ceil(totalAccounts / limit);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden relative min-h-75">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-200">
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
                                <tr key={acc.id} className={`border-b border-[#e0e3e5] transition-colors ${acc.status !== 'ACTIVE' ? 'bg-[#fff5f6]' : 'hover:bg-[#f7fafc]'}`}>
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
                                                <p className={`font-bold ${acc.status !== 'ACTIVE' ? 'text-[#ba1a1a]' : 'text-[#002045]'}`}>
                                                    {acc.full_name || ''}
                                                </p>
                                                <p className="text-[13px] text-[#74777f]">
                                                    {acc.email}
                                                </p>
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
                                        {acc.status === 'ACTIVE' ? (
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
            {/* Pagination UI */}
            {totalAccounts > limit && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e3e5] bg-[#f8f9fa]">
                    <span className="text-[13px] text-[#43474e]">
                        Showing <span className="font-bold">{(currentPage - 1) * limit + 1}</span> to <span className="font-bold">{Math.min(currentPage * limit, totalAccounts)}</span> of <span className="font-bold">{totalAccounts}</span> accounts
                    </span>
                    <div className="flex gap-1.5 items-center">
                        {/* First Page */}
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            className="p-1.5 border border-[#c4c6cf] rounded-lg text-[#43474e] bg-white hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="First Page"
                        >
                            <ChevronsLeft size={18} />
                        </button>
                        {/* Previous Page */}
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="p-1.5 border border-[#c4c6cf] rounded-lg text-[#43474e] bg-white hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Previous Page"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        {getPageNumbers().map((pageNum, idx) => (
                            pageNum === '...' ? (
                                <span key={`ellipsis-${idx}`} className="px-2 text-[#74777f] font-bold">...</span>
                            ) : (
                                <button
                                    key={`page-${pageNum}`}
                                    onClick={() => setCurrentPage(pageNum as number)}
                                    className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-[13px] font-bold transition-colors ${
                                        currentPage === pageNum 
                                            ? 'bg-[#0061a5] text-white border border-[#0061a5]' 
                                            : 'border border-[#c4c6cf] text-[#43474e] bg-white hover:bg-[#f1f4f6]'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        ))}

                        {/* Next Page */}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="p-1.5 border border-[#c4c6cf] rounded-lg text-[#43474e] bg-white hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Next Page"
                        >
                            <ChevronRight size={18} />
                        </button>
                        {/* Last Page */}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="p-1.5 border border-[#c4c6cf] rounded-lg text-[#43474e] bg-white hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Last Page"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
