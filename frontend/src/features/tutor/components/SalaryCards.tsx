import { Wallet, CalendarDays, TrendingUp } from 'lucide-react';
import type { SalaryRecord } from '../types/salary';

interface SalaryCardsProps {
    records: SalaryRecord[];
}

export const SalaryCards = ({ records }: SalaryCardsProps) => {
    const totalYTD = records.reduce((acc, curr) => acc + curr.netPay, 0);
    const lastPayout = records[0] || { period: 'N/A', netPay: 0, payDate: 'N/A' };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            <div className="bg-[#002045] text-white p-[24px] rounded-2xl shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[#adc7f7] font-bold text-[14px] uppercase tracking-wider mb-2">
                        <TrendingUp className="w-4 h-4" /> Total Earnings (YTD)
                    </div>
                    <div className="text-[36px] font-extrabold leading-none">{totalYTD.toLocaleString()} đ</div>
                </div>
                <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="bg-white p-[24px] rounded-2xl shadow-sm border border-[#e0e3e5] hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 text-[#74777f] font-bold text-[14px] uppercase tracking-wider mb-2">
                    <CalendarDays className="w-4 h-4 text-[#0061a5]" /> Last Payout Period
                </div>
                <div className="text-[24px] font-extrabold text-[#181c1e] mb-1">{lastPayout.period}</div>
                <div className="text-[#43474e] text-[14px]">Paid on {lastPayout.payDate}</div>
            </div>

            <div className="bg-[#e6f0fa] p-[24px] rounded-2xl shadow-sm border border-[#bbdefb] hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 text-[#0061a5] font-bold text-[14px] uppercase tracking-wider mb-2">
                    <Wallet className="w-4 h-4" /> Last Net Pay
                </div>
                <div className="text-[32px] font-extrabold text-[#0061a5]">{lastPayout.netPay.toLocaleString()} đ</div>
            </div>
        </div>
    );
};
