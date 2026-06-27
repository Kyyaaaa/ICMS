import { FileBadge, Clock, CheckCircle2, AlertCircle, Eye, Edit2, Trash2, XCircle } from 'lucide-react';
import type { Certificate } from '../types/certificate';

interface CertificateListProps {
    Certificates: Certificate[];
    onView: (qual: Certificate) => void;
    onEdit: (qual: Certificate) => void;
    onDelete: (qual: Certificate) => void;
}

import { formatDate } from '../../../shared/utils/date';

export const CertificateList = ({ Certificates, onView, onEdit, onDelete }: CertificateListProps) => {

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-[#f8f9fa] border-b border-[#e0e3e5] text-xs font-bold text-[#43474e] uppercase tracking-wider">
                <div className="col-span-3">Certificate</div>
                <div className="col-span-2">Issuer</div>
                <div className="col-span-2">Issue Date</div>
                <div className="col-span-2">Expiration</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="divide-y divide-[#e0e3e5]">
                {Certificates.map((qual) => (
                    <div key={qual.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:items-center hover:bg-[#f1f4f6] transition-colors group">
                        <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${qual.status === 'Verified' ? 'bg-[#e6f0fa] text-[#0061a5]' : qual.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                <FileBadge className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-[#002045] text-sm leading-tight truncate">{qual.name}</h3>
                            </div>
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 text-sm text-[#43474e]">
                            <span className="md:hidden font-bold mr-2 text-xs uppercase">Issuer:</span>
                            {qual.issuer}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <span className="md:hidden font-bold mr-2 text-xs uppercase">Issued:</span>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#f1f4f6] text-[#43474e] text-xs font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDate(qual.issueDate)}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <span className="md:hidden font-bold mr-2 text-xs uppercase">Expires:</span>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#f1f4f6] text-[#43474e] text-xs font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                {qual.expDate === 'No Expiration' ? 'No Expiration' : formatDate(qual.expDate)}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <span className="md:hidden font-bold mr-2 text-xs uppercase">Status:</span>
                            <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${qual.status === 'Verified' ? 'text-emerald-700' : qual.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600'}`}>
                                {qual.status === 'Verified' ? <CheckCircle2 className="w-4 h-4" /> : qual.status === 'Rejected' ? <XCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {qual.status}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-1 flex items-center md:justify-end gap-1 pt-3 md:pt-0 border-t md:border-0 border-[#e0e3e5] mt-2 md:mt-0">
                            <button onClick={() => onView(qual)} className="p-2 text-[#74777f] hover:bg-[#e6f0fa] hover:text-[#0061a5] rounded-lg transition-colors" title="View Image/Document">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => onEdit(qual)} className="p-2 text-[#74777f] hover:bg-[#e6f0fa] hover:text-[#0061a5] rounded-lg transition-colors" title="Edit">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDelete(qual)} className="p-2 text-[#74777f] hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
