import { useState } from 'react';
import { TrendingUp, TrendingDown, CheckCircle, Clock, AlertCircle, Filter, Search, Eye, X, FileText, Receipt, Undo, Wallet, DollarSign, Calculator } from 'lucide-react';

const AdminFinance = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, income, expense
    interface Transaction {
        id: string;
        type: string;
        category: string;
        description: string;
        user: { name: string; role: string };
        date: string;
        amount: number;
        status: string;
    }
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const transactions = [
        {
            id: 'TXN-10293',
            type: 'income',
            category: 'Course Registration',
            description: 'IELTS Intensive Mastery',
            user: { name: 'Alex Johnson', role: 'Learner' },
            date: '24-10-2026',
            amount: 500000,
            status: 'Completed'
        },
        {
            id: 'REF-10294',
            type: 'expense',
            category: 'Course Refund',
            description: 'Basic Communication',
            user: { name: 'Michael Smith', role: 'Learner' },
            date: '25-10-2026',
            amount: 100000,
            status: 'Completed'
        },
        {
            id: 'PAY-1004',
            type: 'expense',
            category: 'Salary Payment',
            description: '10-2026',
            user: { name: 'Sarah Jenkins', role: 'Tutor' },
            date: '01-11-2026',
            amount: 12000000,
            status: 'Processing'
        },
        {
            id: 'TXN-10296',
            type: 'income',
            category: 'Course Registration',
            description: 'TOEIC Target 700+',
            user: { name: 'Emma Watson', role: 'Learner' },
            date: '02-11-2026',
            amount: 300000,
            status: 'Completed'
        },
        {
            id: 'TXN-10297',
            type: 'income',
            category: 'Course Registration',
            description: 'Business English',
            user: { name: 'David Lee', role: 'Learner' },
            date: '03-11-2026',
            amount: 450000,
            status: 'Failed'
        }
    ];

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              txn.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              txn.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || txn.type === filterType;
        return matchesSearch && matchesType;
    });

    const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'Completed').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'Completed').reduce((acc, t) => acc + t.amount, 0);
    const netRevenue = totalIncome - totalExpense;

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Transaction History</h1>
                    <p className="text-[#74777f] mt-1 text-[14px]">View all cash inflows and outflows of the platform.</p>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#137333]">
                            <TrendingUp size={20} />
                        </div>
                        <span className="font-bold text-[#43474e]">Total Income</span>
                    </div>
                    <div className="text-[24px] font-extrabold text-[#181c1e] ml-[52px]">
                        {totalIncome.toLocaleString()} đ
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#fceeee] flex items-center justify-center text-[#ba1a1a]">
                            <TrendingDown size={20} />
                        </div>
                        <span className="font-bold text-[#43474e]">Total Expense</span>
                    </div>
                    <div className="text-[24px] font-extrabold text-[#181c1e] ml-[52px]">
                        {totalExpense.toLocaleString()} đ
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[12px] shadow-sm border border-[#e0e3e5] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0061a5] opacity-5 rounded-bl-full"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                            <TrendingUp size={20} />
                        </div>
                        <span className="font-bold text-[#43474e]">Net Balance</span>
                    </div>
                    <div className="text-[24px] font-extrabold text-[#002045] ml-[52px]">
                        {netRevenue.toLocaleString()} đ
                    </div>
                </div>
            </div>


            {/* Controls */}
            <div className="bg-white p-4 rounded-t-[12px] border border-[#e0e3e5] border-b-0 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#e0e3e5] rounded-lg focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-[14px]"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="text-[#74777f] w-5 h-5" />
                    <select 
                        className="w-full sm:w-auto border border-[#e0e3e5] rounded-lg px-3 py-2 text-[14px] font-medium text-[#43474e] focus:outline-none focus:border-[#0061a5]"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Transactions</option>
                        <option value="income">Income Only (Money In)</option>
                        <option value="expense">Expense Only (Money Out)</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-b-[12px] shadow-sm border border-[#e0e3e5] overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Transaction ID</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Transaction Details</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">User</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Date</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] text-right">Amount</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Status</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(txn => (
                            <tr key={txn.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <span className="text-[13px] font-bold text-[#0061a5] bg-[#e6f0fa] px-2 py-1 rounded-md">{txn.id}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <div>
                                        <div className="text-[15px] font-bold text-[#002045]">{txn.category}</div>
                                        <div className="text-[13px] text-[#74777f] mt-0.5">{txn.description}</div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-[14px] font-bold text-[#181c1e]">{txn.user.name}</div>
                                    <div className="text-[12px] text-[#74777f]">{txn.user.role}</div>
                                </td>
                                <td className="py-4 px-6 text-[14px] font-medium text-[#43474e]">
                                    {txn.date}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className={`text-[15px] font-bold ${txn.status === 'Failed' ? 'text-[#74777f] line-through opacity-70' : txn.type === 'income' ? 'text-[#137333]' : 'text-[#ba1a1a]'}`}>
                                        {txn.type === 'income' ? '+' : '-'} {txn.amount.toLocaleString()} đ
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {txn.status === 'Completed' && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f4ea] text-[#137333] rounded-md border border-[#ceead6]">
                                            <CheckCircle size={14} />
                                            <span className="text-[12px] font-bold">Completed</span>
                                        </div>
                                    )}
                                    {txn.status === 'Processing' && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f0fa] text-[#0061a5] rounded-md border border-[#d2e4ff]">
                                            <Clock size={14} />
                                            <span className="text-[12px] font-bold">Processing</span>
                                        </div>
                                    )}
                                    {txn.status === 'Failed' && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fceeee] text-[#ba1a1a] rounded-md border border-[#f9dede]">
                                            <AlertCircle size={14} />
                                            <span className="text-[12px] font-bold">Failed</span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button 
                                        onClick={() => setSelectedTransaction(txn)}
                                        className="inline-flex p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL: TRANSACTION DETAIL */}
            {selectedTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-slide-up my-auto">
                        <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                {selectedTransaction.category === 'Course Registration' && <Receipt className="text-[#0061a5]" size={24} />}
                                {selectedTransaction.category === 'Course Refund' && <Undo className="text-[#ba1a1a]" size={24} />}
                                {selectedTransaction.category === 'Salary Payment' && <Wallet className="text-[#0061a5]" size={24} />}
                                {selectedTransaction.category !== 'Course Registration' && selectedTransaction.category !== 'Course Refund' && selectedTransaction.category !== 'Salary Payment' && <FileText className="text-[#0061a5]" size={24} />}
                                <h2 className="text-[20px] font-bold text-[#002045]">
                                    {selectedTransaction.category === 'Course Registration' ? 'Invoice Details' : 
                                     selectedTransaction.category === 'Course Refund' ? 'Refund Details' : 
                                     selectedTransaction.category === 'Salary Payment' ? 'Payslip Details' : 'Transaction Details'}
                                </h2>
                            </div>
                            <button onClick={() => setSelectedTransaction(null)} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                        </div>
                        
                        <div className="p-6">
                            {/* COURSE REGISTRATION (INVOICE) */}
                            {selectedTransaction.category === 'Course Registration' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start border-b border-[#e0e3e5] pb-6">
                                        <div>
                                            <h2 className="text-[24px] font-bold text-[#181c1e]">{selectedTransaction.user.name}</h2>
                                            <p className="text-[#43474e]">{selectedTransaction.user.role} • Student ID: STD-{selectedTransaction.id.split('-')[1] || '10293'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Status</p>
                                            <span className={`inline-block px-3 py-1 text-[14px] font-bold rounded-full uppercase ${selectedTransaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : selectedTransaction.status === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                                {selectedTransaction.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between text-[14px]">
                                        <div>
                                            <p className="text-[#74777f] font-bold uppercase mb-1 text-[12px]">Invoice No.</p>
                                            <p className="font-bold text-[#181c1e]">{selectedTransaction.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#74777f] font-bold uppercase mb-1 text-[12px]">Date of Issue</p>
                                            <p className="font-bold text-[#181c1e]">{selectedTransaction.date}</p>
                                        </div>
                                    </div>

                                    <table className="w-full text-left border-collapse border border-[#e0e3e5] rounded-lg overflow-hidden">
                                        <thead className="bg-[#f7fafc]">
                                            <tr>
                                                <th className="py-3 px-4 text-[13px] font-bold text-[#43474e] border-b border-[#e0e3e5]">Item Description</th>
                                                <th className="py-3 px-4 text-[13px] font-bold text-[#43474e] border-b border-[#e0e3e5] text-center">Qty</th>
                                                <th className="py-3 px-4 text-[13px] font-bold text-[#43474e] border-b border-[#e0e3e5] text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-4 px-4 text-[14px] font-bold text-[#002045] border-b border-[#e0e3e5]">
                                                    {selectedTransaction.description}
                                                    <div className="text-[12px] font-normal text-[#74777f] mt-1">Course Tuition Fee</div>
                                                </td>
                                                <td className="py-4 px-4 text-[14px] text-center border-b border-[#e0e3e5]">1</td>
                                                <td className="py-4 px-4 text-[14px] font-bold text-right border-b border-[#e0e3e5]">{selectedTransaction.amount.toLocaleString()} đ</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="flex justify-end">
                                        <div className="w-1/2">
                                            <div className="flex justify-between py-2 text-[14px]">
                                                <span className="text-[#43474e]">Subtotal</span>
                                                <span className="font-bold">{selectedTransaction.amount.toLocaleString()} đ</span>
                                            </div>
                                            <div className="flex justify-between py-2 text-[14px] border-b border-[#e0e3e5]">
                                                <span className="text-[#43474e]">Tax (0%)</span>
                                                <span className="font-bold">0 đ</span>
                                            </div>
                                            <div className="flex justify-between py-3">
                                                <span className="text-[16px] font-bold text-[#002045]">Total</span>
                                                <span className="text-[20px] font-extrabold text-[#137333]">{selectedTransaction.amount.toLocaleString()} đ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* COURSE REFUND */}
                            {selectedTransaction.category === 'Course Refund' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start border-b border-[#e0e3e5] pb-6">
                                        <div>
                                            <h2 className="text-[24px] font-bold text-[#181c1e]">{selectedTransaction.user.name}</h2>
                                            <p className="text-[#43474e]">{selectedTransaction.user.role} • Student ID: STD-{selectedTransaction.id.split('-')[1] || '10293'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Status</p>
                                            <span className={`inline-block px-3 py-1 text-[14px] font-bold rounded-full uppercase ${selectedTransaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : selectedTransaction.status === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                                {selectedTransaction.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Refund ID</span>
                                            <span className="text-[14px] font-bold text-[#181c1e]">{selectedTransaction.id}</span>
                                        </div>
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Date Processed</span>
                                            <span className="text-[14px] font-bold text-[#181c1e]">{selectedTransaction.date}</span>
                                        </div>
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Original Course</span>
                                            <span className="text-[14px] font-bold text-[#181c1e]">{selectedTransaction.description}</span>
                                        </div>
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Reason</span>
                                            <span className="text-[14px] text-[#43474e]">Requested by learner before course start date.</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#fceeee] rounded-[12px] p-6 flex justify-between items-center border border-[#ba1a1a] shadow-sm">
                                        <div>
                                            <span className="block text-[14px] text-[#900b09] uppercase font-bold tracking-wider">Amount Refunded</span>
                                            <span className="text-[12px] text-[#ba1a1a] mt-1">Returned to original payment method</span>
                                        </div>
                                        <span className="text-[32px] md:text-[40px] font-extrabold text-[#ba1a1a] tracking-tight">
                                            {selectedTransaction.amount.toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* SALARY PAYMENT (PAYSLIP) */}
                            {selectedTransaction.category === 'Salary Payment' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#e0e3e5]">
                                        <div>
                                            <h2 className="text-[24px] font-bold text-[#181c1e]">{selectedTransaction.user.name}</h2>
                                            <p className="text-[#43474e]">{selectedTransaction.user.role} • Payslip: {selectedTransaction.description}</p>
                                        </div>
                                        <div className="text-right mt-4 md:mt-0">
                                            <p className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Status</p>
                                            <span className={`inline-block px-3 py-1 text-[14px] font-bold rounded-full uppercase ${selectedTransaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : selectedTransaction.status === 'Processing' ? 'bg-[#fff8e1] text-[#c9a82c]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                                {selectedTransaction.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Earnings */}
                                        <div>
                                            <h3 className="text-[16px] font-bold text-[#181c1e] mb-4 flex items-center gap-2"><DollarSign size={18}/> Earnings</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[12px] font-bold text-[#43474e] mb-1">Base Salary (Monthly - đ)</label>
                                                    <div className="w-full px-3 py-2 text-[14px] bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">{selectedTransaction.amount.toLocaleString()}</div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-[12px] font-bold text-[#43474e] mb-1">OT Hours</label>
                                                        <div className="w-full px-3 py-2 text-[14px] bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">0</div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[12px] font-bold text-[#43474e] mb-1">OT Rate/Hr</label>
                                                        <div className="w-full px-3 py-2 text-[14px] bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">0</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-[#43474e] mb-1">Bonus / Allowances (đ)</label>
                                                    <div className="w-full px-3 py-2 text-[14px] bg-[#f1f4f6] border border-[#c4c6cf] rounded-lg text-[#181c1e] font-bold">0</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-[#f8f9fa] rounded-lg border border-[#e6f0fa] flex justify-between items-center">
                                                <span className="text-[#0061a5] font-bold text-[14px]">Total Earnings</span>
                                                <span className="font-bold text-[#0061a5] text-[16px]">{selectedTransaction.amount.toLocaleString()} đ</span>
                                            </div>
                                        </div>
                                        
                                        {/* Deductions */}
                                        <div>
                                            <h3 className="text-[16px] font-bold text-[#181c1e] mb-4 flex items-center gap-2"><Calculator size={18}/> Deductions</h3>
                                            <div className="space-y-4">
                                                <div className="flex gap-2 items-start">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="w-full px-3 py-2 text-[13px] bg-[#f1f4f6] border border-[#ffebed] rounded-lg text-[#ba1a1a]">None</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-[#fff0f0] rounded-lg border border-[#ffccd2] flex justify-between items-center">
                                                <span className="text-[#ba1a1a] font-bold text-[14px]">Total Deductions</span>
                                                <span className="font-bold text-[#ba1a1a] text-[16px]">0 đ</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#e6f0fa] rounded-[12px] p-6 flex justify-between items-center border border-[#0061a5] shadow-sm">
                                        <div>
                                            <span className="block text-[14px] text-[#002045] uppercase font-bold tracking-wider">Final Net Pay</span>
                                            <span className="text-[12px] text-[#0061a5] mt-1">Amount to be transferred</span>
                                        </div>
                                        <span className="text-[32px] md:text-[40px] font-extrabold text-[#0061a5] tracking-tight">
                                            {selectedTransaction.amount.toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* OTHER GENERIC TRANSACTIONS (Fallback) */}
                            {selectedTransaction.category !== 'Course Registration' && selectedTransaction.category !== 'Course Refund' && selectedTransaction.category !== 'Salary Payment' && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <span className="text-[14px] text-[#74777f] uppercase font-bold block mb-2">Amount</span>
                                        <span className={`text-[36px] font-extrabold ${selectedTransaction.status === 'Failed' ? 'text-[#74777f] line-through opacity-70' : selectedTransaction.type === 'income' ? 'text-[#137333]' : 'text-[#ba1a1a]'}`}>
                                            {selectedTransaction.status !== 'Failed' ? (selectedTransaction.type === 'income' ? '+ ' : '- ') : ''}{selectedTransaction.amount.toLocaleString()} đ
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Transaction ID</span>
                                            <span className="text-[14px] font-bold text-[#181c1e]">{selectedTransaction.id}</span>
                                        </div>
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Date</span>
                                            <span className="text-[14px] font-bold text-[#181c1e]">{selectedTransaction.date}</span>
                                        </div>
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Category</span>
                                            <span className="text-[14px] font-bold text-[#181c1e]">{selectedTransaction.category}</span>
                                        </div>
                                        <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Status</span>
                                            <span className={`inline-block px-2 py-1 text-[12px] font-bold rounded uppercase mt-1 ${selectedTransaction.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' : selectedTransaction.status === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                                {selectedTransaction.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                                        <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">Description</span>
                                        <span className="text-[14px] text-[#43474e]">{selectedTransaction.description}</span>
                                    </div>

                                    <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5] flex items-center justify-between">
                                        <div>
                                            <span className="text-[12px] text-[#74777f] font-bold uppercase block mb-1">User</span>
                                            <span className="text-[15px] font-bold text-[#181c1e]">{selectedTransaction.user.name}</span>
                                        </div>
                                        <span className="px-3 py-1 bg-white border border-[#c4c6cf] rounded-full text-[12px] font-bold text-[#43474e]">
                                            {selectedTransaction.user.role}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-[#e0e3e5] bg-[#f7fafc] flex justify-end gap-3">
                            <button onClick={() => setSelectedTransaction(null)} className="px-6 py-2.5 font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinance;
