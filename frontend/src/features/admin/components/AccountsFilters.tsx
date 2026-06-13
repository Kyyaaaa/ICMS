import { Search } from 'lucide-react';
import type { Role } from '../types/account';

interface AccountsFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterRole: Role | 'All';
    setFilterRole: (role: Role | 'All') => void;
}

export const AccountsFilters = ({ searchQuery, setSearchQuery, filterRole, setFilterRole }: AccountsFiltersProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                <input 
                    className="pl-10 pr-4 py-2.5 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] w-full transition-colors" 
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
    );
};
