import { formatDate } from "../../../shared/utils/date";
import { useState, useEffect, useRef } from 'react';
import { X, FileEdit, Calendar, Users, Send, ChevronDown } from 'lucide-react';
import { ScheduleService } from '../services/schedule.service';
import type { TutorScheduleSession } from '../types/schedule';
import Cookies from 'js-cookie';
import type { CreateChangeRequestData } from '../types/change-request';

interface CreateChangeRequestFormProps {
    onClose: () => void;
    onSubmit: (data: CreateChangeRequestData) => void;
}

export const CreateChangeRequestForm = ({ onClose, onSubmit }: CreateChangeRequestFormProps) => {
    const [newType, setNewType] = useState('Reschedule');
    const [selectedClass, setSelectedClass] = useState('');
    const [newClassSession, setNewClassSession] = useState('');
    const [newProposedDate, setNewProposedDate] = useState('');
    const [newProposedTimeSlot, setNewProposedTimeSlot] = useState('');
    const [newReason, setNewReason] = useState('');
    const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
    const sessionDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sessionDropdownRef.current && !sessionDropdownRef.current.contains(event.target as Node)) {
                setIsSessionDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [upcomingSessions, setUpcomingSessions] = useState<TutorScheduleSession[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            setIsLoadingSessions(true);
            try {
                const sessions = await ScheduleService.getSchedule();
                setUpcomingSessions(sessions.filter(s => s.attendance === 'pending' || s.attendance === 'not_yet'));
            } catch (error) {
                console.error("Failed to load sessions", error);
            } finally {
                setIsLoadingSessions(false);
            }
        };
        fetchSessions();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const proposedString = newType === 'Reschedule' && newProposedDate 
            ? `${formatDate(newProposedDate)} (${newProposedTimeSlot || 'Any Time'})` 
            : null;

        const selectedSession = upcomingSessions.find(s => s.sessionId === newClassSession);
        if (!selectedSession) return;
        
        const userInfo = Cookies.get('user_info');
        const user = userInfo ? JSON.parse(userInfo) : { id: '' };

        const data: CreateChangeRequestData = {
            class_id: selectedSession.classId,
            session_id: selectedSession.sessionId,
            tutor_id: user.id,
            className: selectedSession.class,
            session: parseInt(selectedSession.session.replace('Session ', '')),
            type: newType.toUpperCase(),
            originalTime: `${formatDate(selectedSession.date)} (${selectedSession.startTime} - ${selectedSession.endTime})`,
            proposedTime: proposedString,
            reason: newReason
        };
        
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden animate-fade-in-up max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                    <h3 className="text-lg font-bold text-[#002045] flex items-center gap-2">
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
                
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
                    <div className="overflow-y-auto p-6 flex-1">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-4">
                                <label className="block text-sm font-bold text-[#002045] mb-2">Request Type <span className="text-rose-500">*</span></label>
                                <div className="flex gap-2 h-9.5">
                                    <button 
                                        type="button"
                                        onClick={() => setNewType('Reschedule')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl text-sm font-bold border transition-all h-full ${newType === 'Reschedule' ? 'bg-[#e6f0fa] border-[#0061a5] text-[#0061a5]' : 'bg-white border-[#c4c6cf] text-[#43474e] hover:border-[#0061a5]'}`}
                                    >
                                        <Calendar className="w-4 h-4" /> Reschedule
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setNewType('Substitute')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl text-sm font-bold border transition-all h-full ${newType === 'Substitute' ? 'bg-[#f3e8ff] border-[#9333ea] text-[#9333ea]' : 'bg-white border-[#c4c6cf] text-[#43474e] hover:border-[#9333ea]'}`}
                                    >
                                        <Users className="w-4 h-4" /> Substitute
                                    </button>
                                </div>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-bold text-[#002045] mb-2">Class <span className="text-rose-500">*</span></label>
                                <select 
                                    required
                                    value={selectedClass}
                                    onChange={(e) => {
                                        setSelectedClass(e.target.value);
                                        setNewClassSession('');
                                    }}
                                    disabled={isLoadingSessions || upcomingSessions.length === 0}
                                    className="w-full p-2 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-sm font-medium disabled:bg-[#f1f4f6] h-9.5"
                                >
                                    <option value="" disabled hidden>
                                        {isLoadingSessions ? 'Loading...' : (upcomingSessions.length === 0 ? 'No upcoming classes' : 'Select class...')}
                                    </option>
                                    {Array.from(new Set(upcomingSessions.map(s => s.class))).map(className => (
                                        <option key={className} value={className}>
                                            {className}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                <div className="md:col-span-5 relative" ref={sessionDropdownRef}>
                                    <label className="block text-sm font-bold text-[#002045] mb-2">Session <span className="text-rose-500">*</span></label>
                            <button 
                                type="button"
                                onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
                                disabled={!selectedClass}
                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-sm font-medium disabled:bg-[#f1f4f6] h-9.5 flex justify-between items-center text-left"
                                >
                                    <span className="truncate">
                                        {newClassSession 
                                            ? upcomingSessions.find(s => s.sessionId === newClassSession)
                                                ? `${upcomingSessions.find(s => s.sessionId === newClassSession)?.session} (${formatDate(upcomingSessions.find(s => s.sessionId === newClassSession)?.date)} ${upcomingSessions.find(s => s.sessionId === newClassSession)?.startTime} - ${upcomingSessions.find(s => s.sessionId === newClassSession)?.endTime})`
                                                : 'Select session...'
                                            : 'Select session...'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-[#74777f] transition-transform ${isSessionDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isSessionDropdownOpen && (
                                    <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-[#c4c6cf] rounded-xl shadow-lg py-1">
                                        {upcomingSessions
                                            .filter(s => s.class === selectedClass)
                                            .map(s => (
                                                <li 
                                                    key={s.sessionId}
                                                    onClick={() => {
                                                        setNewClassSession(s.sessionId);
                                                        setIsSessionDropdownOpen(false);
                                                    }}
                                                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${newClassSession === s.sessionId ? 'bg-[#e6f0fa] text-[#0061a5] font-bold' : 'hover:bg-[#f1f4f6] text-[#43474e]'}`}
                                                >
                                                    {s.session} ({s.date ? formatDate(s.date) : 'TBA'} {s.startTime} - {s.endTime})
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                    {newType === 'Reschedule' && (
                        <div className="p-4 bg-[#f0f7ff] border border-[#bbdefb] rounded-xl space-y-4">
                            <p className="text-sm font-bold text-[#002045]">Proposed New Schedule (Optional)</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#002045] mb-2">Select Date</label>
                                    <input 
                                        type="date" 
                                        min={new Date().toLocaleDateString('en-CA')}
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium"
                                        value={newProposedDate}
                                        onChange={(e) => {
                                            setNewProposedDate(e.target.value);
                                            setNewProposedTimeSlot('');
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#002045] mb-2">Time Slot <span className="text-rose-500">*</span></label>
                                    <select 
                                        required
                                        className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium disabled:bg-[#f1f4f6] disabled:text-[#74777f]"
                                        value={newProposedTimeSlot}
                                        onChange={(e) => {
                                            setNewProposedTimeSlot(e.target.value);
                                        }}
                                        disabled={!newProposedDate}
                                    >
                                        <option value="" disabled hidden>Select slot...</option>
                                        {[
                                            { label: 'Slot 1 (07:30 - 09:30)', startTime: '07:30', value: '07:30 - 09:30' },
                                            { label: 'Slot 2 (09:30 - 11:30)', startTime: '09:30', value: '09:30 - 11:30' },
                                            { label: 'Slot 3 (13:30 - 15:30)', startTime: '13:30', value: '13:30 - 15:30' },
                                            { label: 'Slot 4 (15:30 - 17:30)', startTime: '15:30', value: '15:30 - 17:30' },
                                            { label: 'Slot 5 (18:00 - 20:00)', startTime: '18:00', value: '18:00 - 20:00' },
                                            { label: 'Slot 6 (20:00 - 22:00)', startTime: '20:00', value: '20:00 - 22:00' }
                                        ].filter(slot => {
                                            const todayStr = new Date().toLocaleDateString('en-CA');
                                            if (newProposedDate === todayStr) {
                                                const slotStartTime = slot.startTime;
                                                const now = new Date();
                                                const currentHours = now.getHours();
                                                const currentMinutes = now.getMinutes();
                                                const slotHours = parseInt(slotStartTime.split(':')[0], 10);
                                                const slotMinutes = parseInt(slotStartTime.split(':')[1], 10);
                                                
                                                if (currentHours > slotHours || (currentHours === slotHours && currentMinutes >= slotMinutes)) {
                                                    return false;
                                                }
                                            }
                                            const selectedSessionData = upcomingSessions.find(s => s.sessionId === newClassSession);
                                            const sDateStr = selectedSessionData?.date ? `${selectedSessionData.date.getFullYear()}-${String(selectedSessionData.date.getMonth() + 1).padStart(2, '0')}-${String(selectedSessionData.date.getDate()).padStart(2, '0')}` : null;
                                            const isSameDay = sDateStr === newProposedDate;
                                            return !(isSameDay && slot.startTime === selectedSessionData?.startTime);
                                        }).map(slot => (
                                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="text-sm text-[#74777f]">Leave Date blank if you want staff to arrange a time for you.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-[#002045] mb-2">Reason <span className="text-rose-500">*</span></label>
                        <textarea 
                            required
                            rows={2} 
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            placeholder="Please provide a detailed reason..." 
                            className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] resize-none text-sm"
                        ></textarea>
                    </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 p-5 border-t border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0061a5] hover:bg-[#004a80] transition-colors shadow-sm flex items-center gap-2">
                            <Send className="w-4 h-4" /> Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
