import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, DollarSign, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Invoice } from '../types/invoice';
import { InvoicesService } from '../services/invoices.service';

const InvoiceList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const loadInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await InvoicesService.getInvoices({
                status: statusFilter,
                page: currentPage,
                limit: limit
            });
            setInvoices(response.data);
            setTotalPages(Math.ceil(response.total / limit));
        } catch (error) {
            console.error("Failed to load invoices", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter]);

    useEffect(() => {
        // eslint-disable-next-line
        loadInvoices();
    }, [loadInvoices]);

    const handleStatusChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setCurrentPage(1);
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.learner.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
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
                <h1 className="text-2xl font-bold text-[#002045]">Invoice Management</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]" />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Learner..." 
                            className="pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg w-70 focus:ring-2 focus:ring-[#0061a5] focus:outline-none bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061a5] font-medium bg-white text-[#181c1e]"
                        value={statusFilter}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                        <tr>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Invoice ID</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Learner & Course</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Payment Method</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Progress</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Amount</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">No invoices found.</td>
                            </tr>
                        ) : (
                            filteredInvoices.map(item => (
                                <tr key={item.id} className="border-b border-[#e0e3e5] hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-[#0061a5]">{item.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-[#002045]">{item.learner}</div>
                                        <div className="text-xs text-[#74777f]">{item.course}</div>
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
                                        <div className="font-bold text-[#002045]">{item.paidAmount} <span className="text-gray-400 font-medium text-xs">/ {item.totalAmount}</span></div>
                                        <div className="text-xs text-[#74777f]">Last paid: {item.date}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1 w-fit px-2.5 py-1 rounded-md text-xs font-bold ${getStatusStyle(item.status)}`}>
                                            {getStatusIcon(item.status)} {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/staff/invoices/${item.id}`} className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#0061a5] text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors text-xs font-bold bg-white">
                                                <Eye className="w-4 h-4" /> View Details
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e0e3e5] shadow-sm">
                    <span className="text-sm text-[#43474e] font-medium">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 border border-[#c4c6cf] rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors font-semibold text-sm text-[#43474e] bg-white shadow-sm"
                        >
                            Previous
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="px-4 py-2 border border-[#c4c6cf] rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors font-semibold text-sm text-[#43474e] bg-white shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceList;
