import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    itemName?: string;
}

export const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage = 10,
    onPageChange,
    itemName = 'items'
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems <= itemsPerPage) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#e0e3e5] bg-[#f8f9fa] gap-4">
            <span className="text-xs text-[#43474e]">
                Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold">{totalItems}</span> {itemName}
            </span>
            <div className="flex gap-1.5 items-center">
                {/* Previous Page */}
                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
                            onClick={() => onPageChange(pageNum as number)}
                            className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
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
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    className="p-1.5 border border-[#c4c6cf] rounded-lg text-[#43474e] bg-white hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
