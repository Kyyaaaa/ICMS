import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle2, XCircle, RefreshCcw, Landmark, Clock, FileText, X } from 'lucide-react';
import type { RefundRequest } from '../types/refund';
import { AdminRefundsService } from '../services/refunds.service';

const AdminRefunds = () => {
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // For Modal processing/viewing in-page (keeps state synced)
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [processNote, setProcessNote] = useState('');

    useEffect(() => {
        const fetchRefunds = async () => {
            const data = await AdminRefundsService.getRefunds();
            setRefunds(data);
        };
        fetchRefunds();
    }, []);

    const filteredRefunds = refunds.filter(r => {
        const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              r.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleProcess = async (dbId: string, id: string, newStatus: 'APPROVED' | 'COMPLETED' | 'REJECTED') => {
        const success = await AdminRefundsService.updateStatus(dbId, newStatus, processNote);
        if (success) {
            setRefunds(refunds.map(r => r.id === id ? { ...r, status: newStatus === 'APPROVED' ? 'Approved' : newStatus === 'COMPLETED' ? 'Completed' : 'Rejected', notes: processNote } : r));
        }
        setSelectedRefund(null);
        setProcessNote('');
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Pending': return 'bg-[#fff8e1] text-[#c9a82c]';
            case 'Approved': return 'bg-[#e6f0fa] text-[#0061a5]';
            case 'Completed': return 'bg-[#e6f4ea] text-[#137333]';
            case 'Rejected': return 'bg-[#ffebed] text-[#ba1a1a]';
            default: return 'bg-[#f1f4f6] text-[#74777f]';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Manage Refunds</h1>
            </div>

            {/* Stats/Filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map(status => (
                    <button 
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`p-4 rounded-xl border text-left transition-colors ${
                            statusFilter === status 
                                ? 'bg-[#0061a5] border-[#0061a5] text-white' 
                                : 'bg-white border-[#e0e3e5] text-[#43474e] hover:bg-[#f7fafc]'
                        }`}
                    >
                        <div className="text-xs font-bold uppercase mb-1">{status}</div>
                        <div className="text-2xl font-extrabold">
                            {status === 'All' ? refunds.length : refunds.filter(r => r.status === status).length}
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="p-4 border-b border-[#e0e3e5] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#f7fafc]">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                        <input 
                            className="pl-10 pr-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] w-full" 
                            placeholder="Search by ID, Invoice, or Student..." 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-250">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Request / Invoice</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Student / Course</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Total Paid</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Refund Amt</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Req. Date</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Status</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRefunds.map(r => (
                                <tr key={r.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-[#0061a5]">{r.id}</div>
                                        <div className="text-xs text-[#74777f] flex items-center gap-1 mt-1">
                                            <FileText size={14}/> {r.invoiceId} ({r.installment})
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-[#181c1e]">{r.studentName}</div>
                                        <div className="text-xs text-[#74777f] truncate max-w-50" title={r.courseName}>{r.courseName}</div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[#43474e]">
                                        {r.totalPaid.toLocaleString()} đ
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-[#ba1a1a]">
                                        {r.refundAmount.toLocaleString()} đ
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[#43474e]">
                                        {new Date(r.requestedDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short', hour12: false })}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getStatusBadge(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => { setSelectedRefund(r); setProcessNote(r.notes || ''); }} 
                                            className="inline-flex p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors"
                                            title="View / Process"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRefunds.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-[#74777f]">No refund requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail / Processing Modal */}
            {selectedRefund && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden animate-slide-up my-auto">
                        <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <RefreshCcw className="text-[#0061a5]" size={24} />
                                <h2 className="text-xl font-bold text-[#002045]">Refund Details: {selectedRefund.id}</h2>
                            </div>
                            <button onClick={() => setSelectedRefund(null)} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Col: Info */}
                            <div className="space-y-6">
                                <div className="bg-[#f1f4f6] p-4 rounded-xl space-y-3">
                                    <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-2">Student & Invoice</h3>
                                    <div>
                                        <span className="block text-xs text-[#74777f]">Student Name</span>
                                        <span className="font-bold text-[#181c1e]">{selectedRefund.studentName} <span className="font-normal text-[#43474e]">({selectedRefund.studentEmail})</span></span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-[#74777f]">Course</span>
                                        <span className="font-bold text-[#181c1e]">{selectedRefund.courseName}</span>
                                    </div>
                                    <div className="pt-2 border-t border-[#c4c6cf]">
                                        <span className="block text-xs text-[#74777f]">Invoice & Installment</span>
                                        <span className="font-bold text-[#0061a5]">{selectedRefund.invoiceId}</span> - {selectedRefund.installment}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider flex items-center gap-2"><Landmark size={16}/> Bank Information</h3>
                                    <div className="bg-white border border-[#e0e3e5] p-3 rounded-xl shadow-sm text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-[#74777f]">Bank:</span> <span className="font-bold text-[#181c1e]">{selectedRefund.bankName}</span>
                                            <span className="text-[#74777f]">Account No:</span> <span className="font-bold text-[#181c1e]">{selectedRefund.bankAccountNumber}</span>
                                            <span className="text-[#74777f]">Account Name:</span> <span className="font-bold text-[#181c1e]">{selectedRefund.bankAccountName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Amounts & Action */}
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-[#e0e3e5] p-4 rounded-xl">
                                        <span className="block text-xs text-[#74777f] uppercase font-bold">Total Paid</span>
                                        <span className="text-xl font-extrabold text-[#43474e]">{selectedRefund.totalPaid.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex-1 bg-[#fff8f8] border border-[#ffebed] p-4 rounded-xl">
                                        <span className="block text-xs text-[#ba1a1a] uppercase font-bold">Refund Amount</span>
                                        <span className="text-xl font-extrabold text-[#ba1a1a]">{selectedRefund.refundAmount.toLocaleString()}đ</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-2">Reason for Refund</h3>
                                    <p className="text-sm text-[#43474e] bg-[#f8f9fa] p-3 rounded-xl border border-[#e0e3e5] leading-relaxed">
                                        {selectedRefund.reason}
                                    </p>
                                </div>

                                <div className="border-t border-[#e0e3e5] pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider flex items-center gap-2"><Clock size={16}/> Status & Processing</h3>
                                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getStatusBadge(selectedRefund.status)}`}>
                                            {selectedRefund.status}
                                        </span>
                                    </div>
                                    
                                    <textarea 
                                        className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] min-h-20"
                                        placeholder="Add note (optional)..."
                                        value={processNote}
                                        onChange={e => setProcessNote(e.target.value)}
                                        disabled={selectedRefund.status === 'Completed' || selectedRefund.status === 'Rejected'}
                                    />
                                    
                                    {selectedRefund.status === 'Pending' && (
                                        <div className="flex gap-3 mt-4">
                                            <button 
                                                onClick={() => handleProcess(selectedRefund.dbId!, selectedRefund.id, 'APPROVED')}
                                                className="flex-1 bg-[#137333] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0d5022] transition-colors"
                                            >
                                                <CheckCircle2 size={18} /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleProcess(selectedRefund.dbId!, selectedRefund.id, 'REJECTED')}
                                                className="flex-1 bg-[#ba1a1a] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#93000a] transition-colors"
                                            >
                                                <XCircle size={18} /> Reject
                                            </button>
                                        </div>
                                    )}

                                    {selectedRefund.status === 'Approved' && (
                                        <div className="flex gap-3 mt-4">
                                            <button 
                                                onClick={() => handleProcess(selectedRefund.dbId!, selectedRefund.id, 'COMPLETED')}
                                                className="w-full bg-[#0061a5] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#004d80] transition-colors"
                                            >
                                                Mark as Completed (Transferred)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRefunds;
