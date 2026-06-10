import { X } from 'lucide-react';
import type { TutorChangeRequest } from '../types/change-request';

interface ChangeRequestDetailProps {
    request: TutorChangeRequest;
    onClose: () => void;
}

export const ChangeRequestDetail = ({ request, onClose }: ChangeRequestDetailProps) => {
    return (
        <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-fade-in-up">
                <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    <h3 className="text-[18px] font-bold text-[#002045]">
                        Request Details
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-[#e0e3e5] rounded-full transition-colors text-[#74777f]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-1">Class & Session</p>
                            <p className="font-bold text-[#181c1e] text-[16px]">{request.className} - Session {request.session}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold border ${
                            request.status === 'Pending' ? 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]' : 
                            request.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]' : 
                            'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                            {request.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                        <div>
                            <p className="text-[12px] font-bold text-[#74777f] mb-1">Original Time</p>
                            <p className="font-semibold text-[#181c1e] text-[14px]">{request.originalTime}</p>
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-[#74777f] mb-1">
                                {request.type === 'Reschedule' ? 'Proposed Time' : 'Request Type'}
                            </p>
                            <p className={`font-semibold text-[14px] ${request.type === 'Reschedule' ? 'text-[#0061a5]' : 'text-purple-600'}`}>
                                {request.type === 'Reschedule' 
                                    ? (request.proposedTime || 'None provided') 
                                    : 'Needs Substitute Tutor'}
                            </p>
                        </div>
                    </div>

                    {request.status === 'Approved' && request.finalTime && (
                        <div className="p-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl">
                            <p className="text-[12px] font-bold text-[#2e7d32] uppercase tracking-wider mb-1">Final Arranged Schedule</p>
                            <p className="font-bold text-[#1b5e20]">{request.finalTime}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-2">Your Reason</p>
                        <div className="p-4 bg-white border border-[#e0e3e5] rounded-xl text-[#43474e] text-[14px] leading-relaxed font-medium">
                            "{request.reason}"
                        </div>
                    </div>

                    {request.staffNote && (
                        <div>
                            <p className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-2">Staff Feedback</p>
                            <div className="p-4 bg-[#f0f7ff] border border-[#bbdefb] rounded-xl text-[#0061a5] text-[14px] leading-relaxed font-medium">
                                {request.staffNote}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
