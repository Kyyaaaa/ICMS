import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCcw, Banknote, CreditCard, User, Landmark, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { AdminRefundsService } from '../services/refunds.service';
import axiosClient from '@/shared/services/axiosClient';
import type { RefundRequest } from '../types/refund';
import { showAlertModal } from '@/utils/modal';
import { formatDate } from '../../../shared/utils/date';

const AdminRefundDetail = () => {
    const { id } = useParams();
    const [refund, setRefund] = useState<RefundRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchRefund = async () => {
            try {
                if (id) {
                    const data = await AdminRefundsService.getRefundById(id);
                    setRefund(data);
                    if (data?.notes) setNotes(data.notes);
                }
            } catch (error: unknown) {
                showAlertModal("Error", "Failed to fetch refund details: " + ((error as Error)?.message || "Unknown error"), "error");
            } finally {
                setLoading(false);
            }
        };
        fetchRefund();
    }, [id]);

    const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED' | 'COMPLETED') => {
        if (!refund?.dbId) return;
        
        let uploadedUrl = undefined;
        
        if (status === 'COMPLETED') {
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
            const success = await AdminRefundsService.updateStatus(refund.dbId, status, notes, uploadedUrl);
            if (success) {
                setRefund(prev => prev ? { ...prev, status: status === 'APPROVED' ? 'Approved' : status === 'COMPLETED' ? 'Completed' : 'Rejected', proofImageUrl: uploadedUrl || prev.proofImageUrl } : null);
                if (status === 'COMPLETED') {
                    setProofFile(null);
                    setProofPreview(null);
                }
            }
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

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!refund) return <div className="p-8 text-center text-red-500">Refund request not found</div>;

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/refunds" className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Refund Request: {refund.id}</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 max-w-3xl">
                <div className="flex items-center gap-3 mb-6 border-b border-[#e0e3e5] pb-6">
                    <RefreshCcw className="text-[#c9a82c]" size={28} />
                    <div>
                        <h2 className="text-xl font-bold text-[#181c1e]">Amount Requested: {refund.refundAmount?.toLocaleString('en-US')} VND</h2>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {isOverdue(refund) && (
                                <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffebed] px-2 py-1 rounded flex items-center gap-1">
                                    <AlertCircle size={14} /> Overdue SLA
                                </span>
                            )}
                            <span className={`inline-block px-2 py-1 text-xs font-bold rounded uppercase ${
                                refund.status === 'Completed' ? 'bg-[#e6f4ea] text-[#137333]' :
                                refund.status === 'Approved' ? 'bg-[#e6f0fa] text-[#0061a5]' :
                                refund.status === 'Rejected' ? 'bg-[#fceeee] text-[#ba1a1a]' :
                                'bg-[#fff8e1] text-[#c9a82c]'
                            }`}>
                                {refund.status === 'Pending' ? 'Pending Approval' : refund.status === 'Approved' ? 'Pending Refund' : refund.status}
                            </span>
                            
                            {refund.status === 'Pending' && (
                                <span className="text-xs text-[#74777f] font-medium bg-[#f8f9fa] px-2 py-1 rounded border border-[#e0e3e5]">
                                    Deadline to Approve: {formatDate(new Date(new Date(refund.requestedDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString())}
                                </span>
                            )}
                            {refund.status === 'Approved' && refund.approvedDate && (
                                <span className="text-xs text-[#74777f] font-medium bg-[#f8f9fa] px-2 py-1 rounded border border-[#e0e3e5]">
                                    Deadline to Transfer: {formatDate(new Date(new Date(refund.approvedDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString())}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#e0e3e5] pb-6 mb-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-[#181c1e] mb-2 border-b pb-2">Student Information</h3>
                        <div>
                            <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Student Name</h4>
                            <p className="text-base text-[#181c1e] font-medium">{refund.studentName} ({refund.studentEmail})</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Original Course</h4>
                            <p className="text-base text-[#181c1e] font-medium">{refund.courseName}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Requested Date</h4>
                            <p className="text-base text-[#181c1e] font-medium">{formatDate(refund.requestedDate)}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5]">
                        <h3 className="font-bold text-[#181c1e] mb-2 border-b pb-2 flex items-center gap-2"><Landmark size={18}/> Bank Details</h3>
                        <div>
                            <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Bank Name</h4>
                            <p className="text-base text-[#181c1e] font-medium flex items-center gap-2"><Banknote size={16} className="text-[#43474e]"/> {refund.bankName}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Account Number</h4>
                            <p className="text-base text-[#181c1e] font-medium flex items-center gap-2"><CreditCard size={16} className="text-[#43474e]"/> {refund.bankAccountNumber}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Account Name</h4>
                            <p className="text-base text-[#181c1e] font-medium flex items-center gap-2"><User size={16} className="text-[#43474e]"/> {refund.bankAccountName}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-b border-[#e0e3e5] pb-6 mb-6">
                    <h3 className="font-bold text-[#181c1e] mb-2 border-b pb-2">Reason for Refund</h3>
                    <p className="text-base text-[#43474e] bg-[#f8f9fa] p-4 rounded-xl border border-[#e0e3e5]">
                        {refund.reason || 'No reason provided'}
                    </p>
                </div>

                <div className="space-y-4 mb-6">
                    <label className="font-bold text-[#181c1e] block">Admin Notes</label>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={refund.status === 'Completed' || refund.status === 'Rejected'}
                        className="w-full px-4 py-3 bg-white border border-[#c4c6cf] rounded-lg text-base focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 resize-none disabled:bg-[#f7fafc]"
                        rows={3}
                        placeholder="Add notes before approving or rejecting..."
                    ></textarea>
                </div>

                {refund.status === 'Pending' && (
                    <div className="flex gap-4 pt-4 border-t border-[#e0e3e5]">
                        <button 
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus('APPROVED')}
                            className="flex-1 bg-[#0061a5] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#004a7e] transition-colors disabled:opacity-50"
                        >
                            <CheckCircle2 size={20} /> Approve Request
                        </button>
                        <button 
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus('REJECTED')}
                            className="flex-1 bg-[#ba1a1a] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#93000a] transition-colors disabled:opacity-50"
                        >
                            <XCircle size={20} /> Reject Request
                        </button>
                    </div>
                )}

                {refund.status === 'Approved' && (
                    <div className="space-y-4 pt-4 border-t border-[#e0e3e5]">
                        <div>
                            <label className="font-bold text-[#181c1e] block mb-2">Transaction Proof (Required)</label>
                            <div className="flex items-start gap-4">
                                <label className="cursor-pointer bg-[#f8f9fa] border-2 border-dashed border-[#c4c6cf] rounded-xl p-4 flex flex-col items-center justify-center flex-1 hover:bg-[#f0f2f4] transition-colors min-h-40">
                                    <Upload size={24} className="text-[#43474e] mb-2" />
                                    <span className="text-sm font-medium text-[#43474e]">Click to upload receipt image</span>
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
                                {proofPreview && (
                                    <a href={proofPreview} target="_blank" rel="noopener noreferrer" className="flex-1 h-40 rounded-xl border border-[#e0e3e5] overflow-hidden relative hover:opacity-90 transition-opacity block bg-black/5">
                                        <img src={proofPreview} alt="Preview" className="w-full h-full object-contain" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <button 
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus('COMPLETED')}
                            className="w-full bg-[#137333] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0d5022] transition-colors disabled:opacity-50"
                        >
                            <CheckCircle2 size={20} /> Mark as Completed (Money Transferred)
                        </button>
                    </div>
                )}
                
                {refund.status === 'Completed' && refund.proofImageUrl && (
                    <div className="space-y-4 pt-4 border-t border-[#e0e3e5]">
                        <h3 className="font-bold text-[#181c1e] flex items-center gap-2"><ImageIcon size={20}/> Transaction Proof</h3>
                        <a href={refund.proofImageUrl} target="_blank" rel="noopener noreferrer" className="block max-w-50 rounded-xl border border-[#e0e3e5] overflow-hidden hover:opacity-90 transition-opacity">
                            <img src={refund.proofImageUrl} alt="Transaction Proof" className="w-full h-auto" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRefundDetail;
