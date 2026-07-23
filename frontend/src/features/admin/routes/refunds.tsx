import { formatDateTime } from "../../../shared/utils/date";
import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle2, XCircle, RefreshCcw, Landmark, Clock, FileText, X, AlertCircle, Upload, Image as ImageIcon, User } from 'lucide-react';
import { Pagination } from '@/shared/components/common/Pagination';
import type { RefundRequest } from '../types/refund';
import { AdminRefundsService } from '../services/refunds.service';
import axiosClient from '@/shared/services/axiosClient';
import { showAlertModal } from '@/utils/modal';

const AdminRefunds = () => {
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);

    // For Modal processing/viewing in-page (keeps state synced)
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [processNote, setProcessNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

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
        const matchesStatus = statusFilter === 'All' || getDisplayStatus(r.status) === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getDisplayStatus = (status: string) => {
        if (status === 'Pending') return 'Pending Approval';
        if (status === 'Approved') return 'Pending Refund';
        return status;
    };

    const handleProcess = async (dbId: string, id: string, newStatus: 'APPROVED' | 'COMPLETED' | 'REJECTED') => {
        let uploadedUrl = undefined;
        
        if (newStatus === 'COMPLETED') {
            if (!proofFile) {
                showAlertModal("Error", "Please upload a transaction receipt image as proof.", "error");
                return;
            }
            setIsProcessing(true);
            try {
                const formData = new FormData();
                formData.append('file', proofFile);
                const uploadRes = await axiosClient.post('/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }) as { url: string };
                uploadedUrl = uploadRes.url;
            } catch (error) {
                showAlertModal("Error", "Failed to upload transaction proof image.", "error");
                setIsProcessing(false);
                return;
            }
        } else {
            setIsProcessing(true);
        }

        try {
            const success = await AdminRefundsService.updateStatus(dbId, newStatus, processNote, uploadedUrl);
            if (success) {
                setRefunds(refunds.map(r => r.id === id ? { ...r, status: newStatus === 'APPROVED' ? 'Approved' : newStatus === 'COMPLETED' ? 'Completed' : 'Rejected', notes: processNote, proofImageUrl: uploadedUrl || r.proofImageUrl, approvedDate: newStatus === 'APPROVED' ? new Date().toISOString() : r.approvedDate, processedDate: (newStatus === 'COMPLETED' || newStatus === 'REJECTED') ? new Date().toISOString() : r.processedDate } : r));
            }
            setSelectedRefund(null);
            setProcessNote('');
            setProofFile(null);
            setProofPreview(null);
        } catch (error: unknown) {
            showAlertModal("Error", "Failed to update status: " + ((error as Error)?.message || "Unknown error"), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const isOverdue = (r: RefundRequest) => {
        const now = new Date().getTime();
        if (r.status === 'Pending') {
            const reqTime = new Date(r.requestedDate).getTime();
            return now > reqTime + 3 * 24 * 60 * 60 * 1000;
        }
        if (r.status === 'Approved' && r.approvedDate) {
            const appTime = new Date(r.approvedDate).getTime();
            return now > appTime + 5 * 24 * 60 * 60 * 1000;
        }
        return false;
    };

    const getStatusBadge = (status: string) => {
        const display = getDisplayStatus(status);
        switch(display) {
            case 'Pending Approval': return 'bg-[#fff8e1] text-[#c9a82c]';
            case 'Pending Refund': return 'bg-[#e6f0fa] text-[#0061a5]';
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
                {['All', 'Pending Approval', 'Pending Refund', 'Completed', 'Rejected'].map(status => (
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
                            {status === 'All' ? refunds.length : refunds.filter(r => getDisplayStatus(r.status) === status).length}
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
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-250">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Request / Invoice</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Student / Course</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Total Paid</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Refund Amt</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Req. Date</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRefunds.slice((currentPage - 1) * 10, currentPage * 10).map(r => (
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
                                        {r.totalPaid.toLocaleString('en-US')} VND
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-[#ba1a1a]">
                                        {r.refundAmount.toLocaleString('en-US')} VND
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[#43474e]">
                                        {formatDateTime(r.requestedDate)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getStatusBadge(r.status)}`}>
                                                {getDisplayStatus(r.status)}
                                            </span>
                                            {isOverdue(r) && (
                                                <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffebed] px-1.5 py-0.5 rounded flex items-center gap-1">
                                                    <AlertCircle size={10} /> Overdue
                                                </span>
                                            )}
                                            {r.status === 'Pending' && (
                                                <span className="text-[10px] text-[#74777f]">
                                                    Due: {formatDateTime(new Date(new Date(r.requestedDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()).split(',')[0]}
                                                </span>
                                            )}
                                            {r.status === 'Approved' && r.approvedDate && (
                                                <span className="text-[10px] text-[#74777f]">
                                                    Due: {formatDateTime(new Date(new Date(r.approvedDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()).split(',')[0]}
                                                </span>
                                            )}
                                        </div>
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
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredRefunds.length}
                    itemsPerPage={10}
                    onPageChange={setCurrentPage}
                    itemName="refunds"
                />
            </div>

            {/* Detail / Processing Modal */}
            {selectedRefund && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-slide-up my-auto">
                        <div className="p-5 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f8f9fa]">
                            <div className="flex items-center gap-3">
                                <RefreshCcw className="text-[#0061a5]" size={24} />
                                <h2 className="text-xl font-bold text-[#002045]">Refund Details: {selectedRefund.id}</h2>
                            </div>
                            <button onClick={() => setSelectedRefund(null)} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Col: Info */}
                            <div className="space-y-6">
                                <div className="bg-[#f8f9fa] p-5 rounded-xl border border-[#e0e3e5] space-y-3">
                                    <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-2 flex items-center gap-2"><User size={16}/> Student & Invoice</h3>
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
                                    <div className="bg-white shadow-sm border border-[#e0e3e5] p-4 rounded-xl text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-[#74777f]">Bank:</span> <span className="font-bold text-[#181c1e]">{selectedRefund.bankName}</span>
                                            <span className="text-[#74777f]">Account No:</span> <span className="font-bold text-[#181c1e]">{selectedRefund.bankAccountNumber}</span>
                                            <span className="text-[#74777f]">Account Name:</span> <span className="font-bold text-[#181c1e]">{selectedRefund.bankAccountName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Amounts & Action */}
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-[#e0e3e5] p-4 rounded-xl">
                                        <span className="block text-xs text-[#74777f] uppercase font-bold">Total Paid</span>
                                        <span className="text-xl font-extrabold text-[#43474e]">{selectedRefund.totalPaid.toLocaleString('en-US')} VND</span>
                                    </div>
                                    <div className="flex-1 bg-[#fff8f8] border border-[#ffebed] p-4 rounded-xl">
                                        <span className="block text-xs text-[#ba1a1a] uppercase font-bold">Refund Amount</span>
                                        <span className="text-xl font-extrabold text-[#ba1a1a]">{selectedRefund.refundAmount.toLocaleString('en-US')} VND</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={16}/> Reason for Refund</h3>
                                    <p className="text-sm text-[#43474e] bg-[#f8f9fa] p-4 rounded-xl border border-[#e0e3e5] leading-relaxed">
                                        {selectedRefund.reason}
                                    </p>
                                </div>

                                <div className="border-t border-[#e0e3e5] pt-5">
                                    <div className="mb-4 space-y-3">
                                        <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider flex items-center gap-2"><Clock size={16}/> Status & Processing</h3>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {isOverdue(selectedRefund) && (
                                                <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffebed] px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap">
                                                    <AlertCircle size={14} /> Overdue SLA
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase whitespace-nowrap ${getStatusBadge(selectedRefund.status)}`}>
                                                {getDisplayStatus(selectedRefund.status)}
                                            </span>
                                            
                                            {selectedRefund.status === 'Pending' && (
                                                <span className="text-[11px] text-[#74777f] font-medium bg-[#f8f9fa] px-2 py-1 rounded border border-[#e0e3e5] whitespace-nowrap">
                                                    Due: {formatDateTime(new Date(new Date(selectedRefund.requestedDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()).split(',')[0]}
                                                </span>
                                            )}
                                            {selectedRefund.status === 'Approved' && selectedRefund.approvedDate && (
                                                <span className="text-[11px] text-[#74777f] font-medium bg-[#f8f9fa] px-2 py-1 rounded border border-[#e0e3e5] whitespace-nowrap">
                                                    Due: {formatDateTime(new Date(new Date(selectedRefund.approvedDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()).split(',')[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <textarea 
                                        className="w-full p-4 bg-[#f8f9fa] border border-[#e0e3e5] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors min-h-20"
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

                                </div>
                            </div>
                            
                            {/* Rightmost Col: Transaction Proof */}
                            <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-[#e0e3e5] lg:pl-6 pt-6 lg:pt-0">
                                <h3 className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-4 flex items-center gap-2"><ImageIcon size={16}/> Transaction Proof (Required)</h3>
                                
                                {selectedRefund.status === 'Approved' && (
                                    <div className="flex flex-col gap-4">
                                        <div className="h-72 shrink-0 bg-[#f8f9fa] rounded-xl border-2 border-dashed border-[#c4c6cf] flex flex-col items-center justify-center relative overflow-hidden group">
                                            {proofPreview ? (
                                                <>
                                                    <img src={proofPreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black/5" />
                                                    <a href={proofPreview} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-medium text-sm z-10">
                                                        Click to view full size
                                                    </a>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <Upload size={32} className="text-[#c4c6cf] mx-auto mb-2" />
                                                    <span className="text-sm font-medium text-[#74777f]">No receipt selected</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <label className="cursor-pointer bg-white border border-[#c4c6cf] rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-[#f0f2f4] transition-colors w-full font-medium text-[#43474e]">
                                            <Upload size={18} />
                                            <span>{proofPreview ? 'Change receipt' : 'Upload receipt'}</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setProofFile(file);
                                                        setProofPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>

                                        <button 
                                            disabled={isProcessing}
                                            onClick={() => handleProcess(selectedRefund.dbId!, selectedRefund.id, 'COMPLETED')}
                                            className="w-full bg-[#0061a5] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#004d80] transition-colors disabled:opacity-50 mt-auto"
                                        >
                                            <CheckCircle2 size={20} /> Mark as Completed
                                        </button>
                                    </div>
                                )}

                                {selectedRefund.status === 'Completed' && selectedRefund.proofImageUrl && (
                                    <a href={selectedRefund.proofImageUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-80 relative rounded-xl border border-[#e0e3e5] overflow-hidden hover:opacity-90 transition-opacity bg-black/5">
                                        <img src={selectedRefund.proofImageUrl} alt="Transaction Proof" className="absolute inset-0 w-full h-full object-contain" />
                                    </a>
                                )}
                                
                                {selectedRefund.status !== 'Approved' && (!selectedRefund.proofImageUrl || selectedRefund.status !== 'Completed') && (
                                    <div className="w-full h-72 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5] flex items-center justify-center text-[#74777f] text-sm italic">
                                        Not applicable yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRefunds;
