
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle2, Clock } from 'lucide-react';

const AdminPayrollDetail = () => {
    const { id } = useParams();

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/payroll" className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Payslip Details</h1>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-[#e0e3e5]">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-[#e6f0fa] rounded-full flex items-center justify-center text-[#0061a5]">
                            <Wallet size={32} />
                        </div>
                        <div>
                            <h2 className="text-[24px] font-bold text-[#181c1e]">Dr. Sarah Smith</h2>
                            <p className="text-[#43474e]">Senior Tutor • 10-2026</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[14px] text-[#74777f] font-bold uppercase mb-1">Status</p>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#e6f4ea] text-[#137333] text-[14px] font-bold rounded-full">
                            <CheckCircle2 size={18} /> Processed
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-[18px] font-bold text-[#181c1e] mb-4">Earnings</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-[#f8f9fa] rounded-lg">
                                <span className="text-[#43474e]">Base Salary</span>
                                <span className="font-bold text-[#181c1e]">2.800 đ</span>
                            </div>
                            <div className="flex justify-between p-3 bg-[#f8f9fa] rounded-lg">
                                <span className="text-[#43474e]">Overtime (10 hrs)</span>
                                <span className="font-bold text-[#181c1e]">350,000 đ</span>
                            </div>
                            <div className="flex justify-between p-3 bg-[#f8f9fa] rounded-lg border border-[#e6f0fa]">
                                <span className="text-[#0061a5] font-bold">Total Earnings</span>
                                <span className="font-bold text-[#0061a5]">3.150 đ</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[18px] font-bold text-[#181c1e] mb-4">Deductions</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-[#f8f9fa] rounded-lg">
                                <span className="text-[#43474e]">Tax (10%)</span>
                                <span className="font-bold text-[#ba1a1a]">-315 đ</span>
                            </div>
                            <div className="flex justify-between p-3 bg-[#f8f9fa] rounded-lg border border-[#ffebed]">
                                <span className="text-[#ba1a1a] font-bold">Total Deductions</span>
                                <span className="font-bold text-[#ba1a1a]">-315 đ</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#e6f0fa] rounded-[12px] p-6 flex justify-between items-center border border-[#0061a5]">
                    <span className="text-[20px] font-bold text-[#002045]">Net Pay</span>
                    <span className="text-[32px] font-extrabold text-[#0061a5]">2.835 đ</span>
                </div>
            </div>
        </div>
    );
};

export default AdminPayrollDetail;
