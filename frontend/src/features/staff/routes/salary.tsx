import { useState, useEffect } from 'react';
import { Wallet, CalendarDays, TrendingUp, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SalaryRecord } from '@/shared/types/salary';
import { SalaryService } from '@/shared/services/salary.service';
import { PayslipModal } from '../../../shared/components/common/PayslipModal';
import { Pagination } from '@/shared/components/common/Pagination';

const SalaryHistory = () => {
    const [selectedYear, setSelectedYear] = useState('2026');
    const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const loadSalary = async () => {
            const data = await SalaryService.getMySalaryHistory();
            setSalaryRecords(data);
        };
        loadSalary();
    }, []);

    const totalYTD = salaryRecords.reduce((acc, curr) => acc + curr.netPay, 0);
    const lastPayout = salaryRecords[0] || { period: 'N/A', netPay: 0, payDate: 'N/A' };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#002045]">Salary History</h1>
                    <p className="text-[#43474e] text-sm mt-1">View your confirmed payroll records and payslip details.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#002045] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-[#adc7f7] font-bold text-sm uppercase tracking-wider mb-2">
                            <TrendingUp className="w-4 h-4" /> Total Earnings (YTD)
                        </div>
                        <div className="text-4xl font-extrabold leading-none">{totalYTD.toLocaleString('en-US')} VND</div>
                    </div>
                    <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e5] hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-[#74777f] font-bold text-sm uppercase tracking-wider mb-2">
                        <CalendarDays className="w-4 h-4 text-[#0061a5]" /> Last Payout Period
                    </div>
                    <div className="text-2xl font-extrabold text-[#181c1e] mb-1">{lastPayout.period}</div>
                    <div className="text-[#43474e] text-sm">Paid on {lastPayout.payDate}</div>
                </div>

                <div className="bg-[#e6f0fa] p-6 rounded-2xl shadow-sm border border-[#bbdefb] hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-[#0061a5] font-bold text-sm uppercase tracking-wider mb-2">
                        <Wallet className="w-4 h-4" /> Last Net Pay
                    </div>
                    <div className="text-3xl font-extrabold text-[#0061a5]">{lastPayout.netPay.toLocaleString('en-US')} VND</div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#e0e3e5] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8f9fa]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]" />
                            <input 
                                type="text" 
                                placeholder="Search period..." 
                                className="pl-9 pr-4 py-2 border border-[#c4c6cf] rounded-lg text-sm focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] w-full sm:w-62.5"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-[#c4c6cf] rounded-lg overflow-hidden">
                            <button 
                                onClick={() => setSelectedYear((prev) => (parseInt(prev) - 1).toString())}
                                className="p-2 text-[#43474e] hover:bg-[#f1f4f6] transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1.5 text-[#43474e] text-sm font-bold min-w-16 text-center border-l border-r border-[#c4c6cf]">
                                {selectedYear}
                            </span>
                            <button 
                                onClick={() => setSelectedYear((prev) => (parseInt(prev) + 1).toString())}
                                className="p-2 text-[#43474e] hover:bg-[#f1f4f6] transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white">
                            <tr>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Period</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Base Salary</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Bonus</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Deduct</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Net Pay</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Date Paid</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e0e3e5]">
                            {salaryRecords.slice((currentPage - 1) * limit, currentPage * limit).map((record) => (
                                <tr key={record.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-[#002045]">{record.period}</div>
                                        <div className="text-xs text-[#74777f]">{record.id}</div>
                                    </td>
                                    <td className="p-4 text-[#43474e]">{record.baseSalary.toLocaleString('en-US')} VND</td>
                                    <td className="p-4 text-green-600 font-semibold">+{record.bonuses.toLocaleString('en-US')} VND</td>
                                    <td className="p-4 text-red-600 font-semibold">-{record.deductions.toLocaleString('en-US')} VND</td>
                                    <td className="p-4 font-extrabold text-[#0061a5]">{record.netPay.toLocaleString('en-US')} VND</td>
                                    <td className="p-4 text-[#43474e]">{record.payDate}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => setSelectedRecord(record)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#0061a5] text-[#0061a5] bg-white hover:bg-[#e6f0fa] rounded-lg transition-colors text-xs font-bold"
                                        >
                                            <Eye className="w-4 h-4" /> View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={salaryRecords.length}
                    itemsPerPage={limit}
                    onPageChange={setCurrentPage}
                    itemName="records"
                />

                <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e3e5] text-center text-[#74777f] text-xs">
                    <p>Salary is processed and confirmed by the Admin team. If you have any inquiries regarding your payslip, please contact HR.</p>
                </div>
            </div>

            {selectedRecord && (
                <PayslipModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
            )}
        </div>
    );
};

export default SalaryHistory;
