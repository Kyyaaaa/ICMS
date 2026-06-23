import { useState, useRef, useEffect } from 'react';
import { X, Users, MapPin, ChevronDown, Save, Calendar, Clock } from 'lucide-react';
import type { Session } from '../types/class';
import type { Classroom } from '@/shared/services/classrooms.service';
import { ClassesService } from '../services/classes.service';

interface EditSessionModalProps {
    session: Session;
    availableRooms: Classroom[];
    availableTutors: { id: string; full_name: string }[];
    onClose: () => void;
    onSave: (session: Partial<Session>) => void;
}

export const EditSessionModal = ({ session, availableRooms, availableTutors, onClose, onSave }: EditSessionModalProps) => {
    const [isEditRoomDropdownOpen, setIsEditRoomDropdownOpen] = useState(false);
    const [selectedEditRoom, setSelectedEditRoom] = useState<Classroom | null>(null);
    const [selectedTutor, setSelectedTutor] = useState(session.tutor_id || '');
    const [date, setDate] = useState(session.date);
    const [slot, setSlot] = useState(session.slot);
    const editRoomDropdownRef = useRef<HTMLDivElement>(null);

    const [occupiedTutorIds, setOccupiedTutorIds] = useState<string[]>([]);
    const [occupiedRoomIds, setOccupiedRoomIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchOccupied = async () => {
            if (date && slot) {
                const sessions = await ClassesService.getOccupiedSessions({
                    date,
                    slot,
                    exclude_class_id: session.class_id
                });
                const tIds = sessions.map(s => s.tutor_id).filter(Boolean) as string[];
                const rIds = sessions.map(s => s.classroom_id).filter(Boolean) as string[];
                setOccupiedTutorIds(tIds);
                setOccupiedRoomIds(rIds);

                if (selectedTutor && tIds.includes(selectedTutor)) {
                    setSelectedTutor('');
                }
                if (selectedEditRoom && rIds.includes(selectedEditRoom.id)) {
                    setSelectedEditRoom(null);
                }
            }
        };
        fetchOccupied();
    }, [date, slot, session.class_id, selectedEditRoom, selectedTutor]);

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
        const updatedSession: Partial<Session> = {
            id: session.id,
            tutor_id: selectedTutor || null,
            classroom_id: selectedEditRoom ? selectedEditRoom.id : session.classroom_id,
            date,
            slot
        };
        onSave(updatedSession);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002045]/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    <h3 className="text-lg font-bold text-[#002045]">
                        Edit Session #{session.session_number}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-500"/> Date
                            </label>
                            <input 
                                type="date"
                                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="col-span-3 space-y-2">
                            <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-500"/> Slot
                            </label>
                            <select 
                                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium"
                                value={slot}
                                onChange={(e) => setSlot(e.target.value)}
                            >
                                <option value="slot1">Slot 1 (07:30 - 09:30)</option>
                                <option value="slot2">Slot 2 (09:30 - 11:30)</option>
                                <option value="slot3">Slot 3 (13:30 - 15:30)</option>
                                <option value="slot4">Slot 4 (15:30 - 17:30)</option>
                                <option value="slot5">Slot 5 (18:00 - 20:00)</option>
                                <option value="slot6">Slot 6 (20:00 - 22:00)</option>
                            </select>
                        </div>
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
                            <option value="">-- No Tutor --</option>
                            {availableTutors.filter(t => !occupiedTutorIds.includes(t.id)).map(t => (
                                <option key={t.id} value={t.id}>{t.full_name}</option>
                            ))}
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
                                <span className="truncate">
                                    {selectedEditRoom.room_name} (Cap: {selectedEditRoom.capacity})
                                </span>
                            ) : (
                                <span>
                                    {session.classroom?.room_name || 'Not assigned'} (Current)
                                </span>
                            )}
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isEditRoomDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isEditRoomDropdownOpen && (
                            <div className="absolute z-10 bottom-full left-0 right-0 mb-1 bg-white border border-[#c4c6cf] rounded-xl shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
                                <button 
                                    className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors truncate text-gray-500"
                                    onClick={() => { setSelectedEditRoom(null); setIsEditRoomDropdownOpen(false); }}
                                >
                                    -- Keep Current --
                                </button>
                                {availableRooms.filter(room => !occupiedRoomIds.includes(room.id)).map((room) => (
                                    <button 
                                        key={room.id}
                                        className="w-full text-left px-4 py-2 hover:bg-[#f0f7ff] transition-colors truncate"
                                        onClick={() => { setSelectedEditRoom(room); setIsEditRoomDropdownOpen(false); }}
                                    >
                                        {room.room_name} (Cap: {room.capacity})
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
