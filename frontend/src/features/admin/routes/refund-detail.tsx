
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

const AdminRefundDetail = () => {
    const { id } = useParams();

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/refunds" className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Refund Request: {id || 'REF-1002'}</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6 max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                    <RefreshCcw className="text-[#c9a82c]" size={28} />
                    <div>
                        <h2 className="text-xl font-bold text-[#181c1e]">Amount Requested: 225 đ</h2>
                        <span className="inline-block px-2 py-1 mt-1 bg-[#fff8e1] text-[#c9a82c] text-xs font-bold rounded uppercase">Pending Review</span>
                    </div>
                </div>

                <div className="space-y-4 border-t border-[#e0e3e5] pt-6">
                    <div>
                        <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Student Name</h4>
                        <p className="text-base text-[#181c1e] font-medium">Alex Smith (alex@example.com)</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Original Course</h4>
                        <p className="text-base text-[#181c1e] font-medium">IELTS Intensive Mastery (IEL-INT-01)</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-[#74777f] uppercase mb-1">Reason for Refund</h4>
                        <p className="text-base text-[#43474e] bg-[#f8f9fa] p-4 rounded-xl border border-[#e0e3e5]">
                            I have a scheduling conflict due to a new job and can no longer attend the evening sessions. I have only attended 2 sessions out of 48.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-[#e0e3e5]">
                    <button className="flex-1 bg-[#137333] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0d5022] transition-colors">
                        <CheckCircle2 size={20} /> Approve Refund
                    </button>
                    <button className="flex-1 bg-[#ba1a1a] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#93000a] transition-colors">
                        <XCircle size={20} /> Reject Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminRefundDetail;
