import { Check } from 'lucide-react';
import { SHIFTS, DAYS } from '../services/availability.service';
import type { AvailabilityStatus } from '../types/availability';

interface AvailabilityGridProps {
    selectedSlots: Set<string>;
    status: AvailabilityStatus;
    toggleSlot: (day: string, shiftId: string) => void;
}

export const AvailabilityGrid = ({ selectedSlots, status, toggleSlot }: AvailabilityGridProps) => {
    return (
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
    );
};
