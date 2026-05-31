import React, { useState } from 'react';
import { Search, Eye, DollarSign, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [invoices] = useState([
        {
            id: 'INV-10024',
            learner: 'Alex Johnson',
            course: 'IELTS Intensive Mastery',
            paymentMethod: 'Full',
            progress: '1/1',
            totalAmount: '$500.00',
            paidAmount: '$500.00',
            date: 'Oct 24, 2026',
            status: 'Paid',
            installments: [
                { id: '1', term: 'Full Payment', dueDate: 'Oct 24, 2026', status: 'Paid', method: 'Credit Card (*4421)', paidDate: 'Oct 24, 2026', amount: 500.00 }
            ],
            rawPaid: 500,
            rawTotal: 500,
            rawRemaining: 0
        },
        {
            id: 'INV-10025',
            learner: 'Sarah Connor',
            course: 'TOEIC Target 700+',
            paymentMethod: 'Installment',
            progress: '2/3',
            totalAmount: '$300.00',
            paidAmount: '$200.00',
            date: 'Oct 22, 2026',
            status: 'Partial',
            installments: [
                { id: '1', term: '1st Installment (Deposit)', dueDate: 'Oct 01, 2026', status: 'Paid', method: 'Credit Card (*4421)', paidDate: 'Oct 01, 2026', amount: 100.00 },
                { id: '2', term: '2nd Installment', dueDate: 'Nov 01, 2026', status: 'Paid', method: 'Bank Transfer', paidDate: 'Oct 22, 2026', amount: 100.00 },
                { id: '3', term: '3rd Installment (Final)', dueDate: 'Dec 01, 2026', status: 'Pending', method: '', paidDate: '', amount: 100.00 }
            ],
            rawPaid: 200,
            rawTotal: 300,
            rawRemaining: 100
        },
        {
            id: 'INV-10026',
            learner: 'Michael Smith',
            course: 'Basic Communication',
            paymentMethod: 'Installment',
            progress: '1/2',
            totalAmount: '$200.00',
            paidAmount: '$100.00',
            date: 'Sep 10, 2026',
            status: 'Overdue',
            installments: [
                { id: '1', term: '1st Installment (Deposit)', dueDate: 'Sep 01, 2026', status: 'Paid', method: 'Bank Transfer', paidDate: 'Sep 10, 2026', amount: 100.00 },
                { id: '2', term: '2nd Installment', dueDate: 'Oct 01, 2026', status: 'Overdue', method: '', paidDate: '', amount: 100.00 }
            ],
            rawPaid: 100,
            rawTotal: 200,
            rawRemaining: 100
        }
    ]);

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.learner.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Partial': return 'bg-blue-100 text-[#0061a5]';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'Partial': return <Clock className="w-3.5 h-3.5" />;
            case 'Pending': return <Clock className="w-3.5 h-3.5" />;
            case 'Overdue': return <AlertCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-[24px] font-bold text-[#002045]">Invoice Management</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]" />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Learner..." 
                            className="pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg w-[280px] focus:ring-2 focus:ring-[#0061a5] focus:outline-none bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061a5] font-medium bg-white text-[#181c1e]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                        <tr>
                            <th className="p-4 font-semibold text-[#43474e]">Invoice ID</th>
                            <th className="p-4 font-semibold text-[#43474e]">Learner & Course</th>
                            <th className="p-4 font-semibold text-[#43474e]">Payment Method</th>
                            <th className="p-4 font-semibold text-[#43474e]">Progress</th>
                            <th className="p-4 font-semibold text-[#43474e]">Amount</th>
                            <th className="p-4 font-semibold text-[#43474e]">Status</th>
                            <th className="p-4 font-semibold text-[#43474e] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map(item => (
                            <tr key={item.id} className="border-b border-[#e0e3e5] hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-[#0061a5]">{item.id}</td>
                                <td className="p-4">
                                    <div className="font-bold text-[#002045]">{item.learner}</div>
                                    <div className="text-[13px] text-[#74777f]">{item.course}</div>
                                </td>
                                <td className="p-4">
                                    <span className="font-semibold text-[#43474e] flex items-center gap-1.5">
                                        <DollarSign className="w-4 h-4 text-[#74777f]" />
                                        {item.paymentMethod}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-[#181c1e]">{item.progress}</div>
                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${item.status === 'Paid' ? 'bg-green-500' : item.status === 'Partial' ? 'bg-[#0061a5]' : 'bg-red-500'}`}
                                                style={{ width: `${(parseInt(item.progress.split('/')[0]) / parseInt(item.progress.split('/')[1])) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-[#002045]">{item.paidAmount} <span className="text-gray-400 font-medium text-[13px]">/ {item.totalAmount}</span></div>
                                    <div className="text-[12px] text-[#74777f]">Last paid: {item.date}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1 w-fit px-2.5 py-1 rounded-md text-[12px] font-bold ${getStatusStyle(item.status)}`}>
                                        {getStatusIcon(item.status)} {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link to={`/staff/invoices/${item.id}`} className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#0061a5] text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors text-[13px] font-bold bg-white">
                                            <Eye className="w-4 h-4" /> View Details
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceList;