import { X, FileBadge, Upload, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Certificate } from '../types/certificate';
import { CertificatesService } from '../services/certificates.service';

interface CertificateModalsProps {
    viewQual: Certificate | null;
    setViewQual: (qual: Certificate | null) => void;
    editQual: Certificate | null;
    setEditQual: (qual: Certificate | null) => void;
    handleEditSave: (e: React.FormEvent) => void; // This will just trigger a reload from parent
    deleteQual: Certificate | null;
    setDeleteQual: (qual: Certificate | null) => void;
    handleDelete: () => void;
}

export const CertificateModals = ({
    viewQual, setViewQual,
    editQual, setEditQual, handleEditSave,
    deleteQual, setDeleteQual, handleDelete
}: CertificateModalsProps) => {
    const [newFile, setNewFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (selectedFile: File): string | null => {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
        const FILENAME_REGEX = /^[a-zA-Z0-9\s._-]+$/;

        if (selectedFile.size > MAX_FILE_SIZE) {
            return "File size exceeds 5MB limit.";
        }
        if (!ALLOWED_TYPES.includes(selectedFile.type)) {
            return "Invalid file format. Only JPG, PNG, and PDF are allowed.";
        }
        if (!FILENAME_REGEX.test(selectedFile.name)) {
            return "Filename contains invalid characters. Please use only letters, numbers, spaces, dashes, and underscores.";
        }
        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
                setNewFile(null);
                if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
                return;
            }
            setNewFile(selectedFile);
            setError('');
        }
    };

    const handleInternalEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editQual) return;

        setLoading(true);
        setError('');
        try {
            let fileUrl = editQual.file;
            if (newFile) {
                fileUrl = await CertificatesService.uploadFile(newFile);
            }

            await CertificatesService.updateCertificate(editQual.id.toString(), {
                name: editQual.name,
                issuer: editQual.issuer,
                issueDate: editQual.issueDate,
                expDate: editQual.expDate === 'No Expiration' ? null : editQual.expDate,
                fileUrl
            });

            // Call parent to refresh list
            handleEditSave(e);
            setNewFile(null); // reset
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                const errorObj = err as { error?: string, message?: string };
                const msg = errorObj?.error ? `${errorObj.message}: ${errorObj.error}` : errorObj?.message;
                setError(msg || 'An error occurred during update.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {viewQual && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
                            <div>
                                <h3 className="font-bold text-[#002045] text-[18px]">{viewQual.name}</h3>
                                  {viewQual.status === 'Rejected' && viewQual.rejection_reason && (
                                      <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                          <p className="text-[12px] font-bold text-rose-700 uppercase tracking-wider mb-1">Rejection Reason</p>
                                          <p className="text-rose-600 text-[13px]">{viewQual.rejection_reason}</p>
                                      </div>
                                  )}
                            </div>
                            <button onClick={() => setViewQual(null)} className="p-2 hover:bg-[#f1f4f6] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#43474e]" />
                            </button>
                        </div>
                        <div className="p-6 bg-[#f8f9fa] flex flex-col items-center justify-center min-h-100 relative">
                            {viewQual.file.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                <img src={viewQual.file} alt="Document" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
                            ) : viewQual.file.match(/\.pdf$/i) ? (
                                <iframe src={`${viewQual.file}#toolbar=0&navpanes=0&view=FitH`} className="w-full h-[60vh] rounded-lg shadow-sm border-0" title="PDF Preview" />
                            ) : (
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto bg-white border-2 border-[#e0e3e5] rounded-xl flex items-center justify-center text-[#74777f] mb-4 shadow-sm">
                                        <FileBadge className="w-12 h-12" />
                                    </div>
                                    <p className="font-bold text-[#43474e]">Document Ready</p>
                                    <a href={viewQual.file} target="_blank" rel="noreferrer" className="text-[#0061a5] hover:underline font-bold text-[13px] mt-2 inline-block">
                                        Click here to view/download
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {editQual && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
                            <h3 className="font-bold text-[#002045] text-[18px]">Edit Certificate</h3>
                            <button onClick={() => setEditQual(null)} className="p-2 hover:bg-[#f1f4f6] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#43474e]" />
                            </button>
                        </div>
                        <form onSubmit={handleInternalEditSave} className="p-6 space-y-5">
                            {error && <p className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-200">{error}</p>}
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
                                <label className="text-[13px] font-bold text-[#43474e]">Issue Date</label>
                                <input 
                                    type="date" 
                                    value={editQual.issueDate} 
                                    onChange={(e) => setEditQual({...editQual, issueDate: e.target.value})}
                                    className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-[14px] text-[#181c1e]" 
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
                                <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                                <div 
                                    onClick={() => !newFile && fileInputRef.current?.click()}
                                    className={`w-full border-2 border-dashed border-[#c4c6cf] rounded-xl flex flex-col items-center justify-center text-center transition-colors group relative overflow-hidden ${
                                        newFile ? 'p-0 border-solid' : 'p-4 cursor-pointer min-h-32 hover:bg-[#f8f9fa]'
                                    } ${newFile && newFile.type === 'application/pdf' ? 'min-h-125 h-125' : newFile && newFile.type.startsWith('image/') ? 'min-h-62.5 h-full' : ''}`}
                                >
                                    {newFile ? (
                                        <>
                                            {newFile.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(newFile)} alt="Preview" className="w-full h-full absolute inset-0 object-contain bg-black/5" />
                                            ) : newFile.type === 'application/pdf' ? (
                                                <iframe src={`${URL.createObjectURL(newFile)}#toolbar=0&navpanes=0&view=FitH`} className="w-full h-full absolute inset-0 border-0 bg-white" title="PDF Preview" />
                                            ) : (
                                                <div className="flex flex-col items-center w-full h-full justify-center absolute inset-0">
                                                    <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] mb-2 group-hover:scale-110 transition-transform">
                                                        <Upload className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-[13px] font-bold text-[#002045] mb-1">New file selected</p>
                                                    <p className="text-[12px] text-[#74777f] truncate max-w-50">{newFile.name}</p>
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNewFile(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                                }}
                                                className="absolute top-3 right-3 p-2 text-[#43474e] bg-white border border-[#e0e3e5] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all shadow-md z-10"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center w-full h-full justify-center">
                                            <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] mb-2 group-hover:scale-110 transition-transform">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <p className="text-[13px] font-bold text-[#002045] mb-1">Click to upload new file</p>
                                            <p className="text-[12px] text-[#74777f]">Current: <span className="font-medium text-[#0061a5] truncate max-w-50 inline-block align-bottom">{editQual.file.split('/').pop() || editQual.file}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#e0e3e5] mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditQual(null)} disabled={loading} className="px-5 py-2 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-bold text-[14px] hover:bg-[#f1f4f6] disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-5 py-2 bg-[#0061a5] text-white rounded-lg font-bold text-[14px] hover:bg-[#004d80] disabled:opacity-50 flex items-center gap-2">
                                    {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                                    {loading ? 'Saving...' : 'Save Changes'}
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
