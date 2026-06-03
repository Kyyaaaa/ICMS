import { useState } from 'react';
import { CalendarClock, Check, Info, Lock, Send} from 'lucide-react';

const SHIFTS = [
    { id: 'M1', label: 'Morning 1', time: '07:30 - 09:30' },
    { id: 'M2', label: 'Morning 2', time: '09:30 - 11:30' },
    { id: 'A1', label: 'Afternoon 1', time: '13:30 - 15:30' },
    { id: 'A2', label: 'Afternoon 2', time: '15:30 - 17:30' },
    { id: 'E1', label: 'Evening 1', time: '18:00 - 20:00' },
    { id: 'E2', label: 'Evening 2', time: '20:00 - 22:00' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityRegistration = () => {
    const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set([
        'Monday-E1', 'Wednesday-E1', 'Friday-E1', 'Saturday-M1', 'Saturday-M2'
    ]));
    // 'draft' = Tutor can edit. 'submitted' = Locked from editing.
    const [status, setStatus] = useState<'draft' | 'submitted'>('draft');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleSlot = (day: string, shiftId: string) => {
        if (status === 'submitted') return;
        
        const slotKey = `${day}-${shiftId}`;
        const newSlots = new Set(selectedSlots);
        if (newSlots.has(slotKey)) {
            newSlots.delete(slotKey);
        } else {
            newSlots.add(slotKey);
        }
        setSelectedSlots(newSlots);
    };

    const handleSubmit = () => {
        if (!confirm("Are you sure you want to submit? Once submitted, your schedule will be locked to prevent changes during the scheduling process.")) {
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setStatus('submitted');
        }, 800);
    };

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in-up space-y-[24px]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5] shrink-0">
                        <CalendarClock className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Availability Registration</h1>
                        <p className="text-[#43474e] text-[14px]">Select your available time slots for the upcoming weeks.</p>
                    </div>
                </div>
                
                {status === 'draft' ? (
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-[14px] hover:bg-[#004d80] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isSubmitting ? 'Submitting...' : 'Submit & Lock Schedule'}
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2.5 bg-[#f0f4f8] text-[#43474e] rounded-lg font-bold text-[14px] flex items-center gap-2 border border-[#c4c6cf]">
                            <Lock className="w-4 h-4" />
                            Locked (Submitted)
                        </div>
                    </div>
                )}
            </div>

            {/* Alert Banner */}
            {status === 'submitted' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-[14px] text-amber-900 leading-relaxed">
                        <p className="font-bold mb-1">Your availability is currently locked.</p>
                        <p>You have submitted your schedule for the upcoming period. Staff members are using this data to assign classes. To prevent scheduling conflicts, your schedule is now permanently locked. If you need to make urgent changes, please contact the Academic Staff to request an update.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#0061a5] shrink-0 mt-0.5" />
                    <p className="text-[14px] text-[#43474e] leading-relaxed">
                        Click on the blocks below to toggle your availability. Once you are finished, click <strong>"Submit & Lock Schedule"</strong>. Submitting will lock your schedule so that staff can safely assign classes without unexpected changes.
                    </p>
                </div>
            )}

            {/* Grid Container */}
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden overflow-x-auto">
                <div className="min-w-[900px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-8 border-b border-[#e0e3e5] bg-[#f7fafc]">
                        <div className="p-4 border-r border-[#e0e3e5] flex items-center justify-center">
                            <span className="text-[12px] font-bold uppercase tracking-wider text-[#74777f]">Shift / Time</span>
                        </div>
                        {DAYS.map(day => (
                            <div key={day} className="py-4 text-center border-r border-[#e0e3e5] last:border-0">
                                <span className="text-[13px] font-bold uppercase tracking-wider text-[#002045]">{day}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid Rows */}
                    <div className="divide-y divide-[#e0e3e5]">
                        {SHIFTS.map(shift => (
                            <div key={shift.id} className="grid grid-cols-8">
                                {/* Shift Info Column */}
                                <div className="p-4 border-r border-[#e0e3e5] bg-[#fdfdfd] flex flex-col justify-center items-center text-center">
                                    <span className="text-[13px] font-bold text-[#181c1e]">{shift.label}</span>
                                    <span className="text-[12px] font-medium text-[#74777f] mt-1">{shift.time}</span>
                                </div>
                                
                                {/* Days Columns */}
                                {DAYS.map(day => {
                                    const slotKey = `${day}-${shift.id}`;
                                    const isSelected = selectedSlots.has(slotKey);
                                    
                                    return (
                                        <div 
                                            key={slotKey} 
                                            onClick={() => toggleSlot(day, shift.id)}
                                            className={`
                                                border-r border-[#e0e3e5] last:border-0 p-3 
                                                flex flex-col items-center justify-center transition-all duration-200
                                                ${status === 'submitted' ? (isSelected ? 'bg-[#e6f0fa]/70 cursor-not-allowed' : 'bg-white cursor-not-allowed') : 'cursor-pointer'}
                                                ${status === 'draft' ? (isSelected ? 'bg-[#e6f0fa]' : 'bg-white hover:bg-[#f8f9fa]') : ''}
                                            `}
                                        >
                                            <div className={`
                                                w-6 h-6 rounded-md border flex items-center justify-center mb-2 transition-colors
                                                ${isSelected 
                                                    ? 'bg-[#0061a5] border-[#0061a5] text-white' 
                                                    : (status === 'draft' ? 'border-[#c4c6cf] bg-white text-transparent hover:border-[#0061a5]' : 'border-[#e0e3e5] bg-white text-transparent')
                                                }
                                            `}>
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <span className={`text-[12px] font-bold ${isSelected ? 'text-[#0061a5]' : 'text-transparent select-none'}`}>
                                                Available
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Legend / Summary */}
            <div className="flex items-center gap-6 pt-2 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#0061a5] shadow-sm" />
                    <span className="text-[14px] font-bold text-[#002045]">Available ({selectedSlots.size})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#f8f9fa] border border-[#e0e3e5]" />
                    <span className="text-[14px] font-medium text-[#43474e]">Off ({DAYS.length * SHIFTS.length - selectedSlots.size})</span>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityRegistration;
