interface ClassesFiltersProps {
    filter: 'Active' | 'Completed';
    setFilter: (filter: 'Active' | 'Completed') => void;
    activeCount: number;
    completedCount: number;
}

export const ClassesFilters = ({ filter, setFilter, activeCount, completedCount }: ClassesFiltersProps) => {
    return (
        <div className="flex gap-[16px] mb-[24px]">
            <button 
                onClick={() => setFilter('Active')}
                className={`px-[16px] py-[8px] rounded-full text-[14px] font-semibold transition-colors ${
                    filter === 'Active' 
                        ? 'bg-[#002045] text-white' 
                        : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'
                }`}
            >
                Active ({activeCount})
            </button>
            <button 
                onClick={() => setFilter('Completed')}
                className={`px-[16px] py-[8px] rounded-full text-[14px] font-semibold transition-colors ${
                    filter === 'Completed' 
                        ? 'bg-[#002045] text-white' 
                        : 'bg-white border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'
                }`}
            >
                Completed ({completedCount})
            </button>
        </div>
    );
};
