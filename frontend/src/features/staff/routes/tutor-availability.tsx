import { useState, useEffect } from 'react';
import { Lock, Unlock, Users } from 'lucide-react';
import { SHIFTS, DAYS, type TutorAvailabilityProfile } from '../types/tutor-availability';
import { TutorAvailabilityService } from '../services/tutor-availability.service';
import { TutorSelector } from '../components/TutorSelector';
import { AvailabilityGrid } from '../components/AvailabilityGrid';

const StaffTutorAvailability = () => {
    const [tutors, setTutors] = useState<TutorAvailabilityProfile[]>([]);
    const [selectedTutorId, setSelectedTutorId] = useState<string>('');
    const [draftSlots, setDraftSlots] = useState<Set<string>>(new Set());
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const loadTutors = async () => {
            const data = await TutorAvailabilityService.getTutors();
            setTutors(data);
            if (data.length > 0) {
                setSelectedTutorId(data[0].id);
                setDraftSlots(new Set(data[0].slots));
            }
        };
        loadTutors();
    }, []);

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

    const handleToggleLock = async () => {
        if (!selectedTutor) return;
        const newStatus = selectedTutor.status === 'submitted' ? 'draft' : 'submitted';
        
        const updatedTutor = { ...selectedTutor, status: newStatus };
        await TutorAvailabilityService.updateTutor(updatedTutor);

        setTutors(tutors.map(t => t.id === selectedTutor.id ? updatedTutor : t));
    };

    const handleSaveChanges = async () => {
        if (!selectedTutor) return;
        
        const updatedTutor = { ...selectedTutor, slots: Array.from(draftSlots) };
        await TutorAvailabilityService.updateTutor(updatedTutor);

        setTutors(tutors.map(t => t.id === selectedTutor.id ? updatedTutor : t));
        setHasUnsavedChanges(false);
    };

    const handleDiscardChanges = () => {
        if (!selectedTutor) return;
        setDraftSlots(new Set(selectedTutor.slots));
        setHasUnsavedChanges(false);
    };

    const handleSelectTutor = (id: string) => {
        const tutor = tutors.find(t => t.id === id);
        if (tutor) {
            setSelectedTutorId(tutor.id);
            setDraftSlots(new Set(tutor.slots));
            setHasUnsavedChanges(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-400 mx-auto animate-fade-in-up space-y-6">
            
            {/* Top Bar: Tutor List */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <TutorSelector 
                    tutors={tutors} 
                    selectedTutorId={selectedTutorId} 
                    hasUnsavedChanges={hasUnsavedChanges} 
                    onSelectTutor={handleSelectTutor} 
                />

                <div className="hidden md:block w-px h-12 bg-[#e0e3e5]"></div>

                {/* Progress Stats */}
                <div className="flex-1 w-full max-w-75">
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
                            style={{ width: `${tutors.length > 0 ? (tutors.filter(t => t.status === 'submitted').length / tutors.length) * 100 : 0}%` }}
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

                        <AvailabilityGrid 
                            selectedTutor={selectedTutor} 
                            draftSlots={draftSlots} 
                            toggleSlot={toggleSlot} 
                            toggleDay={toggleDay} 
                            toggleShift={toggleShift} 
                        />

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
