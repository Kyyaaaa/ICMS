import { Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { Transaction } from '../types/finance';

interface FinanceTableProps {
    transactions: Transaction[];
    setSelectedTransaction: (txn: Transaction) => void;
}

export const FinanceTable = ({ transactions, setSelectedTransaction }: FinanceTableProps) => {
    return (
        <div className="bg-white rounded-b-[12px] shadow-sm border border-[#e0e3e5] overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-225">
                <thead>
                    <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                        <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Transaction ID</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Transaction Details</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#43474e]">User</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Date</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#43474e] text-right">Amount</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-[#43474e] text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(txn => (
                        <tr key={txn.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                            <td className="py-4 px-6">
                                <span className="text-xs font-bold text-[#0061a5] bg-[#e6f0fa] px-2 py-1 rounded-md">{txn.id}</span>
                            </td>
                            <td className="py-4 px-6">
                                <div>
                                    <div className="text-sm font-bold text-[#002045]">{txn.category}</div>
                                    <div className="text-xs text-[#74777f] mt-0.5">{txn.description}</div>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="text-sm font-bold text-[#181c1e]">{txn.user.name}</div>
                                <div className="text-xs text-[#74777f]">{txn.user.role}</div>
                            </td>
                            <td className="py-4 px-6 text-sm font-medium text-[#43474e]">
                                {txn.date}
                            </td>
                            <td className="py-4 px-6 text-right">
                                <div className={`text-sm font-bold ${txn.status === 'Failed' ? 'text-[#74777f] line-through opacity-70' : txn.type === 'income' ? 'text-[#137333]' : 'text-[#ba1a1a]'}`}>
                                    {txn.type === 'income' ? '+' : '-'} {txn.amount.toLocaleString()} đ
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                {txn.status === 'Completed' && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f4ea] text-[#137333] rounded-md border border-[#ceead6]">
                                        <CheckCircle size={14} />
                                        <span className="text-xs font-bold">Completed</span>
                                    </div>
                                )}
                                {txn.status === 'Processing' && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f0fa] text-[#0061a5] rounded-md border border-[#d2e4ff]">
                                        <Clock size={14} />
                                        <span className="text-xs font-bold">Processing</span>
                                    </div>
                                )}
                                {txn.status === 'Failed' && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fceeee] text-[#ba1a1a] rounded-md border border-[#f9dede]">
                                        <AlertCircle size={14} />
                                        <span className="text-xs font-bold">Failed</span>
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
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan={7} className="py-8 text-center text-[#74777f]">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
