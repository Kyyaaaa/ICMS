import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import type { DashboardTransaction } from '../types/dashboard';

interface DashboardTransactionsProps {
    transactions: DashboardTransaction[];
}

export const DashboardTransactions = ({ transactions }: DashboardTransactionsProps) => {
    return (
        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-center shrink-0">
                <h2 className="text-[18px] font-bold text-[#181c1e]">Recent Transactions</h2>
                <Link to="/admin/finance" className="text-[#0061a5] text-[14px] font-medium hover:underline">View All</Link>
            </div>
            <div className="p-0 overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Transaction ID</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Transaction Details</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">User</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Date</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] text-right">Amount</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(txn => (
                            <tr key={txn.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <span className={`text-[13px] font-bold px-2 py-1 rounded-md ${txn.type === 'income' ? 'text-[#0061a5] bg-[#e6f0fa]' : 'text-[#ba1a1a] bg-[#fceeee]'}`}>
                                        {txn.id}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div>
                                        <div className="text-[14px] font-bold text-[#002045]">{txn.category}</div>
                                        <div className="text-[12px] text-[#74777f]">{txn.description}</div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-[14px] font-bold text-[#181c1e]">{txn.user.name}</div>
                                    <div className="text-[12px] text-[#74777f]">{txn.user.role}</div>
                                </td>
                                <td className="py-4 px-6 text-[14px] text-[#43474e]">{txn.date}</td>
                                <td className="py-4 px-6 text-right">
                                    <span className={`text-[14px] font-bold ${txn.type === 'income' ? 'text-[#137333]' : 'text-[#ba1a1a]'}`}>
                                        {txn.type === 'income' ? '+ ' : '- '} {txn.amount.toLocaleString()} đ
                                    </span>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
