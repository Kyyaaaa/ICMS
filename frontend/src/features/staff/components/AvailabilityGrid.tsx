import { Check, Minus } from 'lucide-react';
import { SHIFTS, DAYS, type TutorAvailabilityProfile } from '@/shared/types/tutor-availability';

interface AvailabilityGridProps {
    selectedTutor: TutorAvailabilityProfile;
    draftSlots: Set<string>;
    toggleSlot: (day: string, shiftId: string) => void;
    toggleDay: (day: string) => void;
    toggleShift: (shiftId: string) => void;
}

export const AvailabilityGrid = ({ selectedTutor, draftSlots, toggleSlot, toggleDay, toggleShift }: AvailabilityGridProps) => {
    return (
        <div className="bg-white rounded-2xl border border-[#e0e3e5] shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-225">
                {/* Header Row */}
                <div className="grid grid-cols-8 border-b border-[#e0e3e5] bg-[#f7fafc]">
                    <div className="p-4 border-r border-[#e0e3e5] flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#74777f]">Shift / Time</span>
                    </div>
                    {DAYS.map((day: string) => (
                        <div 
                            key={day} 
                            onClick={() => toggleDay(day)}
                            className="py-4 text-center border-r border-[#e0e3e5] last:border-0 cursor-pointer hover:bg-[#e0e3e5]/50 transition-colors group"
                            title="Click to toggle all slots for this day"
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-[#002045] group-hover:text-[#0061a5]">{day}</span>
                        </div>
                    ))}
                </div>

                {/* Grid Rows */}
                <div className="divide-y divide-[#e0e3e5]">
                    {SHIFTS.map((shift: any) => (
                        <div key={shift.id} className="grid grid-cols-8">
                            {/* Shift Info Column */}
                            <div 
                                onClick={() => toggleShift(shift.id)}
                                className="p-4 border-r border-[#e0e3e5] bg-[#fdfdfd] flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#e0e3e5]/50 transition-colors group"
                                title="Click to toggle all slots for this shift"
                            >
                                <span className="text-xs font-bold text-[#181c1e] group-hover:text-[#0061a5]">{shift.label}</span>
                                <span className="text-xs font-medium text-[#74777f] mt-1 group-hover:text-[#0061a5]">{shift.time}</span>
                            </div>
                            
                            {/* Days Columns */}
                            {DAYS.map((day: string) => {
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
                                        <span className={`text-xs font-bold ${textClass}`}>
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
        </div>
    );
};
