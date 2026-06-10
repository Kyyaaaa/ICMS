import { useState, useEffect } from 'react';
import { Wallet, CalendarDays, TrendingUp, Eye, ChevronDown, Search, Filter } from 'lucide-react';
import type { SalaryRecord } from '../types/salary';
import { SalaryService } from '../services/salary.service';
import { PayslipModal } from '../components/PayslipModal';

const SalaryHistory = () => {
    const [selectedYear] = useState('2026');
    const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);

    useEffect(() => {
        const loadSalary = async () => {
            const data = await SalaryService.getSalaryHistory();
            setSalaryRecords(data);
        };
        loadSalary();
    }, []);

    const totalYTD = salaryRecords.reduce((acc, curr) => acc + curr.netPay, 0);
    const lastPayout = salaryRecords[0] || { period: 'N/A', netPay: 0, payDate: 'N/A' };

    return (
        <div className="space-y-[24px] animate-fade-in-up pb-[40px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[#002045]">Salary History</h1>
                    <p className="text-[#43474e] text-[15px] mt-1">View your confirmed payroll records and payslip details.</p>
                </div>
            </div>

            {/* Summary Cards */}
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

            {/* History Table */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-[20px] border-b border-[#e0e3e5] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8f9fa]">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]" />
                            <input 
                                type="text" 
                                placeholder="Search period..." 
                                className="pl-9 pr-4 py-2 border border-[#c4c6cf] rounded-lg text-[14px] focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] w-full sm:w-[250px]"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 border border-[#c4c6cf] bg-white rounded-lg text-[#43474e] text-[14px] font-bold hover:bg-[#f1f4f6] transition-colors">
                            <Filter className="w-4 h-4" />
                            Year: {selectedYear}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white">
                            <tr>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Period</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Base Salary</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Bonus</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Deduct</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Net Pay</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Date Paid</th>
                                <th className="p-4 text-[13px] font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e0e3e5]">
                            {salaryRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-[#002045]">{record.period}</div>
                                        <div className="text-[12px] text-[#74777f]">{record.id}</div>
                                    </td>
                                    <td className="p-4 text-[#43474e]">{record.baseSalary.toLocaleString()} đ</td>
                                    <td className="p-4 text-green-600 font-semibold">+{record.bonuses.toLocaleString()} đ</td>
                                    <td className="p-4 text-red-600 font-semibold">-{record.deductions.toLocaleString()} đ</td>
                                    <td className="p-4 font-extrabold text-[#0061a5]">{record.netPay.toLocaleString()} đ</td>
                                    <td className="p-4 text-[#43474e]">{record.payDate}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => setSelectedRecord(record)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#0061a5] text-[#0061a5] bg-white hover:bg-[#e6f0fa] rounded-lg transition-colors text-[13px] font-bold"
                                        >
                                            <Eye className="w-4 h-4" /> View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-[16px] bg-[#f8f9fa] border-t border-[#e0e3e5] text-center text-[#74777f] text-[13px]">
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
