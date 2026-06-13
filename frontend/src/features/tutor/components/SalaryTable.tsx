import { Eye, Search, Filter, ChevronDown } from 'lucide-react';
import type { SalaryRecord } from '../types/salary';

interface SalaryTableProps {
    records: SalaryRecord[];
    selectedYear: string;
    onViewRecord: (record: SalaryRecord) => void;
}

export const SalaryTable = ({ records, selectedYear, onViewRecord }: SalaryTableProps) => {
    return (
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
                    <button className="flex items-center gap-2 px-3 py-2 border border-[#c4c6cf] bg-white rounded-lg text-[#43474e] text-sm font-bold hover:bg-[#f1f4f6] transition-colors">
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
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Period</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Teaching Salary</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Bonus/Allowances</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Deductions</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Net Pay</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5]">Date Paid</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider border-b border-[#e0e3e5] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e3e5]">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                <td className="p-4">
                                    <div className="font-bold text-[#002045]">{record.period}</div>
                                    <div className="text-xs text-[#74777f]">{record.id}</div>
                                </td>
                                <td className="p-4 text-[#43474e]">{record.baseSalary.toLocaleString()} đ</td>
                                <td className="p-4 text-green-600 font-semibold">+{record.bonuses.toLocaleString()} đ</td>
                                <td className="p-4 text-red-600 font-semibold">-{record.deductions.toLocaleString()} đ</td>
                                <td className="p-4 font-extrabold text-[#0061a5]">{record.netPay.toLocaleString()} đ</td>
                                <td className="p-4 text-[#43474e]">{record.payDate}</td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => onViewRecord(record)}
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

            <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e3e5] text-center text-[#74777f] text-xs">
                <p>Salary is processed and confirmed by the Admin team. If you have any inquiries regarding your payslip or hours, please submit a Support Ticket.</p>
            </div>
        </div>
    );
};
