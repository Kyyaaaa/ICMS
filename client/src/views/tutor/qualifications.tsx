import { FileBadge, Upload, CheckCircle2, Clock, Eye, Trash2, Edit2, Plus, AlertCircle, X, Download } from 'lucide-react';
import { useState } from 'react';

interface Qualification {
    id: number;
    name: string;
    issuer: string;
    expDate: string;
    status: string;
    file: string;
}

const TutorQualifications = () => {
    const [isUploading, setIsUploading] = useState(false);

    // Stateful mock data
    const [qualifications, setQualifications] = useState<Qualification[]>([
        { id: 1, name: "IELTS Academic 8.0", issuer: "British Council", expDate: "2026-08-15", status: "Verified", file: "ielts_certificate.jpg" },
        { id: 2, name: "TESOL Certification", issuer: "Global TEFL", expDate: "No Expiration", status: "Verified", file: "tesol_cert.png" },
        { id: 3, name: "Master of Education (M.Ed)", issuer: "University of Oxford", expDate: "No Expiration", status: "Verified", file: "med_degree.pdf" },
        { id: 4, name: "TKT Module 1-3", issuer: "Cambridge Assessment", expDate: "2029-01-20", status: "Pending Verification", file: "tkt_cert.jpg" },
    ]);

    // Modal States
    const [viewQual, setViewQual] = useState<Qualification | null>(null);
    const [editQual, setEditQual] = useState<Qualification | null>(null);
    const [deleteQual, setDeleteQual] = useState<Qualification | null>(null);

    // Handlers
    const handleDelete = () => {
        if (deleteQual) {
            setQualifications(qualifications.filter(q => q.id !== deleteQual.id));
            setDeleteQual(null);
        }
    };

    const handleEditSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editQual) {
            setQualifications(qualifications.map(q => q.id === editQual.id ? editQual : q));
            setEditQual(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Qualifications</h1>
                    <p className="text-[#43474e] text-[14px]">Upload and manage your certificates and diplomas.</p>
                </div>
                <button 
                    onClick={() => setIsUploading(!isUploading)}
                    className="px-6 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-[14px] hover:bg-[#004d80] transition-colors flex items-center gap-2"
                >
                    {isUploading ? 'Cancel' : <><Plus className="w-5 h-5" /> Add New</>}
                </button>
            </div>

            {/* Upload Area */}
            {isUploading && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 animate-scale-in origin-top">
                    <h2 className="text-[18px] font-bold text-[#002045] mb-6 border-b border-[#e0e3e5] pb-4">Upload New Qualification</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e]">Certificate Name</label>
                                <input type="text" placeholder="e.g. IELTS Academic 8.0" className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none text-[14px]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e]">Issuer / Institution</label>
                                <input type="text" placeholder="e.g. British Council" className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none text-[14px]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e]">Expiration Date (if applicable)</label>
                                <input type="date" className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none text-[14px] text-[#181c1e]" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#43474e]">Upload Certificate Image / PDF</label>
                            <div className="w-full h-full min-h-[160px] border-2 border-dashed border-[#c4c6cf] rounded-xl flex flex-col items-center justify-center p-6 text-center hover:bg-[#f8f9fa] transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="text-[14px] font-bold text-[#002045] mb-1">Click to upload or drag and drop</p>
                                <p className="text-[12px] text-[#74777f]">JPG, PNG, or PDF (Max. 5MB)</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-6 mt-6 border-t border-[#e0e3e5] gap-3">
                        <button onClick={() => setIsUploading(false)} className="px-6 py-2.5 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-bold text-[14px] hover:bg-[#f1f4f6] transition-colors">
                            Cancel
                        </button>
                        <button onClick={() => setIsUploading(false)} className="px-6 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-[14px] hover:bg-[#004d80] transition-colors">
                            Submit for Verification
                        </button>
                    </div>
                </div>
            )}

            {/* Qualifications List - Redesigned Layout */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-[#f8f9fa] border-b border-[#e0e3e5] text-[13px] font-bold text-[#43474e] uppercase tracking-wider">
                    <div className="col-span-4">Certificate</div>
                    <div className="col-span-3">Issuer</div>
                    <div className="col-span-2">Expiration</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y divide-[#e0e3e5]">
                    {qualifications.map((qual) => (
                        <div key={qual.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:items-center hover:bg-[#f1f4f6] transition-colors group">
                            {/* Certificate Info */}
                            <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${qual.status === 'Verified' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-amber-50 text-amber-600'}`}>
                                    <FileBadge className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-[#002045] text-[14px] leading-tight truncate">{qual.name}</h3>
                                    <p className="text-[#74777f] text-[12px] truncate mt-0.5">{qual.file}</p>
                                </div>
                            </div>
                            
                            {/* Issuer */}
                            <div className="col-span-1 md:col-span-3 text-[14px] text-[#43474e]">
                                <span className="md:hidden font-bold mr-2 text-[12px] uppercase">Issuer:</span>
                                {qual.issuer}
                            </div>

                            {/* Expiration */}
                            <div className="col-span-1 md:col-span-2">
                                <span className="md:hidden font-bold mr-2 text-[12px] uppercase">Expires:</span>
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#f1f4f6] text-[#43474e] text-[12px] font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    {qual.expDate}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-1 md:col-span-2">
                                <span className="md:hidden font-bold mr-2 text-[12px] uppercase">Status:</span>
                                <div className={`inline-flex items-center gap-1.5 text-[12px] font-bold ${qual.status === 'Verified' ? 'text-emerald-700' : 'text-amber-600'}`}>
                                    {qual.status === 'Verified' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {qual.status}
                                </div>
                            </div>

                            {/* Actions (RUD) */}
                            <div className="col-span-1 md:col-span-1 flex items-center md:justify-end gap-1 pt-3 md:pt-0 border-t md:border-0 border-[#e0e3e5] mt-2 md:mt-0">
                                <button onClick={() => setViewQual(qual)} className="p-2 text-[#74777f] hover:bg-[#e6f0fa] hover:text-[#0061a5] rounded-lg transition-colors" title="View Image/Document">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditQual(qual)} className="p-2 text-[#74777f] hover:bg-[#e6f0fa] hover:text-[#0061a5] rounded-lg transition-colors" title="Edit">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteQual(qual)} className="p-2 text-[#74777f] hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALS */}

            {/* 1. View Modal */}
            {viewQual && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
                            <div>
                                <h3 className="font-bold text-[#002045] text-[18px]">{viewQual.name}</h3>
                                <p className="text-[#74777f] text-[13px]">{viewQual.file}</p>
                            </div>
                            <button onClick={() => setViewQual(null)} className="p-2 hover:bg-[#f1f4f6] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#43474e]" />
                            </button>
                        </div>
                        <div className="p-6 bg-[#f8f9fa] flex items-center justify-center min-h-[400px]">
                            {/* Placeholder for actual image/PDF viewer */}
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto bg-white border-2 border-[#e0e3e5] rounded-xl flex items-center justify-center text-[#74777f] mb-4 shadow-sm">
                                    <FileBadge className="w-12 h-12" />
                                </div>
                                <p className="font-bold text-[#43474e]">Document Preview</p>
                                <p className="text-[13px] text-[#74777f] mt-1">This is where the image or PDF would be displayed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Edit Modal */}
            {editQual && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
                            <h3 className="font-bold text-[#002045] text-[18px]">Edit Qualification</h3>
                            <button onClick={() => setEditQual(null)} className="p-2 hover:bg-[#f1f4f6] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#43474e]" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSave} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e]">Certificate Name</label>
                                <input 
                                    type="text" 
                                    value={editQual.name} 
                                    onChange={(e) => setEditQual({...editQual, name: e.target.value})}
                                    className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-[14px]" 
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e]">Issuer / Institution</label>
                                <input 
                                    type="text" 
                                    value={editQual.issuer} 
                                    onChange={(e) => setEditQual({...editQual, issuer: e.target.value})}
                                    className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-[14px]" 
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e]">Expiration Date (if applicable)</label>
                                <input 
                                    type="date" 
                                    value={editQual.expDate === 'No Expiration' ? '' : editQual.expDate} 
                                    onChange={(e) => setEditQual({...editQual, expDate: e.target.value || 'No Expiration'})}
                                    className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-[14px] text-[#181c1e]" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#43474e]">Replace Certificate Image / PDF</label>
                                <div className="w-full h-32 border-2 border-dashed border-[#c4c6cf] rounded-xl flex flex-col items-center justify-center p-4 text-center hover:bg-[#f8f9fa] transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] mb-2 group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-[13px] font-bold text-[#002045] mb-1">Click to upload new file</p>
                                    <p className="text-[12px] text-[#74777f]">Current: <span className="font-medium text-[#0061a5]">{editQual.file}</span></p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#e0e3e5] mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditQual(null)} className="px-5 py-2 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-bold text-[14px] hover:bg-[#f1f4f6]">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2 bg-[#0061a5] text-white rounded-lg font-bold text-[14px] hover:bg-[#004d80]">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Delete Modal */}
            {deleteQual && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in p-6 text-center">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-[#002045] text-[20px] mb-2">Delete Certificate?</h3>
                        <p className="text-[#43474e] text-[14px] mb-6">
                            Are you sure you want to delete <span className="font-bold">"{deleteQual.name}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteQual(null)} className="flex-1 py-2.5 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-bold text-[14px] hover:bg-[#f1f4f6]">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 bg-rose-600 text-white rounded-lg font-bold text-[14px] hover:bg-rose-700">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorQualifications;
