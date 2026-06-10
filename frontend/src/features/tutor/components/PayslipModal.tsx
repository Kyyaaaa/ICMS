import { X, Building, Receipt, CheckCircle2 } from 'lucide-react';
import type { SalaryRecord } from '../types/salary';

interface PayslipModalProps {
    record: SalaryRecord;
    onClose: () => void;
}

export const PayslipModal = ({ record, onClose }: PayslipModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#f8f9fa] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-[#002045] text-white shrink-0">
                    <h2 className="text-[20px] font-bold flex items-center gap-2">
                        <Receipt className="w-6 h-6 text-[#adc7f7]" /> Payslip Details
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto bg-white flex-1 relative">
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                        <Building className="w-[500px] h-[500px]" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start border-b border-[#e0e3e5] pb-4 mb-6">
                            <div>
                                <h3 className="text-[24px] font-extrabold text-[#002045]">ICMS Education Platform</h3>
                                <p className="text-[#74777f] text-[14px]">123 University Ave, Ho Chi Minh City</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[20px] font-bold text-[#002045]">Tutor Payslip</div>
                                <p className="text-[#74777f] font-medium mt-1">{record.period}</p>
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[12px] font-bold mt-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-[#e0e3e5]">
                                    <h4 className="font-bold text-[#002045] border-b border-[#e0e3e5] pb-2 mb-4">Tutor Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-bold text-[#74777f] uppercase">Tutor Name</div>
                                            <div className="font-bold text-[#181c1e] text-[14px]">John Doe</div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-bold text-[#74777f] uppercase">Tutor ID</div>
                                            <div className="font-bold text-[#181c1e] text-[14px]">TUT-2026-042</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-[12px] font-bold text-[#74777f] uppercase">Role</div>
                                            <div className="font-bold text-[#181c1e] text-[14px]">Senior English Tutor</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-[#e0e3e5]">
                                    <h4 className="font-bold text-[#002045] border-b border-[#e0e3e5] pb-2 mb-4">Payment Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-bold text-[#74777f] uppercase">Payment Date</div>
                                            <div className="font-bold text-[#181c1e] text-[14px]">{record.payDate}</div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-bold text-[#74777f] uppercase">Transaction ID</div>
                                            <div className="font-bold text-[#181c1e] text-[14px]">{record.id}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-[#0061a5]/20 p-5 rounded-xl shadow-sm">
                                <h4 className="font-bold text-[#002045] border-b border-[#e0e3e5] pb-2 mb-4">Earnings Breakdown</h4>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start text-[14px]">
                                        <div className="flex flex-col">
                                            <span className="text-[#43474e] font-medium">Teaching Classes ({record.sessions} sessions)</span>
                                            <span className="text-[12px] text-[#74777f]">{record.sessionRate.toLocaleString()} đ/session</span>
                                        </div>
                                        <span className="font-bold text-[#181c1e] whitespace-nowrap">{record.baseSalary.toLocaleString()} đ</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-start text-[14px] pt-1">
                                        <span className="text-[#43474e] font-medium">Transport Allowance</span>
                                        <span className="font-bold text-[#181c1e] whitespace-nowrap">500,000 đ</span>
                                    </div>

                                    <div className="flex justify-between items-start text-[14px] pt-1">
                                        <span className="text-green-600 font-medium">Excellent Feedback Bonus</span>
                                        <span className="font-bold text-green-600 whitespace-nowrap">+{Math.max(0, record.bonuses - 500000).toLocaleString()} đ</span>
                                    </div>

                                    <div className="pt-3 border-t border-dashed border-[#e0e3e5]">
                                        <div className="flex justify-between items-start text-[14px]">
                                            <span className="text-red-600 font-medium">Tax Deduction (10%)</span>
                                            <span className="font-bold text-red-600 whitespace-nowrap">-{record.deductions.toLocaleString()} đ</span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 mt-2 border-t border-[#c4c6cf]">
                                        <div className="flex justify-between items-center bg-[#e6f0fa] p-4 rounded-xl border border-[#bbdefb]">
                                            <span className="font-extrabold text-[#002045] text-[16px]">Total Net Pay</span>
                                            <span className="font-extrabold text-[#0061a5] text-[28px] whitespace-nowrap">{record.netPay.toLocaleString()} đ</span>
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
    );
};
