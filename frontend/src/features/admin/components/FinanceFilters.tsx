import { Search, Filter } from 'lucide-react';

interface FinanceFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
}

export const FinanceFilters = ({ searchTerm, setSearchTerm, filterType, setFilterType }: FinanceFiltersProps) => {
    return (
        <div className="bg-white p-4 rounded-t-[12px] border border-[#e0e3e5] border-b-0 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-75">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e0e3e5] rounded-lg focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-sm"
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="text-[#74777f] w-5 h-5" />
                <select 
                    className="w-full sm:w-auto border border-[#e0e3e5] rounded-lg px-3 py-2 text-sm font-medium text-[#43474e] focus:outline-none focus:border-[#0061a5]"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only (Money In)</option>
                    <option value="expense">Expense Only (Money Out)</option>
                </select>
            </div>
        </div>
    );
};
