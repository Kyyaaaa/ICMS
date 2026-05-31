import React, { useState } from 'react';
import { MonitorPlay, Search, Plus, MapPin, Edit, Trash2, X } from 'lucide-react';

export interface Room {
    id: string;
    name: string;
    capacity: number;
    status: 'Available' | 'Maintenance' | 'Occupied';
    maintenanceSchedule?: {
        date: string;
        startTime: string;
        endTime: string;
        note: string;
    };
}

const AdminClassrooms = () => {
    const [rooms, setRooms] = useState<Room[]>([
        { id: '1', name: 'Room 301', capacity: 30, status: 'Available' },
        { id: '2', name: 'Room 302', capacity: 30, status: 'Occupied' },
        { id: '3', name: 'Room 303', capacity: 25, status: 'Available' },
        { id: '4', name: 'Room 401', capacity: 40, status: 'Maintenance', maintenanceSchedule: { date: '2024-10-12', startTime: '14:00', endTime: '18:00', note: 'AC Repair' } },
        { id: '5', name: 'Room 402', capacity: 35, status: 'Available' },
        { id: '6', name: 'Room 501', capacity: 50, status: 'Available' },
        { id: '7', name: 'Room 502', capacity: 20, status: 'Available' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // CRUD Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({
        name: '',
        capacity: 30,
        status: 'Available'
    });

    const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleOpenModal = (room?: Room) => {
        if (room) {
            setEditingId(room.id);
            setFormData(room);
        } else {
            setEditingId(null);
            setFormData({ name: '', capacity: 30, status: 'Available' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        if (editingId) {
            setRooms(rooms.map(r => r.id === editingId ? { ...r, ...formData } as Room : r));
        } else {
            const newRoom: Room = {
                id: Date.now().toString(),
                name: formData.name || 'New Room',
                capacity: formData.capacity || 30,
                status: formData.status as 'Available' | 'Maintenance' | 'Occupied' || 'Available',
                maintenanceSchedule: formData.status === 'Maintenance' ? formData.maintenanceSchedule : undefined
            };
            setRooms([...rooms, newRoom]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Manage Classrooms</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#004d80] transition-colors">
                    <Plus size={20} />
                    Add Classroom
                </button>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input 
                        className="pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" 
                        placeholder="Search rooms by name..." 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-3 px-4 text-[13px] font-semibold text-[#43474e]">Room Name</th>
                                <th className="py-3 px-4 text-[13px] font-semibold text-[#43474e]">Capacity</th>
                                <th className="py-3 px-4 text-[13px] font-semibold text-[#43474e]">Status</th>
                                <th className="py-3 px-4 text-[13px] font-semibold text-[#43474e] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRooms.map(room => (
                                <tr key={room.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc] group">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                                                <MapPin size={16} />
                                            </div>
                                            <span className="font-bold text-[#181c1e]">{room.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[14px] text-[#43474e] font-medium">{room.capacity} Students</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-[11px] font-bold rounded uppercase inline-block ${
                                            room.status === 'Available' ? 'bg-[#e6f4ea] text-[#137333]' : 
                                            room.status === 'Occupied' ? 'bg-[#fff0db] text-[#b35f00]' : 
                                            'bg-[#ffebed] text-[#ba1a1a]'
                                        }`}>
                                            {room.status}
                                        </span>
                                        {room.status === 'Maintenance' && room.maintenanceSchedule && (
                                            <div className="text-[12px] text-[#74777f] mt-1 line-clamp-1" title={`${room.maintenanceSchedule.date} ${room.maintenanceSchedule.startTime}-${room.maintenanceSchedule.endTime}: ${room.maintenanceSchedule.note}`}>
                                                {room.maintenanceSchedule.date}, {room.maintenanceSchedule.startTime} - {room.maintenanceSchedule.endTime} ({room.maintenanceSchedule.note})
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => handleOpenModal(room)} className="p-1.5 text-[#43474e] hover:bg-[#e0e3e5] rounded transition-colors" title="Edit"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(room.id)} className="p-1.5 text-[#ba1a1a] hover:bg-[#ffebed] rounded transition-colors" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRooms.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-[#74777f]">No rooms found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
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
                                    value={formData.name} 
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
                                        value={formData.capacity} 
                                        onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                                        className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[13px] font-bold text-[#43474e] mb-1">Status</label>
                                    <select 
                                        value={formData.status} 
                                        onChange={e => setFormData({...formData, status: e.target.value as any})}
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
                                                onChange={e => setFormData({...formData, maintenanceSchedule: { ...formData.maintenanceSchedule, date: e.target.value } as any})}
                                                className="w-full px-3 py-2 text-[14px] border border-[#ffebed] bg-white rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#181c1e] transition-colors"
                                            />
                                        </div>
                                        <div className="flex-[3]">
                                            <label className="block text-[13px] font-bold text-[#ba1a1a] mb-1">From</label>
                                            <input 
                                                type="time" 
                                                value={formData.maintenanceSchedule?.startTime || ''} 
                                                onChange={e => setFormData({...formData, maintenanceSchedule: { ...formData.maintenanceSchedule, startTime: e.target.value } as any})}
                                                className="w-full px-3 py-2 text-[14px] border border-[#ffebed] bg-white rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#181c1e] transition-colors"
                                            />
                                        </div>
                                        <div className="flex-[3]">
                                            <label className="block text-[13px] font-bold text-[#ba1a1a] mb-1">To</label>
                                            <input 
                                                type="time" 
                                                value={formData.maintenanceSchedule?.endTime || ''} 
                                                onChange={e => setFormData({...formData, maintenanceSchedule: { ...formData.maintenanceSchedule, endTime: e.target.value } as any})}
                                                className="w-full px-3 py-2 text-[14px] border border-[#ffebed] bg-white rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#181c1e] transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#ba1a1a] mb-1">Maintenance Note</label>
                                        <input 
                                            type="text" 
                                            value={formData.maintenanceSchedule?.note || ''} 
                                            onChange={e => setFormData({...formData, maintenanceSchedule: { ...formData.maintenanceSchedule, note: e.target.value } as any})}
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
            )}
        </div>
    );
};

export default AdminClassrooms;
