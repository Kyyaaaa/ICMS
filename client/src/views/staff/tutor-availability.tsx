import { useState } from 'react';
import { Search, Check, Lock, Unlock, Users, ChevronDown, Minus } from 'lucide-react';

const SHIFTS = [
    { id: 'M1', label: 'Morning 1', time: '07:30 - 09:30' },
    { id: 'M2', label: 'Morning 2', time: '09:30 - 11:30' },
    { id: 'A1', label: 'Afternoon 1', time: '13:30 - 15:30' },
    { id: 'A2', label: 'Afternoon 2', time: '15:30 - 17:30' },
    { id: 'E1', label: 'Evening 1', time: '18:00 - 20:00' },
    { id: 'E2', label: 'Evening 2', time: '20:00 - 22:00' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MOCK_TUTORS = [
    { id: 'T001', name: 'John Doe', status: 'submitted', slots: ['Monday-E1', 'Wednesday-E1', 'Friday-E1', 'Saturday-M1', 'Saturday-M2'] },
    { id: 'T002', name: 'Jane Smith', status: 'draft', slots: ['Tuesday-A1', 'Thursday-A1'] },
    { id: 'T003', name: 'Emily Chen', status: 'submitted', slots: ['Monday-M1', 'Wednesday-M1', 'Friday-M1'] },
    { id: 'T004', name: 'Michael Brown', status: 'submitted', slots: ['Saturday-E1', 'Saturday-E2', 'Sunday-E1', 'Sunday-E2'] },
];

const StaffTutorAvailability = () => {
    const [tutors, setTutors] = useState(MOCK_TUTORS);
    const [selectedTutorId, setSelectedTutorId] = useState<string>(MOCK_TUTORS[0].id);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [draftSlots, setDraftSlots] = useState<Set<string>>(new Set(MOCK_TUTORS[0].slots));
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const selectedTutor = tutors.find(t => t.id === selectedTutorId);

    const toggleSlot = (day: string, shiftId: string) => {
        if (!selectedTutor) return;
        
        const slotKey = `${day}-${shiftId}`;
        const newSlots = new Set(draftSlots);
        if (newSlots.has(slotKey)) {
            newSlots.delete(slotKey);
        } else {
            newSlots.add(slotKey);
        }
        
        setDraftSlots(newSlots);
        setHasUnsavedChanges(true);
    };

    const toggleDay = (day: string) => {
        if (!selectedTutor) return;
        const newSlots = new Set(draftSlots);
        const daySlots = SHIFTS.map(s => `${day}-${s.id}`);
        const allSelected = daySlots.every(slot => newSlots.has(slot));
        
        if (allSelected) {
            daySlots.forEach(slot => newSlots.delete(slot));
        } else {
            daySlots.forEach(slot => newSlots.add(slot));
        }
        
        setDraftSlots(newSlots);
        setHasUnsavedChanges(true);
    };

    const toggleShift = (shiftId: string) => {
        if (!selectedTutor) return;
        const newSlots = new Set(draftSlots);
        const shiftSlots = DAYS.map(d => `${d}-${shiftId}`);
        const allSelected = shiftSlots.every(slot => newSlots.has(slot));
        
        if (allSelected) {
            shiftSlots.forEach(slot => newSlots.delete(slot));
        } else {
            shiftSlots.forEach(slot => newSlots.add(slot));
        }
        
        setDraftSlots(newSlots);
        setHasUnsavedChanges(true);
    };

    const handleToggleLock = () => {
        if (!selectedTutor) return;
        const newStatus = selectedTutor.status === 'submitted' ? 'draft' : 'submitted';
        
        setTutors(tutors.map(t => 
            t.id === selectedTutor.id 
                ? { ...t, status: newStatus }
                : t
        ));
    };

    const handleSaveChanges = () => {
        if (!selectedTutor) return;
        setTutors(tutors.map(t => 
            t.id === selectedTutor.id 
                ? { ...t, slots: Array.from(draftSlots) }
                : t
        ));
        setHasUnsavedChanges(false);
    };

    const handleDiscardChanges = () => {
        if (!selectedTutor) return;
        setDraftSlots(new Set(selectedTutor.slots));
        setHasUnsavedChanges(false);
    };

    const filteredTutors = tutors.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in-up space-y-6">
            
            {/* Top Bar: Tutor List */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-30">
                {/* Custom Dropdown for Tutor Selection */}
                <div className="relative w-full md:w-[400px]">
                    <span className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-1.5 block">Select Tutor</span>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-[#c4c6cf] hover:border-[#0061a5] bg-white transition-colors text-left"
                    >
                        {selectedTutor ? (
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#e3f2fd] text-[#0061a5] flex items-center justify-center font-bold text-[13px]">
                                    {selectedTutor.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-[14px] text-[#002045] leading-none mb-1">{selectedTutor.name}</div>
                                    <div className="flex items-center gap-1.5">
                                        {selectedTutor.status === 'submitted' ? (
                                            <Lock className="w-3 h-3 text-amber-600" />
                                        ) : (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#c4c6cf]"></span>
                                        )}
                                        <span className={`text-[11px] font-bold ${selectedTutor.status === 'submitted' ? 'text-amber-700' : 'text-[#74777f]'}`}>
                                            {selectedTutor.status === 'submitted' ? 'Locked' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-[#74777f]">Select a tutor...</span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-[#74777f] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[450px] bg-white border border-[#e0e3e5] rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
                                <div className="p-3 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                                        <input 
                                            type="text" 
                                            autoFocus
                                            placeholder="Search tutors by name..." 
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] outline-none text-[13px]"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#c4c6cf] p-2 space-y-1">
                                    {filteredTutors.length > 0 ? (
                                        filteredTutors.sort((a) => a.status === 'submitted' ? -1 : 1).map(tutor => {
                                            const initials = tutor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                            return (
                                                <button
                                                    key={tutor.id}
                                                    onClick={() => {
                                                        if (hasUnsavedChanges) {
                                                            if (!window.confirm('You have unsaved changes. Are you sure you want to discard them and switch tutor?')) {
                                                                return;
                                                            }
                                                        }
                                                        setSelectedTutorId(tutor.id);
                                                        setDraftSlots(new Set(tutor.slots));
                                                        setHasUnsavedChanges(false);
                                                        setIsDropdownOpen(false);
                                                        setSearchTerm('');
                                                    }}
                                                    className={`w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f0f4f8] transition-colors ${selectedTutorId === tutor.id ? 'bg-[#e6f0fa]' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] ${selectedTutorId === tutor.id ? 'bg-[#0061a5] text-white' : 'bg-[#e0e3e5] text-[#43474e]'}`}>
                                                            {initials}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className={`font-bold text-[13px] leading-none mb-1 ${selectedTutorId === tutor.id ? 'text-[#0061a5]' : 'text-[#181c1e]'}`}>
                                                                {tutor.name}
                                                            </div>
                                                            <div className="text-[11px] text-[#74777f] leading-none">{tutor.id}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        {tutor.status === 'submitted' ? (
                                                            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <Lock className="w-2.5 h-2.5" /> Locked
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] uppercase font-bold text-[#74777f] bg-[#e0e3e5] px-2 py-0.5 rounded-full">
                                                                Draft
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-6 text-[#74777f] text-[13px]">
                                            No tutors found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="hidden md:block w-px h-12 bg-[#e0e3e5]"></div>

                {/* Progress Stats */}
                <div className="flex-1 w-full max-w-[300px]">
                    <div className="flex items-center justify-between text-[13px] mb-2">
                        <span className="text-[#43474e] font-medium flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#74777f]" />
                            Submission Progress
                        </span>
                        <span className="font-bold text-[#0061a5]">{tutors.filter(t => t.status === 'submitted').length} / {tutors.length}</span>
                    </div>
                    <div className="h-2 w-full bg-[#e0e3e5] rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#0061a5] transition-all duration-500" 
                            style={{ width: `${(tutors.filter(t => t.status === 'submitted').length / tutors.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Area: Availability Grid */}
            <div className="flex-1 space-y-6 min-w-0">
                {selectedTutor ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-sm">
                            <div>
                                <h1 className="text-[24px] font-bold text-[#002045] flex items-center gap-3">
                                    {selectedTutor.name}
                                    <span className={`text-[12px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${selectedTutor.status === 'submitted' ? 'bg-amber-100 text-amber-800' : 'bg-[#e0e3e5] text-[#43474e]'}`}>
                                        {selectedTutor.status === 'submitted' ? 'LOCKED' : 'DRAFT'}
                                    </span>
                                </h1>
                                <p className="text-[#43474e] text-[13px] mt-1">Reviewing and editing availability profile for {selectedTutor.id}.</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {hasUnsavedChanges ? (
                                    <>
                                        <button 
                                            onClick={handleDiscardChanges}
                                            className="px-4 py-2 rounded-lg font-bold text-[13px] text-[#43474e] bg-white border border-[#c4c6cf] hover:bg-[#f8f9fa] transition-colors"
                                        >
                                            Discard
                                        </button>
                                        <button 
                                            onClick={handleSaveChanges}
                                            className="px-4 py-2 rounded-lg font-bold text-[13px] text-white bg-[#0061a5] hover:bg-[#004d84] shadow-sm transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleToggleLock}
                                        className={`px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors border ${selectedTutor.status === 'submitted' ? 'bg-white text-[#0061a5] border-[#0061a5] hover:bg-[#e3f2fd]' : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'}`}
                                    >
                                        {selectedTutor.status === 'submitted' ? (
                                            <>
                                                <Unlock className="w-4 h-4" />
                                                Unlock for Tutor
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                Lock Schedule
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {selectedTutor.status === 'submitted' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                                <div className="text-[14px] text-amber-900">
                                    <p className="font-bold mb-1">Tutor has submitted their availability.</p>
                                    <p>As a staff member, you can override and click on cells to edit their schedule if necessary, or you can click <strong>"Unlock for Tutor"</strong> to return control to the tutor.</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden overflow-x-auto">
                            <div className="min-w-[900px]">
                                {/* Header Row */}
                                <div className="grid grid-cols-8 border-b border-[#e0e3e5] bg-[#f7fafc]">
                                    <div className="p-4 border-r border-[#e0e3e5] flex items-center justify-center">
                                        <span className="text-[12px] font-bold uppercase tracking-wider text-[#74777f]">Shift / Time</span>
                                    </div>
                                    {DAYS.map(day => (
                                        <div 
                                            key={day} 
                                            onClick={() => toggleDay(day)}
                                            className="py-4 text-center border-r border-[#e0e3e5] last:border-0 cursor-pointer hover:bg-[#e0e3e5]/50 transition-colors group"
                                            title="Click to toggle all slots for this day"
                                        >
                                            <span className="text-[13px] font-bold uppercase tracking-wider text-[#002045] group-hover:text-[#0061a5]">{day}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Grid Rows */}
                                <div className="divide-y divide-[#e0e3e5]">
                                    {SHIFTS.map(shift => (
                                        <div key={shift.id} className="grid grid-cols-8">
                                            {/* Shift Info Column */}
                                            <div 
                                                onClick={() => toggleShift(shift.id)}
                                                className="p-4 border-r border-[#e0e3e5] bg-[#fdfdfd] flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#e0e3e5]/50 transition-colors group"
                                                title="Click to toggle all slots for this shift"
                                            >
                                                <span className="text-[13px] font-bold text-[#181c1e] group-hover:text-[#0061a5]">{shift.label}</span>
                                                <span className="text-[12px] font-medium text-[#74777f] mt-1 group-hover:text-[#0061a5]">{shift.time}</span>
                                            </div>
                                            
                                            {/* Days Columns */}
                                            {DAYS.map(day => {
                                                const slotKey = `${day}-${shift.id}`;
                                                const isOriginallySelected = selectedTutor.slots.includes(slotKey);
                                                const isSelected = draftSlots.has(slotKey);
                                                const isModified = isOriginallySelected !== isSelected;

                                                const boxClass = isSelected 
                                                    ? (isModified ? 'bg-amber-500 border-amber-500 text-white shadow-sm' : 'bg-[#0061a5] border-[#0061a5] text-white')
                                                    : (isModified ? 'border-amber-400 bg-amber-50 text-transparent hover:border-amber-500' : 'border-[#e0e3e5] bg-white text-transparent hover:border-[#0061a5]');

                                                const textClass = isSelected 
                                                    ? (isModified ? 'text-amber-600' : 'text-[#0061a5]')
                                                    : (isModified ? 'text-amber-600' : 'text-transparent select-none');

                                                const textLabel = isSelected 
                                                    ? (isModified ? 'Added *' : 'Available')
                                                    : (isModified ? 'Removed *' : 'Available');
                                                
                                                return (
                                                    <div 
                                                        key={slotKey} 
                                                        onClick={() => toggleSlot(day, shift.id)}
                                                        className={`
                                                            border-r border-[#e0e3e5] last:border-0 p-3 
                                                            flex flex-col items-center justify-center transition-colors cursor-pointer
                                                            ${isSelected ? (isModified ? 'bg-amber-50/30 hover:bg-amber-50' : 'bg-[#e6f0fa]') : (isModified ? 'bg-amber-50/10 hover:bg-amber-50/50' : 'bg-white hover:bg-[#f8f9fa]')}
                                                        `}
                                                    >
                                                        <div className={`
                                                            w-6 h-6 rounded-md border flex items-center justify-center mb-2 transition-colors
                                                            ${boxClass}
                                                        `}>
                                                            {isSelected ? <Check className="w-4 h-4" /> : (isModified ? <Minus className="w-4 h-4 text-amber-500" /> : <Check className="w-4 h-4" />)}
                                                        </div>
                                                        <span className={`text-[12px] font-bold ${textClass}`}>
                                                            {textLabel}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 px-2">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-[#0061a5] shadow-sm" />
                                <span className="text-[14px] font-bold text-[#002045]">Available ({draftSlots.size})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-white border border-[#e0e3e5]" />
                                <span className="text-[14px] font-medium text-[#43474e]">Off ({DAYS.length * SHIFTS.length - draftSlots.size})</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-[#e0e3e5] text-center flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-[#c4c6cf] mb-4" />
                        <h3 className="text-[18px] font-bold text-[#43474e]">No Tutor Selected</h3>
                        <p className="text-[#74777f] text-[14px] mt-1">Please select a tutor from the roster to view and manage their availability.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffTutorAvailability;
