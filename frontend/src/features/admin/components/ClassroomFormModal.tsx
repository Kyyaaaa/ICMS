import { X } from 'lucide-react';
import type { Room } from '../types/classroom';

interface ClassroomFormModalProps {
    editingId: string | null;
    formData: Partial<Room>;
    setFormData: (data: Partial<Room>) => void;
    handleCloseModal: () => void;
    handleSave: () => void;
}

export const ClassroomFormModal = ({
    editingId,
    formData,
    setFormData,
    handleCloseModal,
    handleSave
}: ClassroomFormModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                    <h2 className="text-[18px] font-bold text-[#002045]">{editingId ? 'Edit Classroom' : 'Add Classroom'}</h2>
                    <button onClick={handleCloseModal} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[13px] font-bold text-[#43474e] mb-1">Room Name</label>
                        <input 
                            type="text" 
                            value={formData.name || ''} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                            placeholder="e.g. Room 301"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-[13px] font-bold text-[#43474e] mb-1">Capacity</label>
                            <input 
                                type="number" 
                                value={formData.capacity || 0} 
                                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                                className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[13px] font-bold text-[#43474e] mb-1">Status</label>
                            <select 
                                value={formData.status || 'Available'} 
                                onChange={e => setFormData({...formData, status: e.target.value as 'Available' | 'Occupied' | 'Maintenance'})}
                                className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] bg-white"
                            >
                                <option value="Available">Available</option>
                                <option value="Occupied">Occupied</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                    
                    {formData.status === 'Maintenance' && (
                        <div className="animate-fade-in space-y-4 bg-[#fff8f8] p-4 rounded-xl border border-[#ffebed]">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-[5]">
                                    <label className="block text-[13px] font-bold text-[#ba1a1a] mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.maintenanceSchedule?.date || ''} 
                                        onChange={e => setFormData({...formData, maintenanceSchedule: { date: e.target.value, startTime: '', endTime: '', note: '', ...formData.maintenanceSchedule }})}
                                        className="w-full px-3 py-2 text-[14px] border border-[#ffebed] bg-white rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#181c1e] transition-colors"
                                    />
                                </div>
                                <div className="flex-[3]">
                                    <label className="block text-[13px] font-bold text-[#ba1a1a] mb-1">From</label>
                                    <input 
                                        type="time" 
                                        value={formData.maintenanceSchedule?.startTime || ''} 
                                        onChange={e => setFormData({...formData, maintenanceSchedule: { date: '', startTime: e.target.value, endTime: '', note: '', ...formData.maintenanceSchedule }})}
                                        className="w-full px-3 py-2 text-[14px] border border-[#ffebed] bg-white rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#181c1e] transition-colors"
                                    />
                                </div>
                                <div className="flex-[3]">
                                    <label className="block text-[13px] font-bold text-[#ba1a1a] mb-1">To</label>
                                    <input 
                                        type="time" 
                                        value={formData.maintenanceSchedule?.endTime || ''} 
                                        onChange={e => setFormData({...formData, maintenanceSchedule: { date: '', startTime: '', endTime: e.target.value, note: '', ...formData.maintenanceSchedule }})}
                                        className="w-full px-3 py-2 text-[14px] border border-[#ffebed] bg-white rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#181c1e] transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-[#ba1a1a] mb-1">Maintenance Note</label>
                                <input 
                                    type="text" 
                                    value={formData.maintenanceSchedule?.note || ''} 
                                    onChange={e => setFormData({...formData, maintenanceSchedule: { date: '', startTime: '', endTime: '', note: e.target.value, ...formData.maintenanceSchedule }})}
                                    className="w-full px-3 py-2 text-[14px] border border-[#ffebed] bg-white rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#181c1e] placeholder:text-[#ba1a1a]/40 transition-colors"
                                    placeholder="e.g. AC Repair"
                                />
                                <p className="text-[12px] text-[#ba1a1a] mt-2 opacity-80">Staff will see this to avoid scheduling classes during this time.</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-[#e0e3e5] flex justify-end gap-2 bg-[#f7fafc]">
                    <button onClick={handleCloseModal} className="px-4 py-2 text-[14px] font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-[14px] font-bold text-white bg-[#0061a5] hover:bg-[#004d80] rounded-xl transition-colors">Save Room</button>
                </div>
            </div>
        </div>
    );
};
