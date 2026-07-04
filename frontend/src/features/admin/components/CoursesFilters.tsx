import { Search } from 'lucide-react';

interface CoursesFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    categories: string[];
}

export const CoursesFilters = ({ 
    searchTerm, setSearchTerm, 
    statusFilter, setStatusFilter, 
    categoryFilter, setCategoryFilter,
    categories
}: CoursesFiltersProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                <input 
                    className="pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] w-full" 
                    placeholder="Search courses by name or code..." 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-[#43474e]">Status:</span>
                    <select 
                        className="p-2 border border-[#c4c6cf] bg-[#f1f4f6] rounded-xl text-sm w-32 outline-none focus:border-[#0061a5]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Hidden">Hidden</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-[#43474e]">Category:</span>
                    <select 
                        className="p-2 border border-[#c4c6cf] bg-[#f1f4f6] rounded-xl text-sm w-36 outline-none focus:border-[#0061a5]"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
