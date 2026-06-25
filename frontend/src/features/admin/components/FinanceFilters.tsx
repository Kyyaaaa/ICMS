import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface FinanceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterMonth: string;
  setFilterMonth: (month: string) => void;
  categories: string[];
}

export const FinanceFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterMonth,
  setFilterMonth,
  categories,
}: FinanceFiltersProps) => {

  const handlePrevMonth = () => {
    if (filterMonth !== "all") {
      const [year, month] = filterMonth.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 2);
      setFilterMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
    }
  };

  const handleNextMonth = () => {
    if (filterMonth !== "all") {
      const [year, month] = filterMonth.split("-");
      const date = new Date(parseInt(year), parseInt(month));
      setFilterMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
    }
  };

  const getMonthLabel = () => {
    if (filterMonth === "all") return "All Months";
    const [year, month] = filterMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white p-4 rounded-t-[12px] border border-[#e0e3e5] border-b-0 flex flex-col lg:flex-row gap-4 justify-between items-center">
      <div className="relative w-full lg:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#e0e3e5] rounded-lg focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center bg-white border border-[#e0e3e5] rounded-lg overflow-hidden">
          <button
            onClick={handlePrevMonth}
            disabled={filterMonth === "all"}
            className="p-2 hover:bg-[#f0f4f8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-[#e0e3e5]"
          >
            <ChevronLeft className="w-5 h-5 text-[#43474e]" />
          </button>
          <button
            onClick={() => {
              if (filterMonth === "all") {
                const now = new Date();
                setFilterMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
              } else {
                setFilterMonth("all");
              }
            }}
            className="px-4 py-1.5 text-sm font-medium text-[#43474e] min-w-30 text-center hover:bg-[#f0f4f8] transition-colors focus:outline-none"
            title={filterMonth === "all" ? "Switch to Current Month" : "Switch to All Months"}
          >
            {getMonthLabel()}
          </button>
          <button
            onClick={handleNextMonth}
            disabled={filterMonth === "all"}
            className="p-2 hover:bg-[#f0f4f8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-l border-[#e0e3e5]"
          >
            <ChevronRight className="w-5 h-5 text-[#43474e]" />
          </button>
        </div>

        <select
          className="w-full sm:w-auto border border-[#e0e3e5] rounded-lg px-3 py-2 text-sm font-medium text-[#43474e] focus:outline-none focus:border-[#0061a5]"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>

        <select
          className="w-full sm:w-auto border border-[#e0e3e5] rounded-lg px-3 py-2 text-sm font-medium text-[#43474e] focus:outline-none focus:border-[#0061a5]"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        <select
          className="w-full sm:w-auto border border-[#e0e3e5] rounded-lg px-3 py-2 text-sm font-medium text-[#43474e] focus:outline-none focus:border-[#0061a5]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
