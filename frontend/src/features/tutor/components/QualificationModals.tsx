import { X, FileBadge, Upload, Trash2 } from 'lucide-react';
import type { Qualification } from '../types/qualification';

interface QualificationModalsProps {
    viewQual: Qualification | null;
    setViewQual: (qual: Qualification | null) => void;
    editQual: Qualification | null;
    setEditQual: (qual: Qualification | null) => void;
    handleEditSave: (e: React.FormEvent) => void;
    deleteQual: Qualification | null;
    setDeleteQual: (qual: Qualification | null) => void;
    handleDelete: () => void;
}

export const QualificationModals = ({
    viewQual, setViewQual,
    editQual, setEditQual, handleEditSave,
    deleteQual, setDeleteQual, handleDelete
}: QualificationModalsProps) => {
    return (
        <>
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
        </>
    );
};
