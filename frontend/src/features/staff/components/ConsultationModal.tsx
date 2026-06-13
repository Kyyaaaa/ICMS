import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { ConsultationRequest } from '../types/consultation';

interface ConsultationModalProps {
    consultation: ConsultationRequest;
    onClose: () => void;
    onSave: (id: string, status: string, call_notes: string) => void;
}

export const ConsultationModal = ({ consultation, onClose, onSave }: ConsultationModalProps) => {
    const [tempStatus, setTempStatus] = useState(consultation.status);
    const [tempNote, setTempNote] = useState(consultation.call_notes || '');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTempStatus(consultation.status);
        setTempNote(consultation.call_notes || '');
    }, [consultation]);

    return (
        <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-fade-in-up">
                <div className="flex items-center justify-between p-6 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                    <h3 className="text-xl font-bold text-[#002045]">
                        Consultation Details
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Guest Name</p>
                            <p className="font-bold text-[#002045] text-lg">{consultation.guest_name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Submitted Date</p>
                            <p className="font-semibold text-[#43474e]">{new Date(consultation.created_at).toLocaleString('vi-VN')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Phone Number</p>
                            <p className="font-semibold text-[#002045]">{consultation.guest_phone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Email Address</p>
                            <p className="font-semibold text-[#002045]">{consultation.guest_email || 'No email provided'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-2">Inquiry Details</p>
                            <div className="p-4 bg-[#f0f7ff] rounded-xl text-[#002045] leading-relaxed border border-blue-100 font-medium whitespace-pre-wrap">
                                "{consultation.inquiry_details}"
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#181c1e] mb-2">Staff Internal Note</p>
                            <textarea 
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium resize-none"
                                placeholder="Add notes about your contact with this student..."
                                value={tempNote}
                                onChange={(e) => setTempNote(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-gray-500">Update Status:</p>
                        <select 
                            className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] font-semibold text-[#002045]"
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value as any)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2.5 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => onSave(consultation.id, tempStatus, tempNote)}
                            className="px-6 py-2.5 font-semibold text-white bg-[#0061a5] rounded-xl hover:bg-[#004a80] transition-colors flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
