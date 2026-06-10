import { Search } from 'lucide-react';

interface CoursesFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const CoursesFilters = ({ searchTerm, setSearchTerm }: CoursesFiltersProps) => {
    return (
        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                <input 
                    className="pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" 
                    placeholder="Search courses by name or code..." 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};
