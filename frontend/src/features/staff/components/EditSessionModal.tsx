import { useState, useRef, useEffect } from 'react';
import { X, Users, MapPin, ChevronDown, Save } from 'lucide-react';
import type { ClassSession, RoomOption } from '../types/class-detail';

interface EditSessionModalProps {
    session: ClassSession;
    availableRooms: RoomOption[];
    onClose: () => void;
    onSave: (session: ClassSession) => void;
}

export const EditSessionModal = ({ session, availableRooms, onClose, onSave }: EditSessionModalProps) => {
    const [isEditRoomDropdownOpen, setIsEditRoomDropdownOpen] = useState(false);
    const [selectedEditRoom, setSelectedEditRoom] = useState<RoomOption | null>(null);
    const [selectedTutor, setSelectedTutor] = useState(session.tutor);
    const editRoomDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editRoomDropdownRef.current && !editRoomDropdownRef.current.contains(event.target as Node)) {
                setIsEditRoomDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSave = () => {
        const updatedSession = {
            ...session,
            tutor: selectedTutor,
            room: selectedEditRoom ? selectedEditRoom.name : session.room
        };
        onSave(updatedSession);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002045]/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    <h3 className="text-lg font-bold text-[#002045]">
                        Edit Session #{session.session}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-5">
                    <div>
                        <p className="text-sm font-bold text-[#74777f] mb-1">Topic</p>
                        <p className="font-semibold text-[#002045]">{session.topic}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500"/> Assign Substitute Tutor
                        </label>
                        <select 
                            className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium"
                            value={selectedTutor}
                            onChange={(e) => setSelectedTutor(e.target.value)}
                        >
                            <option value={session.tutor}>{session.tutor} (Current)</option>
                            <option value="Mr. James Bond">Mr. James Bond (Available)</option>
                            <option value="Ms. Emily Blunt">Ms. Emily Blunt (Available)</option>
                        </select>
                    </div>
                    
                    <div className="space-y-2 relative" ref={editRoomDropdownRef}>
                        <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500"/> Change Room
                        </label>
                        <button 
                            type="button"
                            onClick={() => setIsEditRoomDropdownOpen(!isEditRoomDropdownOpen)}
                            className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 flex justify-between items-center text-left"
                        >
                            {selectedEditRoom ? (
                                <span>
                                    {selectedEditRoom.name} (Cap: {selectedEditRoom.cap}) {selectedEditRoom.current && '(Current)'} • <span className="text-[#16a34a] font-medium">Available</span>
                                </span>
                            ) : (
                                <span>
                                    {session.room} (Current) • <span className="text-[#16a34a] font-medium">Available</span>
                                </span>
                            )}
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isEditRoomDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isEditRoomDropdownOpen && (
                            <div className="absolute z-10 bottom-full left-0 right-0 mb-1 bg-white border border-[#c4c6cf] rounded-xl shadow-lg overflow-hidden py-1">
                                {availableRooms.map((room) => (
                                    <button 
                                        key={room.id}
                                        className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors"
                                        onClick={() => { setSelectedEditRoom(room); setIsEditRoomDropdownOpen(false); }}
                                    >
                                        {room.name} (Cap: {room.cap}) {room.current && '(Current)'} • <span className="text-[#16a34a] font-medium">Available</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-[#e0e3e5] bg-[#f8f9fa] flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-5 py-2.5 font-semibold text-white bg-[#0061a5] rounded-xl hover:bg-[#004a80] transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
