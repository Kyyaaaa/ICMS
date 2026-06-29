import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Calendar, Users, MapPin } from 'lucide-react';
import type { ChangeRequest } from '../types/change-request';
import { ClassroomsService, type Classroom } from '@/shared/services/classrooms.service';
import { ClassesService } from '../services/classes.service';
import { AccountsService } from '../services/accounts.service';
import { formatDate } from '../../../shared/utils/date';
import { TutorAvailabilityService } from '../../../shared/services/tutor-availability.service';

interface ChangeRequestModalProps {
    request: ChangeRequest;
    onClose: () => void;
    onUpdateStatus: (
        id: string, 
        status: string, 
        finalTime?: string, 
        staffNote?: string, 
        substituteTutorId?: string,
        newDate?: string,
        newSlot?: string,
        newRoomId?: string
    ) => void;
}

export const ChangeRequestModal = ({ request, onClose, onUpdateStatus }: ChangeRequestModalProps) => {
    const [selectedNewDate, setSelectedNewDate] = useState('');
    const [selectedNewTime, setSelectedNewTime] = useState('');
    const [selectedNewRoom, setSelectedNewRoom] = useState('');
    const [staffNote, setStaffNote] = useState(request.staffNote || '');

    const [allRooms, setAllRooms] = useState<Classroom[]>([]);
    const [occupiedRoomIds, setOccupiedRoomIds] = useState<string[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);

    const [availableTutors, setAvailableTutors] = useState<{id: string, full_name: string}[]>([]);
    const [selectedSubstituteTutorId, setSelectedSubstituteTutorId] = useState('');
    const [isLoadingTutors, setIsLoadingTutors] = useState(false);

    useEffect(() => {
        ClassroomsService.getAll().then(setAllRooms);

        if ((request.type?.toLowerCase() === 'substitute tutor' || request.type?.toLowerCase() === 'substitute') && request.status === 'Pending') {
            setIsLoadingTutors(true);
            let originalDate = '';
            let originalSlot = '';
            if (request.originalTime) {
                const parts = request.originalTime.split(' (');
                if (parts.length === 2) {
                    originalDate = parts[0];
                    originalSlot = parts[1].replace(')', '');
                }
            }

            // Convert originalDate (e.g., Nov 20, 2024 or 2024-11-20) to YYYY-MM-DD
            let isoDate = originalDate;
            const d = new Date(originalDate);
            if (!isNaN(d.getTime())) {
                isoDate = d.toLocaleDateString('en-CA');
            }

            const timeMapReverse: Record<string, string> = {
                '07:30 - 09:30': 'slot1', '09:30 - 11:30': 'slot2',
                '13:30 - 15:30': 'slot3', '15:30 - 17:30': 'slot4',
                '18:00 - 20:00': 'slot5', '20:00 - 22:00': 'slot6'
            };
            const slotCode = timeMapReverse[originalSlot] || originalSlot;
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[d.getDay()];
            const requiredSlotKey = `${dayName}-${slotCode}`.toLowerCase();

            const month = d.getMonth() + 1;
            const year = d.getFullYear();

            Promise.all([
                AccountsService.getAccounts({ page: 1, limit: 100, role: 'TUTOR' }),
                ClassesService.getOccupiedSessions({ date: isoDate, slot: originalSlot }),
                TutorAvailabilityService.getCycleByMonth(month, year).catch(() => null)
            ]).then(async ([tutorsRes, occupiedSessions, cycle]) => {
                const allTutorsData = (tutorsRes as any).data?.data || [];
                const occupiedTutorIds = occupiedSessions.map(s => s.tutor_id).filter(Boolean);
                
                let availableInCycleTutorIds: string[] | null = null;
                if (cycle) {
                    try {
                        const profiles = await TutorAvailabilityService.getTutorProfiles(cycle.id);
                        availableInCycleTutorIds = profiles
                            .filter(p => p.slots.some(s => s.toLowerCase() === requiredSlotKey))
                            .map(p => p.id);
                    } catch (e) {
                        console.error('Failed to get tutor profiles for cycle', e);
                    }
                }

                const freeTutors = allTutorsData.filter((t: any) => {
                    if (occupiedTutorIds.includes(t.id)) return false;
                    if (t.id === request.tutorId) return false;
                    if (availableInCycleTutorIds !== null && !availableInCycleTutorIds.includes(t.id)) return false;
                    return true;
                });
                
                setAvailableTutors(freeTutors);
            }).finally(() => setIsLoadingTutors(false));
        }
    }, [request]);

    const [isTutorOccupied, setIsTutorOccupied] = useState(false);

    useEffect(() => {
        if (!selectedNewDate || !selectedNewTime) {
            setIsTutorOccupied(false);
            return;
        }
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoadingRooms(true);
        ClassesService.getOccupiedSessions({ date: selectedNewDate, slot: selectedNewTime })
            .then(occupiedSessions => {
                const occupiedRoomIdsList = occupiedSessions.map(s => s.classroom_id).filter(Boolean);
                setOccupiedRoomIds(occupiedRoomIdsList);

                if (request.originalRoomId && !occupiedRoomIdsList.includes(request.originalRoomId)) {
                    const originalRoom = allRooms.find(r => r.id === request.originalRoomId);
                    if (originalRoom) {
                        setSelectedNewRoom(originalRoom.id);
                    }
                }
                
                const occupiedTutorIds = occupiedSessions.map(s => s.tutor_id).filter(Boolean);
                setIsTutorOccupied(occupiedTutorIds.includes(request.tutorId));
            })
            .finally(() => setIsLoadingRooms(false));
    }, [selectedNewDate, selectedNewTime, allRooms, request.originalRoomId]);

    const handleApprove = () => {
        let finalArranged = '';
        if (request.type?.toLowerCase() === 'reschedule' || request.type?.toLowerCase() === 'change room') {
            const roomObj = allRooms.find(r => r.id === selectedNewRoom);
            const roomName = roomObj ? roomObj.room_name : selectedNewRoom;
            const timeMap: Record<string, string> = {
                'slot1': '07:30 - 09:30', 'slot2': '09:30 - 11:30',
                'slot3': '13:30 - 15:30', 'slot4': '15:30 - 17:30',
                'slot5': '18:00 - 20:00', 'slot6': '20:00 - 22:00'
            };
            const readableTime = timeMap[selectedNewTime] || selectedNewTime;
            finalArranged = `${formatDate(selectedNewDate)} (${readableTime}) • Room ${roomName}`;
        } else if (request.type?.toLowerCase() === 'substitute tutor' || request.type?.toLowerCase() === 'substitute') {
            const tutorObj = availableTutors.find(t => t.id === selectedSubstituteTutorId);
            const tutorName = tutorObj ? tutorObj.full_name : selectedSubstituteTutorId;
            finalArranged = tutorName;
        }
        onUpdateStatus(
            request.id, 
            'Approved', 
            finalArranged || request.finalTime, 
            staffNote, 
            selectedSubstituteTutorId,
            selectedNewDate,
            selectedNewTime,
            selectedNewRoom
        );
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
                            <p className="text-sm font-semibold text-gray-500 mb-1">Requested Action</p>
                            <p className={`font-semibold flex items-center gap-1.5 ${
                                request.type?.toLowerCase() === 'reschedule' ? 'text-[#0061a5]' : 
                                (request.type?.toLowerCase() === 'substitute tutor' || request.type?.toLowerCase() === 'substitute') ? 'text-purple-600' :
                                'text-[#16a34a]'
                            }`}>
                                {request.type?.toLowerCase() === 'reschedule' ? <Calendar className="w-4 h-4"/> : 
                                 (request.type?.toLowerCase() === 'substitute tutor' || request.type?.toLowerCase() === 'substitute') ? <Users className="w-4 h-4"/> : 
                                 <MapPin className="w-4 h-4"/>} 
                                {request.type?.toLowerCase() === 'reschedule' ? 'Reschedule' : 
                                 (request.type?.toLowerCase() === 'substitute tutor' || request.type?.toLowerCase() === 'substitute') ? 'Substitute' : 
                                 'Change Room'}
                            </p>
                        </div>
                        {request.type?.toLowerCase() === 'reschedule' && (
                            <div className="col-span-2 pt-3 mt-1 border-t border-[#e0e3e5]">
                                <p className="text-sm font-semibold text-gray-500 mb-1">Proposed by Tutor</p>
                                <p className="font-semibold text-[#0061a5]">
                                    {request.proposedTime || 'TBD (None provided)'}
                                </p>
                            </div>
                        )}
                    </div>

                    {(request.type?.toLowerCase() === 'reschedule' || request.type?.toLowerCase() === 'change room') && request.status === 'Pending' && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
                            <p className="text-sm font-bold text-[#002045]">
                                {request.type?.toLowerCase() === 'change room' ? 'Assign Final Room' : 'Assign Final Reschedule'}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Select Date <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date" 
                                        min={new Date().toLocaleDateString('en-CA')}
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
                                        <option value="" disabled hidden>Select Time</option>
                                        {[
                                            { label: 'Slot 1 (07:30 - 09:30)', value: 'slot1', time: '07:30' },
                                            { label: 'Slot 2 (09:30 - 11:30)', value: 'slot2', time: '09:30' },
                                            { label: 'Slot 3 (13:30 - 15:30)', value: 'slot3', time: '13:30' },
                                            { label: 'Slot 4 (15:30 - 17:30)', value: 'slot4', time: '15:30' },
                                            { label: 'Slot 5 (18:00 - 20:00)', value: 'slot5', time: '18:00' },
                                            { label: 'Slot 6 (20:00 - 22:00)', value: 'slot6', time: '20:00' }
                                        ].filter(slot => {
                                            const originalDateStr = request.originalTime?.split(' (')[0];
                                            const isSameDay = originalDateStr === formatDate(selectedNewDate);
                                            // Extract "18:00 - 20:00" from originalTime to match with label
                                            const originalTimeStr = request.originalTime?.split('(')[1]?.replace(')', '');
                                            if (isSameDay && slot.label.includes(originalTimeStr || '')) return false;

                                            // Filter out past time slots if the selected date is today
                                            const todayStr = new Date().toLocaleDateString('en-CA');
                                            if (selectedNewDate === todayStr) {
                                                const slotStartTime = slot.time; // e.g., "07:30"
                                                const now = new Date();
                                                const currentHours = now.getHours();
                                                const currentMinutes = now.getMinutes();
                                                const slotHours = parseInt(slotStartTime.split(':')[0], 10);
                                                const slotMinutes = parseInt(slotStartTime.split(':')[1], 10);
                                                
                                                if (currentHours > slotHours || (currentHours === slotHours && currentMinutes >= slotMinutes)) {
                                                    return false;
                                                }
                                            }
                                            return true;
                                        }).map(slot => (
                                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Room <span className="text-red-500">*</span></label>
                                    <select 
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                        value={selectedNewRoom}
                                        onChange={(e) => setSelectedNewRoom(e.target.value)}
                                        disabled={!selectedNewTime || isLoadingRooms}
                                    >
                                        <option value="" disabled hidden>
                                            {isLoadingRooms ? 'Loading rooms...' : (allRooms.length === 0 && selectedNewTime ? 'No rooms available' : 'Select Room')}
                                        </option>
                                        {allRooms.map(room => (
                                            <option key={room.id} value={room.id} disabled={occupiedRoomIds.includes(room.id)}>
                                                {room.room_name} (Cap: {room.capacity}) {occupiedRoomIds.includes(room.id) ? '- Occupied' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {isTutorOccupied ? (
                                <p className="text-sm font-bold text-red-600 mt-2">Warning: The tutor is already assigned to another class at this time!</p>
                            ) : (
                                <p className="text-xs text-gray-500">You must check available time slots and rooms on the selected date before approving.</p>
                            )}
                        </div>
                    )}

                    {(request.type?.toLowerCase() === 'substitute tutor' || request.type?.toLowerCase() === 'substitute') && request.status === 'Pending' && (
                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-4">
                            <p className="text-sm font-bold text-[#002045]">
                                Assign Substitute Tutor
                            </p>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Select Available Tutor <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                    value={selectedSubstituteTutorId}
                                    onChange={(e) => setSelectedSubstituteTutorId(e.target.value)}
                                    disabled={isLoadingTutors}
                                >
                                    <option value="" disabled hidden>
                                        {isLoadingTutors ? 'Loading available tutors...' : (availableTutors.length === 0 ? 'No tutors available' : 'Select Substitute Tutor')}
                                    </option>
                                    {availableTutors.map(tutor => (
                                        <option key={tutor.id} value={tutor.id}>{tutor.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {(request.type?.toLowerCase() === 'reschedule' || request.type?.toLowerCase() === 'change room') && request.status !== 'Pending' && request.finalTime && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-sm font-semibold text-green-700 mb-1">Final Arranged Schedule/Room</p>
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
                            disabled={((request.type?.toLowerCase() === 'reschedule' || request.type?.toLowerCase() === 'change room') && (!selectedNewDate || !selectedNewTime || !selectedNewRoom)) || isTutorOccupied || ((request.type?.toLowerCase() === 'substitute tutor' || request.type?.toLowerCase() === 'substitute') && !selectedSubstituteTutorId)}
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
