import { useState, useEffect } from 'react';
import { Lock, Unlock, Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { SHIFTS, DAYS, type TutorAvailabilityProfile } from '../types/tutor-availability';
import { TutorAvailabilityService, type AvailabilityCycle } from '../services/tutor-availability.service';
import { TutorSelector } from '../components/TutorSelector';
import { AvailabilityGrid } from '../components/AvailabilityGrid';

const StaffTutorAvailability = () => {
    const [tutors, setTutors] = useState<TutorAvailabilityProfile[]>([]);
    const [selectedTutorId, setSelectedTutorId] = useState<string>('');
    const [draftSlots, setDraftSlots] = useState<Set<string>>(new Set());
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLocking, setIsLocking] = useState(false);

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentCycle, setCurrentCycle] = useState<AvailabilityCycle | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                
                const cycle = await TutorAvailabilityService.getCycleByMonth(month, year);
                setCurrentCycle(cycle);

                const data = await TutorAvailabilityService.getTutors(cycle.id);
                setTutors(data);
                setSelectedTutorId((prevId) => {
                    if (prevId) {
                        const tutorInNewCycle = data.find(t => t.id === prevId);
                        if (tutorInNewCycle) {
                            setDraftSlots(new Set(tutorInNewCycle.slots));
                            return prevId;
                        }
                    }
                    setDraftSlots(new Set());
                    return '';
                });
                
                setHasUnsavedChanges(false);
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        loadData();
    }, [currentDate]);

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
        if (!selectedTutor || !currentCycle) return;
        setIsLocking(true);
        try {
            const newStatus = selectedTutor.status === 'submitted' ? 'draft' : 'submitted';
            const updatedTutor = { ...selectedTutor, status: newStatus };
            await TutorAvailabilityService.updateTutor(currentCycle.id, updatedTutor);
            setTutors(tutors.map(t => t.id === selectedTutor.id ? updatedTutor : t));
        } finally {
            setIsLocking(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedTutor || !currentCycle) return;
        setIsSaving(true);
        try {
            const updatedTutor = { ...selectedTutor, slots: Array.from(draftSlots) };
            await TutorAvailabilityService.updateTutor(currentCycle.id, updatedTutor);
            setTutors(tutors.map(t => t.id === selectedTutor.id ? updatedTutor : t));
            setHasUnsavedChanges(false);
        } finally {
            setIsSaving(false);
        }
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

    const handleToggleCycleStatus = async () => {
        if (!currentCycle) return;
        
        setIsLocking(true);
        try {
            const newStatus = currentCycle.status === 'OPEN' ? 'SCHEDULING' : 'OPEN';
            const updatedCycle = await TutorAvailabilityService.updateCycleStatus(currentCycle.id, newStatus);
            setCurrentCycle(updatedCycle);
        } catch (error) {
            console.error('Failed to update cycle status', error);
            alert('Lỗi: Không thể thay đổi trạng thái.');
        } finally {
            setIsLocking(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-400 mx-auto animate-fade-in-up space-y-6">
            
            {/* Cycle Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5] shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[#002045]">
                            Manage Tutor Availability
                        </h1>
                        <p className="text-[#43474e] text-sm">
                            Select an availability cycle to view and manage.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1 bg-white border border-[#c4c6cf] rounded-lg p-1 shadow-sm">
                        <button 
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                            className="p-1.5 text-[#43474e] hover:bg-[#f0f4f8] rounded-md transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="px-2 py-1.5 text-sm font-bold text-[#002045] min-w-35 text-center flex items-center justify-center gap-2 max-w-full">
                            <span>{currentDate.toLocaleString('default', { month: 'long' })} - {currentDate.getFullYear()}</span>
                            {currentCycle && (
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                    currentCycle.status === 'ACTIVE' ? 'bg-[#e3f2fd] text-[#0061a5]' : 
                                    currentCycle.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    {currentCycle.status}
                                </span>
                            )}
                        </div>
                        
                        <button 
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                            className="p-1.5 text-[#43474e] hover:bg-[#f0f4f8] rounded-md transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Staff Lock/Unlock Action */}
                    {currentCycle && (currentCycle.status === 'OPEN' || currentCycle.status === 'SCHEDULING') && (
                        <button
                            onClick={handleToggleCycleStatus}
                            disabled={isLocking}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed ${
                                currentCycle.status === 'OPEN' 
                                ? 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50' 
                                : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
                            }`}
                        >
                            {isLocking ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : currentCycle.status === 'OPEN' ? (
                                <Lock className="w-4 h-4" />
                            ) : (
                                <Unlock className="w-4 h-4" />
                            )}
                            {currentCycle.status === 'OPEN' ? 'Lock Registration' : 'Unlock Registration'}
                        </button>
                    )}
                </div>
            </div>

            {/* Unified Top Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <TutorSelector  
                    tutors={tutors} 
                    selectedTutorId={selectedTutorId} 
                    hasUnsavedChanges={hasUnsavedChanges} 
                    onSelectTutor={handleSelectTutor} 
                />

                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-end gap-6 w-full">
                    {selectedTutor && (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {hasUnsavedChanges ? (
                                <>
                                    <button 
                                        onClick={handleDiscardChanges}
                                        className="px-4 py-2 rounded-lg font-bold text-xs text-[#43474e] bg-white border border-[#c4c6cf] hover:bg-[#f8f9fa] transition-colors"
                                    >
                                        Discard
                                    </button>
                                    <button 
                                        onClick={handleSaveChanges}
                                        disabled={isSaving}
                                        className="px-4 py-2 rounded-lg font-bold text-xs text-white bg-[#0061a5] hover:bg-[#004d84] shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleToggleLock}
                                    disabled={isLocking}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors border disabled:opacity-70 disabled:cursor-not-allowed ${selectedTutor.status === 'submitted' ? 'bg-white text-[#0061a5] border-[#0061a5] hover:bg-[#e3f2fd]' : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'}`}
                                >
                                    {isLocking ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : selectedTutor.status === 'submitted' ? (
                                        <Unlock className="w-4 h-4" />
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
                                    {isLocking ? (selectedTutor.status === 'submitted' ? 'Unlocking...' : 'Locking...') : (selectedTutor.status === 'submitted' ? 'Unlock for Tutor' : 'Lock Schedule')}
                                </button>
                            )}
                        </div>
                    )}

                    <div className="hidden md:block w-px h-12 bg-[#e0e3e5]"></div>

                    {/* Progress Stats */}
                    <div className="w-full md:w-48 shrink-0">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-[#43474e] font-medium flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#74777f]" />
                                Progress
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
            </div>

            {/* Right Area: Availability Grid */}
            <div className="flex-1 space-y-6 min-w-0">
                {selectedTutor ? (
                    <>

                        {selectedTutor.status === 'submitted' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-900">
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
                                <span className="text-sm font-bold text-[#002045]">Available ({draftSlots.size})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-white border border-[#e0e3e5]" />
                                <span className="text-sm font-medium text-[#43474e]">Off ({DAYS.length * SHIFTS.length - draftSlots.size})</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-[#e0e3e5] text-center flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-[#c4c6cf] mb-4" />
                        <h3 className="text-lg font-bold text-[#43474e]">No Tutor Selected</h3>
                        <p className="text-[#74777f] text-sm mt-1">Please select a tutor from the roster to view and manage their availability.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffTutorAvailability;
