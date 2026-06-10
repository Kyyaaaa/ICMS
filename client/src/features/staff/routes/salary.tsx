import { useState } from 'react';
import { Wallet, CalendarDays, TrendingUp, Eye, CheckCircle2, ChevronDown, Search, Filter, X, Building, Receipt } from 'lucide-react';

type SalaryRecord = {
    id: string;
    period: string;
    baseSalary: number;
    bonuses: number;
    deductions: number;
    netPay: number;
    payDate: string;
    status: string;
};

const SalaryHistory = () => {
    const [selectedYear] = useState('2026');
    const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);

    // Mock data for salary records (Admin Confirmed)
    const salaryRecords: SalaryRecord[] = [
        { id: 'PAY-1004', period: '10-2026', baseSalary: 12000000, bonuses: 1500000, deductions: 0, netPay: 13500000, payDate: '05-11-2026', status: 'Paid' },
        { id: 'PAY-1003', period: '09-2026', baseSalary: 12000000, bonuses: 2000000, deductions: 500000, netPay: 13500000, payDate: '05-10-2026', status: 'Paid' },
        { id: 'PAY-1002', period: '08-2026', baseSalary: 12000000, bonuses: 1000000, deductions: 0, netPay: 13000000, payDate: '05-09-2026', status: 'Paid' },
        { id: 'PAY-1001', period: '07-2026', baseSalary: 12000000, bonuses: 500000, deductions: 0, netPay: 12500000, payDate: '05-08-2026', status: 'Paid' },
        { id: 'PAY-1000', period: '06-2026', baseSalary: 12000000, bonuses: 3000000, deductions: 200000, netPay: 14800000, payDate: '05-07-2026', status: 'Paid' },
    ];

    const totalYTD = salaryRecords.reduce((acc, curr) => acc + curr.netPay, 0);
    const lastPayout = salaryRecords[0];

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

            {/* Payslip Detail Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#f8f9fa] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-[#002045] text-white shrink-0">
                            <h2 className="text-[20px] font-bold flex items-center gap-2">
                                <Receipt className="w-6 h-6 text-[#adc7f7]" /> Payslip Details
                            </h2>
                            <button 
                                onClick={() => setSelectedRecord(null)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto bg-white flex-1 relative">
                            {/* Watermark */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                                <Building className="w-[500px] h-[500px]" />
                            </div>

                            <div className="relative z-10">
                                {/* Payslip Header */}
                                <div className="flex justify-between items-start border-b border-[#e0e3e5] pb-4 mb-6">
                                    <div>
                                        <h3 className="text-[24px] font-extrabold text-[#002045]">ICMS Education Platform</h3>
                                        <p className="text-[#74777f] text-[14px]">123 University Ave, Ho Chi Minh City</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[20px] font-bold text-[#002045]">Payslip</div>
                                        <p className="text-[#74777f] font-medium mt-1">{selectedRecord.period}</p>
                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[12px] font-bold mt-2">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column: Employee Info */}
                                    <div className="space-y-6">
                                        <div className="bg-[#f8f9fa] p-5 rounded-xl border border-[#e0e3e5]">
                                            <h4 className="font-bold text-[#002045] border-b border-[#e0e3e5] pb-2 mb-4">Employee Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[12px] font-bold text-[#74777f] uppercase">Employee Name</div>
                                                    <div className="font-bold text-[#181c1e] text-[14px]">Admin Staff</div>
                                                </div>
                                                <div>
                                                    <div className="text-[12px] font-bold text-[#74777f] uppercase">Employee ID</div>
                                                    <div className="font-bold text-[#181c1e] text-[14px]">STF-2026-001</div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-[12px] font-bold text-[#74777f] uppercase">Role</div>
                                                    <div className="font-bold text-[#181c1e] text-[14px]">Staff</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#f8f9fa] p-5 rounded-xl border border-[#e0e3e5]">
                                            <h4 className="font-bold text-[#002045] border-b border-[#e0e3e5] pb-2 mb-4">Payment Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[12px] font-bold text-[#74777f] uppercase">Payment Date</div>
                                                    <div className="font-bold text-[#181c1e] text-[14px]">{selectedRecord.payDate}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[12px] font-bold text-[#74777f] uppercase">Transaction ID</div>
                                                    <div className="font-bold text-[#181c1e] text-[14px]">{selectedRecord.id}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Earnings Breakdown */}
                                    <div className="bg-white border border-[#0061a5]/20 p-5 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-[#002045] border-b border-[#e0e3e5] pb-2 mb-4">Earnings Breakdown</h4>
                                        
                                        <div className="space-y-3">
                                            {/* Base Salary */}
                                            <div className="flex justify-between items-center text-[14px]">
                                                <span className="text-[#43474e] font-medium">Base Salary (160h x 75,000 đ/h)</span>
                                                <span className="font-bold text-[#181c1e]">{selectedRecord.baseSalary.toLocaleString()} đ</span>
                                            </div>
                                            
                                            {/* Allowances */}
                                            <div className="flex justify-between items-center text-[14px]">
                                                <span className="text-[#43474e] font-medium">Internet & Equipment Allowance</span>
                                                <span className="font-bold text-[#181c1e]">500,000 đ</span>
                                            </div>

                                            {/* Bonus */}
                                            <div className="flex justify-between items-center text-[14px]">
                                                <span className="text-green-600 font-medium">Performance Bonus</span>
                                                <span className="font-bold text-green-600">+{Math.max(0, selectedRecord.bonuses - 500000).toLocaleString()} đ</span>
                                            </div>

                                            {/* Deductions */}
                                            <div className="pt-3 border-t border-dashed border-[#e0e3e5]">
                                                <div className="flex justify-between items-center text-[14px]">
                                                    <span className="text-red-600 font-medium">Tax Deduction (5%)</span>
                                                    <span className="font-bold text-red-600">-{selectedRecord.deductions.toLocaleString()} đ</span>
                                                </div>
                                            </div>
                                            
                                            {/* Total */}
                                            <div className="pt-4 mt-2 border-t border-[#c4c6cf]">
                                                <div className="flex justify-between items-center bg-[#e6f0fa] p-4 rounded-xl border border-[#bbdefb]">
                                                    <span className="font-extrabold text-[#002045] text-[16px]">Total Net Pay</span>
                                                    <span className="font-extrabold text-[#0061a5] text-[28px]">{selectedRecord.netPay.toLocaleString()} đ</span>
                                                </div>
                                                <p className="text-center text-[12px] text-[#74777f] mt-3 italic">
                                                    *All amounts are represented in đ.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalaryHistory;