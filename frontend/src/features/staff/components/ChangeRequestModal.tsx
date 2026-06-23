import { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import type { ChangeRequest } from '../types/change-request';

interface ChangeRequestModalProps {
    request: ChangeRequest;
    onClose: () => void;
    onUpdateStatus: (id: number, status: string, finalTime?: string, staffNote?: string) => void;
}

export const ChangeRequestModal = ({ request, onClose, onUpdateStatus }: ChangeRequestModalProps) => {
    const [selectedNewDate, setSelectedNewDate] = useState('');
    const [selectedNewTime, setSelectedNewTime] = useState('');
    const [selectedNewRoom, setSelectedNewRoom] = useState('');
    const [staffNote, setStaffNote] = useState(request.staffNote || '');

    const handleApprove = () => {
        let finalArranged = '';
        if (request.type === 'Reschedule') {
            finalArranged = `${selectedNewDate} (${selectedNewTime}) • ${selectedNewRoom}`;
        }
        onUpdateStatus(request.id, 'Approved', finalArranged || request.finalTime, staffNote);
    };

    const handleReject = () => {
        onUpdateStatus(request.id, 'Rejected', request.finalTime, staffNote);
    };

    return (
        <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-fade-in-up">
                <div className="flex items-center justify-between p-6 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                    <h3 className="text-xl font-bold text-[#002045]">
                        Request Details
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
                            <p className="text-sm font-semibold text-gray-500 mb-1">Tutor</p>
                            <p className="font-bold text-[#002045] text-lg">{request.tutor}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Class & Session</p>
                            <p className="font-semibold text-[#43474e]">{request.className} - Session {request.session}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Original Schedule</p>
                            <p className="font-semibold text-[#e11d48]">{request.originalTime}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">
                                {request.type === 'Reschedule' ? 'Proposed by Tutor' : 'Requested Action'}
                            </p>
                            <p className={`font-semibold ${request.type === 'Reschedule' ? 'text-[#16a34a]' : 'text-[#7c3aed]'}`}>
                                {request.type === 'Reschedule' 
                                    ? (request.proposedTime || 'TBD (None provided)') 
                                    : 'Needs Substitute Tutor'}
                            </p>
                        </div>
                    </div>

                    {request.type === 'Reschedule' && request.status === 'Pending' && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
                            <p className="text-sm font-bold text-[#002045]">Assign Final Reschedule</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Select Date <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium"
                                        value={selectedNewDate}
                                        onChange={(e) => {
                                            setSelectedNewDate(e.target.value);
                                            setSelectedNewTime('');
                                            setSelectedNewRoom('');
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Time Slot <span className="text-red-500">*</span></label>
                                    <select 
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                        value={selectedNewTime}
                                        onChange={(e) => {
                                            setSelectedNewTime(e.target.value);
                                            setSelectedNewRoom('');
                                        }}
                                        disabled={!selectedNewDate}
                                    >
                                        <option value="">-- Select Time --</option>
                                        <option value="08:00 - 10:00">08:00 - 10:00</option>
                                        <option value="13:00 - 15:00">13:00 - 15:00</option>
                                        <option value="18:00 - 20:00">18:00 - 20:00</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Room <span className="text-red-500">*</span></label>
                                    <select 
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                        value={selectedNewRoom}
                                        onChange={(e) => setSelectedNewRoom(e.target.value)}
                                        disabled={!selectedNewTime}
                                    >
                                        <option value="">-- Select Room --</option>
                                        <option value="Room 102">Room 102 (Cap: 30)</option>
                                        <option value="Room 205">Room 205 (Cap: 25)</option>
                                        <option value="Lab 1">Lab 1 (Cap: 20)</option>
                                    </select>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">You must check available time slots and rooms on the selected date before approving.</p>
                        </div>
                    )}

                    {request.type === 'Reschedule' && request.status !== 'Pending' && request.finalTime && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-sm font-semibold text-green-700 mb-1">Final Arranged Schedule</p>
                            <p className="font-bold text-green-800">{request.finalTime}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-2">Tutor's Reason</p>
                        <div className="p-4 bg-[#f0f7ff] rounded-xl text-[#002045] leading-relaxed border border-blue-100 font-medium">
                            "{request.reason}"
                        </div>
                    </div>

                    {request.status === 'Pending' ? (
                        <div>
                            <p className="text-sm font-semibold text-[#181c1e] mb-2">Staff Feedback / Note</p>
                            <textarea 
                                rows={2}
                                className="w-full px-4 py-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium resize-none"
                                placeholder="Add a message for the tutor (e.g. why it was rejected, or special instructions)..."
                                value={staffNote}
                                onChange={(e) => setStaffNote(e.target.value)}
                            ></textarea>
                        </div>
                    ) : request.staffNote && (
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-2">Staff Feedback</p>
                            <div className="p-4 bg-gray-50 rounded-xl text-[#43474e] leading-relaxed border border-[#c4c6cf] font-medium">
                                {request.staffNote}
                            </div>
                        </div>
                    )}
                </div>

                {request.status === 'Pending' ? (
                    <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] flex justify-end gap-3 shrink-0">
                        <button 
                            onClick={handleReject}
                            className="px-6 py-2.5 font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <XCircle className="w-5 h-5" /> Reject
                        </button>
                        <button 
                            onClick={handleApprove}
                            disabled={request.type === 'Reschedule' && (!selectedNewDate || !selectedNewTime || !selectedNewRoom)}
                            className="px-6 py-2.5 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-5 h-5" /> Approve
                        </button>
                    </div>
                ) : (
                    <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] flex justify-end shrink-0">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2.5 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
