import { X, FileText, Receipt, Undo, Wallet, DollarSign, Calculator } from 'lucide-react';
import type { Transaction } from '../types/finance';

interface TransactionModalProps {
    transaction: Transaction;
    onClose: () => void;
}

export const TransactionModal = ({ transaction, onClose }: TransactionModalProps) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc] shrink-0">
                    <div className="flex items-center gap-3">
                        {transaction.category === 'Course Registration' && <Receipt className="text-[#0061a5]" size={24} />}
                        {transaction.category === 'Course Refund' && <Undo className="text-[#ba1a1a]" size={24} />}
                        {transaction.category === 'Salary Payment' && <Wallet className="text-[#0061a5]" size={24} />}
                        {transaction.category !== 'Course Registration' && transaction.category !== 'Course Refund' && transaction.category !== 'Salary Payment' && <FileText className="text-[#0061a5]" size={24} />}
                        <h2 className="text-xl font-bold text-[#002045]">
                            {transaction.category === 'Course Registration' ? 'Invoice Details' : 
                             transaction.category === 'Course Refund' ? 'Refund Details' : 
                             transaction.category === 'Salary Payment' ? 'Payslip Details' : 'Transaction Details'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {/* COURSE REGISTRATION (INVOICE) */}
                    {transaction.category === 'Course Registration' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start border-b border-[#e0e3e5] pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#181c1e]">{transaction.user.name}</h2>
                                    <p className="text-[#43474e]">{transaction.user.role} • Account Code: {transaction.user.accountCode || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#74777f] font-bold uppercase mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full uppercase ${transaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : transaction.status === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : transaction.status === 'Refunded' ? 'bg-[#f3f4f6] text-[#43474e]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="text-[#74777f] font-bold uppercase mb-1 text-xs">Invoice No.</p>
                                    <p className="font-bold text-[#181c1e]">{transaction.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#74777f] font-bold uppercase mb-1 text-xs">Date of Issue</p>
                                    <p className="font-bold text-[#181c1e]">{formatDate(transaction.date)}</p>
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse border border-[#e0e3e5] rounded-lg overflow-hidden">
                                <thead className="bg-[#f7fafc]">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-bold text-[#43474e] border-b border-[#e0e3e5]">Item Description</th>
                                        <th className="py-3 px-4 text-xs font-bold text-[#43474e] border-b border-[#e0e3e5] text-center">Qty</th>
                                        <th className="py-3 px-4 text-xs font-bold text-[#43474e] border-b border-[#e0e3e5] text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaction.isInstallment && transaction.installments && transaction.installments.length > 0 ? (
                                        transaction.installments.map((inst, index) => (
                                            <tr key={index}>
                                                <td className="py-4 px-4 text-sm font-bold text-[#002045] border-b border-[#e0e3e5]">
                                                    {transaction.description}
                                                    <div className="text-xs font-normal text-[#74777f] mt-1 flex items-center gap-2">
                                                        Installment {inst.installment_number} • {inst.status === 'PAID' && inst.paid_date ? `Paid on ${formatDate(inst.paid_date)}` : `Due ${formatDate(inst.due_date)}`}
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${inst.status === 'PAID' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fff8e1] text-[#c9a82c]'}`}>{inst.status}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-center border-b border-[#e0e3e5]">1</td>
                                                <td className="py-4 px-4 text-sm font-bold text-right border-b border-[#e0e3e5]">{inst.amount.toLocaleString('en-US')} VND</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="py-4 px-4 text-sm font-bold text-[#002045] border-b border-[#e0e3e5]">
                                                {transaction.description}
                                                <div className="text-xs font-normal text-[#74777f] mt-1">Course Tuition Fee</div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-center border-b border-[#e0e3e5]">1</td>
                                            <td className="py-4 px-4 text-sm font-bold text-right border-b border-[#e0e3e5]">{transaction.amount.toLocaleString('en-US')} VND</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="flex justify-end">
                                <div className="w-1/2">
                                    <div className="flex justify-between py-2 text-sm">
                                        <span className="text-[#43474e]">Subtotal</span>
                                        <span className="font-bold">{transaction.amount.toLocaleString('en-US')} VND</span>
                                    </div>
                                    <div className="flex justify-between py-2 text-sm border-b border-[#e0e3e5]">
                                        <span className="text-[#43474e]">Tax (0%)</span>
                                        <span className="font-bold">0 VND</span>
                                    </div>
                                    <div className="flex justify-between py-3">
                                        <span className="text-base font-bold text-[#002045]">Total Invoice</span>
                                        <span className="text-xl font-extrabold text-[#002045]">{transaction.amount.toLocaleString('en-US')} VND</span>
                                    </div>
                                    {transaction.isInstallment && (
                                    <div className="flex justify-between py-2 border-t border-[#e0e3e5] mt-1 pt-3">
                                        <span className="text-base font-bold text-[#137333]">Total Paid</span>
                                        <span className="text-xl font-extrabold text-[#137333]">{transaction.paidAmount?.toLocaleString('en-US') || 0} VND</span>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COURSE REFUND */}
                    {transaction.category === 'Course Refund' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start border-b border-[#e0e3e5] pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#181c1e]">{transaction.user.name}</h2>
                                    <p className="text-[#43474e]">{transaction.user.role} • Account Code: {transaction.user.accountCode || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#74777f] font-bold uppercase mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full uppercase ${transaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : transaction.status === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Refund ID</span>
                                    <span className="text-sm font-bold text-[#181c1e]">{transaction.id}</span>
                                </div>
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Date Processed</span>
                                    <span className="text-sm font-bold text-[#181c1e]">{formatDate(transaction.date)}</span>
                                </div>
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Original Course</span>
                                    <span className="text-sm font-bold text-[#181c1e]">{transaction.description}</span>
                                </div>
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Reason</span>
                                    <span className="text-sm text-[#43474e]">{transaction.reason || 'Requested by learner before course start date.'}</span>
                                </div>
                            </div>

                            <div className="bg-[#fceeee] rounded-xl p-6 flex justify-between items-center border border-[#ba1a1a] shadow-sm">
                                <div>
                                    <span className="block text-sm text-[#900b09] uppercase font-bold tracking-wider">Amount Refunded</span>
                                    <span className="text-xs text-[#ba1a1a] mt-1">Returned to original payment method</span>
                                </div>
                                <span className="text-3xl md:text-4xl font-extrabold text-[#ba1a1a] tracking-tight">
                                    {transaction.amount.toLocaleString('en-US')} VND
                                </span>
                            </div>
                        </div>
                    )}

                    {/* SALARY PAYMENT (PAYSLIP) */}
                    {transaction.category === 'Salary Payment' && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#e0e3e5]">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#181c1e]">{transaction.user.name}</h2>
                                    <p className="text-[#43474e]">{transaction.user.role} • Payslip: {transaction.description}</p>
                                </div>
                                <div className="text-right mt-4 md:mt-0">
                                    <p className="text-xs text-[#74777f] font-bold uppercase mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full uppercase ${transaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : transaction.status === 'Processing' ? 'bg-[#fff8e1] text-[#c9a82c]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Earnings */}
                                <div>
                                    <h3 className="text-base font-bold text-[#181c1e] mb-4 flex items-center gap-2"><DollarSign size={18}/> Earnings</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#43474e] mb-1">Base Salary (Monthly - VND)</label>
                                            <div className="w-full px-3 py-2 text-sm bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">{transaction.amount.toLocaleString('en-US')}</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">OT Hours</label>
                                                <div className="w-full px-3 py-2 text-sm bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">0</div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">OT Rate/Hr</label>
                                                <div className="w-full px-3 py-2 text-sm bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">0</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#43474e] mb-1">Bonus / Allowances (VND)</label>
                                            <div className="w-full px-3 py-2 text-sm bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">0</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-[#f8f9fa] rounded-lg border border-[#e6f0fa] flex justify-between items-center">
                                        <span className="text-[#0061a5] font-bold text-sm">Total Earnings</span>
                                        <span className="font-bold text-[#0061a5] text-base">{transaction.amount.toLocaleString('en-US')} VND</span>
                                    </div>
                                </div>
                                
                                {/* Deductions */}
                                <div>
                                    <h3 className="text-base font-bold text-[#181c1e] mb-4 flex items-center gap-2"><Calculator size={18}/> Deductions</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-2 items-start">
                                            <div className="flex-1 space-y-2">
                                                <div className="w-full px-3 py-2 text-xs bg-[#f1f4f6] border border-[#ffebed] rounded-lg text-[#ba1a1a]">None</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-[#fff0f0] rounded-lg border border-[#ffccd2] flex justify-between items-center">
                                        <span className="text-[#ba1a1a] font-bold text-sm">Total Deductions</span>
                                        <span className="font-bold text-[#ba1a1a] text-base">0 VND</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#e6f0fa] rounded-xl p-6 flex justify-between items-center border border-[#0061a5] shadow-sm">
                                <div>
                                    <span className="block text-sm text-[#002045] uppercase font-bold tracking-wider">Final Net Pay</span>
                                    <span className="text-xs text-[#0061a5] mt-1">Amount to be transferred</span>
                                </div>
                                <span className="text-3xl md:text-4xl font-extrabold text-[#0061a5] tracking-tight">
                                    {transaction.amount.toLocaleString('en-US')} VND
                                </span>
                            </div>
                        </div>
                    )}

                    {/* OTHER GENERIC TRANSACTIONS (Fallback) */}
                    {transaction.category !== 'Course Registration' && transaction.category !== 'Course Refund' && transaction.category !== 'Salary Payment' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <span className="text-sm text-[#74777f] uppercase font-bold block mb-2">Amount</span>
                                <span className={`text-4xl font-extrabold ${transaction.status === 'Failed' ? 'text-[#74777f] line-through opacity-70' : transaction.type === 'income' ? 'text-[#137333]' : 'text-[#ba1a1a]'}`}>
                                    {transaction.status !== 'Failed' ? (transaction.type === 'income' ? '+ ' : '- ') : ''}{transaction.amount.toLocaleString('en-US')} VND
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Transaction ID</span>
                                    <span className="text-sm font-bold text-[#181c1e]">{transaction.id}</span>
                                </div>
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Date</span>
                                    <span className="text-sm font-bold text-[#181c1e]">{formatDate(transaction.date)}</span>
                                </div>
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Category</span>
                                    <span className="text-sm font-bold text-[#181c1e]">{transaction.category}</span>
                                </div>
                                <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Status</span>
                                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded uppercase mt-1 ${transaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : transaction.status === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">Description</span>
                                <span className="text-sm text-[#43474e]">{transaction.description}</span>
                            </div>

                            <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5] flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-[#74777f] font-bold uppercase block mb-1">User</span>
                                    <span className="text-sm font-bold text-[#181c1e]">{transaction.user.name}</span>
                                </div>
                                <span className="px-3 py-1 bg-white border border-[#c4c6cf] rounded-full text-xs font-bold text-[#43474e]">
                                    {transaction.user.role}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[#e0e3e5] bg-[#f7fafc] flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
