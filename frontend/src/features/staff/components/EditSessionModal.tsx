import { useState, useRef, useEffect, useMemo } from 'react';
import { X, Users, MapPin, ChevronDown, Save, Calendar, Clock, Star } from 'lucide-react';
import type { Session } from '../types/class';
import type { Classroom } from '@/shared/services/classrooms.service';
import { ClassesService } from '../services/classes.service';

import { TutorAvailabilityService, type AvailabilityCycle } from '@/shared/services/tutor-availability.service';
import type { TutorAvailabilityProfile } from '@/shared/types/tutor-availability';

interface EditSessionModalProps {
    session: Session;
    availableRooms: Classroom[];
    availableTutors: { id: string; full_name: string; email?: string }[];
    onClose: () => void;
    onSave: (session: Partial<Session>) => void;
}

export const EditSessionModal = ({ session, availableRooms, availableTutors, onClose, onSave }: EditSessionModalProps) => {
    const [selectedEditRoom, setSelectedEditRoom] = useState<Classroom | null>(null);
    const [selectedTutor, setSelectedTutor] = useState(session.tutor_id || '');
    const [date, setDate] = useState(session.date);
    const [slot, setSlot] = useState(session.slot);

    const [isEditSlotDropdownOpen, setIsEditSlotDropdownOpen] = useState(false);
    const editSlotDropdownRef = useRef<HTMLDivElement>(null);

    const [isEditTutorDropdownOpen, setIsEditTutorDropdownOpen] = useState(false);
    const editTutorDropdownRef = useRef<HTMLDivElement>(null);

    const [isEditRoomDropdownOpen, setIsEditRoomDropdownOpen] = useState(false);
    const editRoomDropdownRef = useRef<HTMLDivElement>(null);

    const [allSessionsOnDate, setAllSessionsOnDate] = useState<Session[]>([]);
    const [cycles, setCycles] = useState<AvailabilityCycle[]>([]);
    const [tutorsAvailability, setTutorsAvailability] = useState<TutorAvailabilityProfile[]>([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
    const [isCyclesLoaded, setIsCyclesLoaded] = useState(false);

    const [prevTutorOptions, setPrevTutorOptions] = useState<({ id: string; full_name: string; isOccupied: boolean })[]>([]);
    const [prevRoomOptions, setPrevRoomOptions] = useState<(Classroom & { isOccupied: boolean })[]>([]);
    const [prevSlotOptions, setPrevSlotOptions] = useState<{ id: string; isOccupied: boolean; isUnregistered: boolean; isPhysicallyOccupied: boolean; isRegistered: boolean }[]>([]);

    const dateInfo = useMemo(() => {
        if (!date) return null;
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[dateObj.getDay()];
        const cycleName = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
        return { dateObj, dayName, cycleName };
    }, [date]);

    useEffect(() => {
        const fetchInitial = async () => {
            const cyclesData = await TutorAvailabilityService.getCycles();
            setCycles(cyclesData);
            setIsCyclesLoaded(true);
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        let ignore = false;
        const fetchDateData = async () => {
            if (!isCyclesLoaded) return;
            setIsLoadingAvailability(true);
            
            if (!date) {
                if (!ignore) setIsLoadingAvailability(false);
                return;
            }

            const targetCycle = cycles.length > 0 && dateInfo ? cycles.find(c => c.name === dateInfo.cycleName) : null;

            try {
                const [sessions, availabilityData] = await Promise.all([
                    ClassesService.getOccupiedSessions({
                        date,
                        exclude_class_id: session.class_id
                    }),
                    targetCycle ? TutorAvailabilityService.getTutorProfiles(targetCycle.id) : Promise.resolve(null)
                ]);

                if (ignore) return;
                setAllSessionsOnDate(sessions);
                setTutorsAvailability(availabilityData || []);
            } catch {
                if (ignore) return;
                setTutorsAvailability([]);
            } finally {
                if (!ignore) setIsLoadingAvailability(false);
            }
        };
        fetchDateData();
        return () => { ignore = true; };
    }, [date, cycles, isCyclesLoaded, session.class_id, dateInfo]);

    const shiftToLabelMap: Record<string, string> = {
        'slot1': 'Slot 1 (07:30 - 09:30)', 'slot2': 'Slot 2 (09:30 - 11:30)',
        'slot3': 'Slot 3 (13:30 - 15:30)', 'slot4': 'Slot 4 (15:30 - 17:30)',
        'slot5': 'Slot 5 (18:00 - 20:00)', 'slot6': 'Slot 6 (20:00 - 22:00)'
    };

    const slotOptions = useMemo(() => {
        const allSlots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6'];
        if (!dateInfo) return allSlots.map(s => ({ id: s, isOccupied: false, isUnregistered: false, isPhysicallyOccupied: false, isRegistered: false }));

        return allSlots.map(s => {
            let isOccupied = false;
            let isUnregistered = false;
            let isRegistered = false;
            if (selectedEditRoom) {
                const roomOcc = allSessionsOnDate.some(sess => sess.slot === s && sess.classroom_id === selectedEditRoom.id);
                if (roomOcc) isOccupied = true;
            }
            if (selectedTutor) {
                const tutorOcc = allSessionsOnDate.some(sess => sess.slot === s && sess.tutor_id === selectedTutor);
                if (tutorOcc) isOccupied = true;

                const tutorProfile = tutorsAvailability.find(t => t.id === selectedTutor);
                if (tutorProfile && tutorProfile.slots.includes(`${dateInfo.dayName}-${s}`)) {
                    isRegistered = true;
                }

                if (!isLoadingAvailability && selectedTutor !== session.tutor_id) {
                    if (!tutorProfile || !tutorProfile.slots.includes(`${dateInfo.dayName}-${s}`)) {
                        isUnregistered = true;
                    }
                }
            }
            return { id: s, isOccupied: isOccupied || isUnregistered, isUnregistered, isPhysicallyOccupied: isOccupied, isRegistered };
        });
    }, [selectedEditRoom, selectedTutor, allSessionsOnDate, dateInfo, session.tutor_id, isLoadingAvailability, tutorsAvailability]);

    const tutorOptions = useMemo(() => {
        if (!dateInfo || !slot) return availableTutors.map(t => ({ ...t, isOccupied: false }));

        return availableTutors
            .filter(t => {
                const isOccupied = allSessionsOnDate.some(sess => sess.slot === slot && sess.tutor_id === t.id);
                return !(isOccupied && t.id !== session.tutor_id);
            })
            .map(t => ({ ...t, isOccupied: false }));
    }, [slot, availableTutors, allSessionsOnDate, session.tutor_id, dateInfo]);

    const roomOptions = useMemo(() => {
        if (!slot) return availableRooms.map(r => ({ ...r, isOccupied: false }));
        
        return availableRooms
            .filter(r => {
                const isOccupied = allSessionsOnDate.some(sess => sess.slot === slot && sess.classroom_id === r.id);
                return !(isOccupied && r.id !== session.classroom_id);
            })
            .map(r => ({ ...r, isOccupied: false }));
    }, [slot, availableRooms, allSessionsOnDate, session.classroom_id]);

    if (tutorOptions !== prevTutorOptions) {
        setPrevTutorOptions(tutorOptions);
        if (selectedTutor) {
            const tutor = tutorOptions.find(t => t.id === selectedTutor);
            if (tutor?.isOccupied) {
                setSelectedTutor('');
            }
        }
    }

    if (roomOptions !== prevRoomOptions) {
        setPrevRoomOptions(roomOptions);
        if (selectedEditRoom) {
            const room = roomOptions.find(r => r.id === selectedEditRoom.id);
            if (room?.isOccupied) {
                setSelectedEditRoom(null);
            }
        }
    }

    if (slotOptions !== prevSlotOptions) {
        setPrevSlotOptions(slotOptions);
        if (slot) {
            const slotOpt = slotOptions.find(s => s.id === slot);
            if (slotOpt?.isOccupied) {
                const firstAvailable = slotOptions.find(s => !s.isOccupied);
                setSlot(firstAvailable ? firstAvailable.id : '');
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editSlotDropdownRef.current && !editSlotDropdownRef.current.contains(event.target as Node)) {
                setIsEditSlotDropdownOpen(false);
            }
            if (editTutorDropdownRef.current && !editTutorDropdownRef.current.contains(event.target as Node)) {
                setIsEditTutorDropdownOpen(false);
            }
            if (editRoomDropdownRef.current && !editRoomDropdownRef.current.contains(event.target as Node)) {
                setIsEditRoomDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isPast = new Date(session.date) < new Date(new Date().setHours(0,0,0,0));

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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-130 animate-fade-in-up flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-[#e0e3e5] bg-[#f8f9fa] rounded-t-2xl">
                    <h2 className="text-lg font-bold text-[#002045]">{isPast ? 'View' : 'Edit'} Session {session.session_number} - {session.class ? `${session.class.course?.title || 'Unknown Course'} - ${session.class.name}` : 'Unknown Class'}</h2>
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
                            className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setIsLoadingAvailability(true);
                            }}
                            disabled={isPast}
                        />
                        </div>

                        <div className="space-y-2 relative" ref={editSlotDropdownRef}>
                            <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-500"/> Slot
                        </label>
                        <button 
                            type="button"
                            onClick={() => !isPast && setIsEditSlotDropdownOpen(!isEditSlotDropdownOpen)}
                            className={`w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 flex justify-between items-center text-left ${isPast ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isPast}
                        >
                            <div className="flex items-center min-w-0">
                                <span className="truncate">{slot ? shiftToLabelMap[slot] : 'Select Slot'}</span>
                                {slot && slotOptions.find(s => s.id === slot)?.isRegistered && (
                                    <Star className="w-3 h-3 fill-current text-orange-500 shrink-0 ml-1.5" />
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-1 ${isEditSlotDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isEditSlotDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#c4c6cf] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto py-2">
                                {slotOptions.length === 0 ? (
                                    <div className="px-4 py-3 text-gray-500 text-sm text-center">No Available Slots</div>
                                ) : (
                                    slotOptions.map(sOpt => {
                                        const s = sOpt.id;
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                disabled={sOpt.isOccupied}
                                                onClick={() => {
                                                    if (!sOpt.isOccupied) {
                                                        setSlot(s);
                                                        setIsEditSlotDropdownOpen(false);
                                                    }
                                                }}
                                                className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between 
                                                    ${sOpt.isOccupied ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'} 
                                                    ${slot === s && !sOpt.isOccupied ? 'bg-blue-50 text-[#0061a5] font-medium' : 'text-gray-700'}`}
                                            >
                                                <span className="truncate pr-2">{shiftToLabelMap[s]} {sOpt.isUnregistered ? '(Not Registered)' : (sOpt.isPhysicallyOccupied ? '(Occupied)' : '')}</span>
                                                {sOpt.isRegistered && (
                                                    <Star className="w-3 h-3 fill-current text-orange-500 shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="space-y-2 relative" ref={editTutorDropdownRef}>
                        <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500"/> Assign Substitute Tutor
                        </label>
                        <button 
                            type="button"
                            onClick={() => !isPast && setIsEditTutorDropdownOpen(!isEditTutorDropdownOpen)}
                            className={`w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors ${isPast ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isPast}
                        >
                            <span className="truncate">{selectedTutor ? tutorOptions.find(t => t.id === selectedTutor)?.full_name || 'Unknown Tutor' : 'No Tutor Assigned'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-1 ${isEditTutorDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isEditTutorDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#c4c6cf] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto py-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedTutor('');
                                        setIsEditTutorDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${!selectedTutor ? 'bg-blue-50 text-[#0061a5] font-medium' : 'text-gray-700'}`}
                                >
                                    No Tutor Assigned
                                </button>
                                {tutorOptions.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        disabled={t.isOccupied}
                                        onClick={() => {
                                            if (!t.isOccupied) {
                                                setSelectedTutor(t.id);
                                                setIsEditTutorDropdownOpen(false);
                                            }
                                        }}
                                        className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between 
                                            ${t.isOccupied ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'} 
                                            ${selectedTutor === t.id && !t.isOccupied ? 'bg-blue-50 text-[#0061a5] font-medium' : 'text-gray-700'}`}
                                    >
                                        <span className="truncate pr-2">{t.full_name} {t.isOccupied ? '(Occupied)' : ''}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 relative" ref={editRoomDropdownRef}>
                        <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500"/> Change Room
                        </label>
                        <button
                            type="button"
                            onClick={() => !isPast && setIsEditRoomDropdownOpen(!isEditRoomDropdownOpen)}
                            className={`w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors ${isPast ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isPast}
                        >
                            <span className="truncate">
                                {!selectedEditRoom && !session.classroom_id ? 'No Room Assigned' : 
                                    (selectedEditRoom ? selectedEditRoom.room_name : 
                                    (session.classroom?.room_name ? `${session.classroom.room_name} (Current)` : 'Current Room'))}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-1 ${isEditRoomDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isEditRoomDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#c4c6cf] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto py-2">
                                {!session.classroom_id && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedEditRoom(null);
                                            setIsEditRoomDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${!selectedEditRoom ? 'bg-blue-50 text-[#0061a5] font-medium' : 'text-gray-700'}`}
                                    >
                                        No Room Assigned
                                    </button>
                                )}
                                {session.classroom_id && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedEditRoom(null);
                                            setIsEditRoomDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${!selectedEditRoom ? 'bg-blue-50 text-[#0061a5] font-medium' : 'text-gray-700'}`}
                                    >
                                        {session.classroom?.room_name ? `${session.classroom.room_name} (Current)` : 'Current Room'}
                                    </button>
                                )}
                                {roomOptions.map((room) => {
                                    if (room.id === session.classroom_id) return null;
                                    return (
                                        <button 
                                            key={room.id}
                                            type="button"
                                            disabled={room.isOccupied}
                                            onClick={() => {
                                                if (!room.isOccupied) {
                                                    setSelectedEditRoom(room);
                                                    setIsEditRoomDropdownOpen(false);
                                                }
                                            }}
                                            className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between 
                                                ${room.isOccupied ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'} 
                                                ${selectedEditRoom?.id === room.id && !room.isOccupied ? 'bg-blue-50 text-[#0061a5] font-medium' : 'text-gray-700'}`}
                                        >
                                            <span className="truncate pr-2">{room.room_name} (Cap: {room.capacity}) {room.isOccupied ? '(Occupied)' : ''}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-5 border-t border-[#e0e3e5] bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border border-[#c4c6cf] hover:bg-gray-50 transition-colors"
                    >
                        {isPast ? 'Close' : 'Cancel'}
                    </button>
                    {!isPast && (
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#0061a5] hover:bg-[#004d84] transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
