import { X } from 'lucide-react';
import type { ScheduleSession } from '../types/schedule';

interface EditScheduleModalProps {
    session: ScheduleSession;
    onClose: () => void;
    onSave: (updatedSession: ScheduleSession) => void;
}

export const EditScheduleModal = ({ session, onClose, onSave }: EditScheduleModalProps) => {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-300 max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                <div className={`p-6 ${session.color} border-b flex justify-between items-center`}>
                    <h2 className="text-xl font-bold text-[#002045]">Class Schedule: {session.class}</h2>
                    <button onClick={onClose} className="text-[#002045] hover:bg-black/10 p-1.5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[#74777f] text-xs font-bold mb-1">Tutor</label>
                        <select className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all">
                            <option>{session.tutor}</option>
                            <option>Mr. John Doe</option>
                            <option>Ms. Emily Chen</option>
                            <option>Mr. Alan Wake</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#74777f] text-xs font-bold mb-1">Date</label>
                        <input type="date" className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all" defaultValue="2026-10-26" />
                    </div>
                    <div>
                        <label className="block text-[#74777f] text-xs font-bold mb-1">Available Rooms</label>
                        <select className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all" defaultValue={session.room}>
                            <option value="Room 202">Room 202</option>
                            <option value="Room 205">Room 205</option>
                            <option value="Room 301">Room 301</option>
                            <option value="Room 402">Room 402</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#74777f] text-xs font-bold mb-1">Available Time Slots</label>
                        <select className="w-full border border-[#c4c6cf] rounded-lg p-2.5 font-semibold text-[#181c1e] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none transition-all" defaultValue={`${session.startTime} - ${session.endTime}`}>
                            <option value="08:00 - 10:00">08:00 - 10:00 (Available)</option>
                            <option value="10:30 - 12:30">10:30 - 12:30 (Available)</option>
                            <option value="14:00 - 16:00">14:00 - 16:00 (Available)</option>
                            <option value="18:00 - 20:00" disabled className="text-gray-400">18:00 - 20:00 (Booked)</option>
                        </select>
                    </div>
                </div>
                <div className="p-5 bg-gray-50 border-t border-[#e0e3e5] flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-[#43474e] font-bold hover:bg-[#e0e3e5] rounded-xl transition-colors">Cancel</button>
                    <button onClick={() => onSave(session)} className="px-5 py-2.5 bg-[#0061a5] text-white font-bold rounded-xl hover:bg-[#004d80] transition-colors shadow-sm">Save Changes</button>
                </div>
            </div>
        </div>
    );
};
