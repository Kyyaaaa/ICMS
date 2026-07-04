import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinanceOverviewProps {
    totalIncome: number;
    totalExpense: number;
    netRevenue: number;
}

export const FinanceOverview = ({ totalIncome, totalExpense, netRevenue }: FinanceOverviewProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e3e5]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#137333]">
                        <TrendingUp size={20} />
                    </div>
                    <span className="font-bold text-[#43474e]">Total Income</span>
                </div>
                <div className="text-2xl font-extrabold text-[#181c1e] ml-13">
                    {totalIncome.toLocaleString('vi-VN')} đ
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e3e5]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#fceeee] flex items-center justify-center text-[#ba1a1a]">
                        <TrendingDown size={20} />
                    </div>
                    <span className="font-bold text-[#43474e]">Total Expense</span>
                </div>
                <div className="text-2xl font-extrabold text-[#181c1e] ml-13">
                    {totalExpense.toLocaleString('vi-VN')} đ
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e3e5] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0061a5] opacity-5 rounded-bl-full"></div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                        <TrendingUp size={20} />
                    </div>
                    <span className="font-bold text-[#43474e]">Net Balance</span>
                </div>
                <div className="text-2xl font-extrabold text-[#002045] ml-13">
                    {netRevenue.toLocaleString('vi-VN')} đ
                </div>
            </div>
        </div>
    );
};
