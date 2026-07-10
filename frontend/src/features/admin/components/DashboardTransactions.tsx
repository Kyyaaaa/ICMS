import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { DashboardTransaction } from '../types/dashboard';
import { formatDateTime } from '@/shared/utils/date';

interface DashboardTransactionsProps {
    transactions: DashboardTransaction[];
}

export const DashboardTransactions = ({ transactions }: DashboardTransactionsProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-[#181c1e]">Recent Transactions</h2>
                <Link to="/admin/finance" className="text-[#0061a5] text-sm font-medium hover:underline">View All</Link>
            </div>
            <div className="p-0 overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-200">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Transaction ID</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Transaction Details</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">User</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Date</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e] text-right">Amount</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(txn => (
                            <tr key={txn.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                        txn.id.startsWith('INV') ? 'text-[#0061a5] bg-[#e6f0fa]' :
                                        txn.id.startsWith('REF') ? 'text-[#ba1a1a] bg-[#fceeee]' :
                                        txn.id.startsWith('PAY') ? 'text-[#c2410c] bg-[#fff7ed]' :
                                        'text-[#43474e] bg-[#f1f4f6]'
                                    }`}>
                                        {txn.id}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div>
                                        <div className="text-sm font-bold text-[#002045]">
                                            {txn.category}
                                            {txn.isInstallment && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e6f0fa] text-[#0061a5]">Installment</span>}
                                        </div>
                                        <div className="text-xs text-[#74777f] mt-0.5">{txn.description}</div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-sm font-bold text-[#181c1e]">{txn.user.name}</div>
                                    <div className="text-xs text-[#74777f]">{txn.user.role}</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-[#43474e]">{formatDateTime(txn.date)}</td>
                                <td className="py-4 px-6 text-right">
                                    <div className={`text-sm font-bold ${txn.status === 'Failed' && !txn.paidAmount ? 'text-[#74777f] line-through opacity-70' : txn.type === 'income' ? 'text-[#137333]' : 'text-[#ba1a1a]'}`}>
                                        {txn.type === 'income' ? '+' : '-'} {txn.amount.toLocaleString('en-US')} VND
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
                                    {txn.status === 'Refunded' && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f4f6] text-[#43474e] rounded-md border border-[#e0e3e5]">
                                            <CheckCircle size={14} />
                                            <span className="text-xs font-bold">Refunded</span>
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
