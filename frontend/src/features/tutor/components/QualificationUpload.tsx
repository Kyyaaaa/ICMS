import { Upload } from 'lucide-react';

interface QualificationUploadProps {
    onCancel: () => void;
    onSubmit: () => void;
}

export const QualificationUpload = ({ onCancel, onSubmit }: QualificationUploadProps) => {
    return (
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
                <button onClick={onCancel} className="px-6 py-2.5 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-bold text-[14px] hover:bg-[#f1f4f6] transition-colors">
                    Cancel
                </button>
                <button onClick={onSubmit} className="px-6 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-[14px] hover:bg-[#004d80] transition-colors">
                    Submit for Verification
                </button>
            </div>
        </div>
    );
};
