import { useState, useRef, useEffect, useMemo } from 'react';
import { X, Users, MapPin, ChevronDown, Save, Calendar, Clock, Star } from 'lucide-react';
import type { Session } from '../types/class';
import type { Classroom } from '@/shared/services/classrooms.service';
import { ClassesService } from '../services/classes.service';
import { TutorAvailabilityService } from '../services/tutor-availability.service';
import type { AvailabilityCycle } from '../services/tutor-availability.service';
import type { TutorAvailabilityProfile } from '../types/tutor-availability';

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

    const [isEditSlotDropdownOpen, setIsEditSlotDropdownOpen] = useState(false);
    const editSlotDropdownRef = useRef<HTMLDivElement>(null);

    const [allSessionsOnDate, setAllSessionsOnDate] = useState<Session[]>([]);
    const [cycles, setCycles] = useState<AvailabilityCycle[]>([]);
    const [tutorsAvailability, setTutorsAvailability] = useState<TutorAvailabilityProfile[]>([]);

    useEffect(() => {
        const fetchInitial = async () => {
            const cyclesData = await TutorAvailabilityService.getCycles();
            setCycles(cyclesData);
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        const fetchDateData = async () => {
            if (!date) return;
            const sessions = await ClassesService.getOccupiedSessions({
                date,
                exclude_class_id: session.class_id
            });
            setAllSessionsOnDate(sessions);

            if (cycles.length > 0) {
                const dateObj = new Date(date);
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const cycleName = `${monthNames[dateObj.getMonth()]} - ${dateObj.getFullYear()}`;
                const targetCycle = cycles.find(c => c.name === cycleName);
                if (targetCycle) {
                    try {
                        const availabilityData = await TutorAvailabilityService.getTutors(targetCycle.id);
                        setTutorsAvailability(availabilityData || []);
                    } catch {
                        setTutorsAvailability([]);
                    }
                } else {
                    setTutorsAvailability([]);
                }
            }
        };
        fetchDateData();
    }, [date, cycles, session.class_id]);

    const shiftToLabelMap: Record<string, string> = {
        'slot1': 'Slot 1 (07:30 - 09:30)', 'slot2': 'Slot 2 (09:30 - 11:30)',
        'slot3': 'Slot 3 (13:30 - 15:30)', 'slot4': 'Slot 4 (15:30 - 17:30)',
        'slot5': 'Slot 5 (18:00 - 20:00)', 'slot6': 'Slot 6 (20:00 - 22:00)'
    };

    const availableSlots = useMemo(() => {
        const allSlots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6'];
        if (!date) return allSlots;
        
        const dateObj = new Date(date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[dateObj.getDay()];

        return allSlots.filter(s => {
            if (selectedEditRoom) {
                const isRoomOccupied = allSessionsOnDate.some(sess => sess.slot === s && sess.classroom_id === selectedEditRoom.id);
                if (isRoomOccupied) return false;
            }
            if (selectedTutor) {
                const isTutorOccupied = allSessionsOnDate.some(sess => sess.slot === s && sess.tutor_id === selectedTutor);
                if (isTutorOccupied) return false;

                if (selectedTutor !== session.tutor_id) {
                    const tutorProfile = tutorsAvailability.find(t => t.id === selectedTutor);
                    if (tutorProfile && !tutorProfile.slots.includes(`${dayName}-${s}`)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }, [date, selectedEditRoom, selectedTutor, allSessionsOnDate, tutorsAvailability, session.tutor_id]);

    const filteredTutors = useMemo(() => {
        if (!date || !slot) return availableTutors;
        
        const dateObj = new Date(date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[dateObj.getDay()];

        return availableTutors.filter(t => {
            const isOccupied = allSessionsOnDate.some(sess => sess.slot === slot && sess.tutor_id === t.id);
            if (isOccupied) return false;

            if (t.id === session.tutor_id) return true;

            const tutorProfile = tutorsAvailability.find(profile => profile.id === t.id);
            if (tutorProfile && !tutorProfile.slots.includes(`${dayName}-${slot}`)) {
                return false;
            }
            return true;
        });
    }, [date, slot, availableTutors, allSessionsOnDate, tutorsAvailability, session.tutor_id]);

    const filteredRooms = useMemo(() => {
        if (!slot) return availableRooms;
        return availableRooms.filter(r => {
            return !allSessionsOnDate.some(sess => sess.slot === slot && sess.classroom_id === r.id);
        });
    }, [slot, availableRooms, allSessionsOnDate]);

    useEffect(() => {
        if (selectedTutor && !filteredTutors.some(t => t.id === selectedTutor)) {
            setTimeout(() => setSelectedTutor(''), 0);
        }
    }, [filteredTutors, selectedTutor]);

    useEffect(() => {
        if (selectedEditRoom && !filteredRooms.some(r => r.id === selectedEditRoom.id)) {
            setTimeout(() => setSelectedEditRoom(null), 0);
        }
    }, [filteredRooms, selectedEditRoom]);

    useEffect(() => {
        if (slot && !availableSlots.includes(slot)) {
            setTimeout(() => {
                if (availableSlots.length > 0) {
                    setSlot(availableSlots[0]);
                } else {
                    setSlot('');
                }
            }, 0);
        }
    }, [availableSlots, slot]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editRoomDropdownRef.current && !editRoomDropdownRef.current.contains(event.target as Node)) {
                setIsEditRoomDropdownOpen(false);
            }
            if (editSlotDropdownRef.current && !editSlotDropdownRef.current.contains(event.target as Node)) {
                setIsEditSlotDropdownOpen(false);
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in-up overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                    <h2 className="text-lg font-bold text-[#002045]">Edit Session {session.session_number} - {session.class?.name || 'Unknown Class'}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
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
                        <div className="space-y-2 relative" ref={editSlotDropdownRef}>
                            <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-500"/> Slot
                            </label>
                            <button 
                                type="button"
                                onClick={() => setIsEditSlotDropdownOpen(!isEditSlotDropdownOpen)}
                                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 flex justify-between items-center text-left"
                            >
                                <span>{slot ? shiftToLabelMap[slot] : '-- No Slot --'}</span>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isEditSlotDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isEditSlotDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#c4c6cf] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {availableSlots.length === 0 ? (
                                        <div className="px-4 py-3 text-gray-500 text-sm text-center">-- No Available Slots --</div>
                                    ) : (
                                        availableSlots.map(s => {
                                            let isOutOfSchedule = false;
                                            if (selectedTutor === session.tutor_id && date) {
                                                const dateObj = new Date(date);
                                                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                                const dayName = dayNames[dateObj.getDay()];
                                                const tutorProfile = tutorsAvailability.find(t => t.id === selectedTutor);
                                                if (!tutorProfile || !tutorProfile.slots.includes(`${dayName}-${s}`)) {
                                                    isOutOfSchedule = true;
                                                }
                                            }
                                            return (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => {
                                                        setSlot(s);
                                                        setIsEditSlotDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${slot === s ? 'bg-blue-50 text-[#0061a5] font-medium' : 'text-gray-700'}`}
                                                >
                                                    <span>{shiftToLabelMap[s]}</span>
                                                    {isOutOfSchedule && (
                                                        <span className="flex items-center text-orange-500 text-xs font-semibold">
                                                            <Star className="w-3 h-3 fill-current" />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {selectedTutor === session.tutor_id && availableSlots.length > 0 && (
                                <p className="text-xs text-orange-500 mt-1 pl-1 flex items-center gap-1 font-medium">
                                    <Star className="w-3 h-3 fill-current" /> Slot not in the tutor's registered schedule
                                </p>
                            )}
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
                            {filteredTutors.map(t => (
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
                                {filteredRooms.map((room) => (
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
