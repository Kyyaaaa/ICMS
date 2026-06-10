import { useState } from 'react';
import { X, FileEdit, Calendar, Users, Send } from 'lucide-react';
import type { CreateChangeRequestData } from '../types/change-request';

interface CreateChangeRequestFormProps {
    onClose: () => void;
    onSubmit: (data: CreateChangeRequestData) => void;
}

export const CreateChangeRequestForm = ({ onClose, onSubmit }: CreateChangeRequestFormProps) => {
    const [newType, setNewType] = useState('Reschedule');
    const [newClassSession, setNewClassSession] = useState('');
    const [newProposedDate, setNewProposedDate] = useState('');
    const [newProposedTimeSlot, setNewProposedTimeSlot] = useState('');
    const [newProposedRoom, setNewProposedRoom] = useState('');
    const [newReason, setNewReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const proposedString = newType === 'Reschedule' && newProposedDate 
            ? `${newProposedDate.split('-').reverse().join('-')} (${newProposedTimeSlot || 'Any Time'}) • ${newProposedRoom || 'Any Room'}` 
            : null;

        const data: CreateChangeRequestData = {
            className: newClassSession.split(' - ')[0] || 'Unknown Class',
            session: parseInt(newClassSession.split('Session ')[1] || '1'),
            type: newType,
            proposedTime: proposedString,
            reason: newReason
        };
        
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden animate-fade-in-up max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                    <h3 className="text-[18px] font-bold text-[#002045] flex items-center gap-2">
                        <FileEdit className="w-5 h-5 text-[#0061a5]" />
                        New Change Request
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-[#e0e3e5] rounded-full transition-colors text-[#74777f]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[13px] font-bold text-[#002045] mb-2">Request Type <span className="text-rose-500">*</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setNewType('Reschedule')}
                                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${newType === 'Reschedule' ? 'bg-[#e6f0fa] border-[#0061a5] text-[#0061a5]' : 'bg-white border-[#c4c6cf] text-[#43474e] hover:border-[#0061a5]'}`}
                                    >
                                        <Calendar className="w-4 h-4" /> Reschedule
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setNewType('Substitute')}
                                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${newType === 'Substitute' ? 'bg-[#f3e8ff] border-[#9333ea] text-[#9333ea]' : 'bg-white border-[#c4c6cf] text-[#43474e] hover:border-[#9333ea]'}`}
                                    >
                                        <Users className="w-4 h-4" /> Substitute
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-[#002045] mb-2">Class & Session <span className="text-rose-500">*</span></label>
                                <select 
                                    required
                                    value={newClassSession}
                                    onChange={(e) => setNewClassSession(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-[14px] h-[46px]"
                                >
                                    <option value="">Select class & session...</option>
                                    <option value="IELTS-A01 - Session 6">IELTS-A01 - Session 6 (Next Monday)</option>
                                    <option value="TOEIC-B01 - Session 3">TOEIC-B01 - Session 3 (Next Tuesday)</option>
                                </select>
                            </div>
                        </div>

                    {newType === 'Reschedule' && (
                        <div className="p-4 bg-[#f0f7ff] border border-[#bbdefb] rounded-xl space-y-4">
                            <p className="text-[13px] font-bold text-[#002045]">Proposed New Schedule (Optional)</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[12px] font-bold text-[#43474e] mb-1">Select Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-[13px] font-medium"
                                        value={newProposedDate}
                                        onChange={(e) => {
                                            setNewProposedDate(e.target.value);
                                            setNewProposedTimeSlot('');
                                            setNewProposedRoom('');
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-[#43474e] mb-1">Time Slot</label>
                                    <select 
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-[13px] font-medium disabled:bg-[#f1f4f6] disabled:text-[#74777f]"
                                        value={newProposedTimeSlot}
                                        onChange={(e) => {
                                            setNewProposedTimeSlot(e.target.value);
                                            setNewProposedRoom('');
                                        }}
                                        disabled={!newProposedDate}
                                    >
                                        <option value="">-- Any Time --</option>
                                        <option value="08:00 - 10:00">08:00 - 10:00</option>
                                        <option value="13:00 - 15:00">13:00 - 15:00</option>
                                        <option value="18:00 - 20:00">18:00 - 20:00</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-[#43474e] mb-1">Room</label>
                                    <select 
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-[13px] font-medium disabled:bg-[#f1f4f6] disabled:text-[#74777f]"
                                        value={newProposedRoom}
                                        onChange={(e) => setNewProposedRoom(e.target.value)}
                                        disabled={!newProposedTimeSlot}
                                    >
                                        <option value="">-- Any Room --</option>
                                        <option value="Room 102">Room 102 (Cap: 30)</option>
                                        <option value="Room 205">Room 205 (Cap: 25)</option>
                                        <option value="Lab 1">Lab 1 (Cap: 20)</option>
                                    </select>
                                </div>
                            </div>
                            <p className="text-[12px] text-[#74777f]">Leave blank if you want staff to arrange a time for you.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-[13px] font-bold text-[#002045] mb-2">Reason <span className="text-rose-500">*</span></label>
                        <textarea 
                            required
                            rows={3} 
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            placeholder="Please provide a detailed reason..." 
                            className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] resize-none text-[14px]"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0061a5] hover:bg-[#004a80] transition-colors shadow-sm flex items-center gap-2">
                            <Send className="w-4 h-4" /> Submit
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
