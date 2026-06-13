import { MapPin, Edit, Trash2 } from 'lucide-react';
import type { Room } from '../types/classroom';

interface ClassroomsTableProps {
    rooms: Room[];
    handleOpenModal: (room?: Room) => void;
    handleDelete: (id: string) => void;
}

export const ClassroomsTable = ({ rooms, handleOpenModal, handleDelete }: ClassroomsTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-150">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-3 px-4 text-xs font-semibold text-[#43474e]">Room Name</th>
                            <th className="py-3 px-4 text-xs font-semibold text-[#43474e]">Capacity</th>
                            <th className="py-3 px-4 text-xs font-semibold text-[#43474e]">Status</th>
                            <th className="py-3 px-4 text-xs font-semibold text-[#43474e] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc] group">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="font-bold text-[#181c1e]">{room.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-[#43474e] font-medium">{room.capacity} Students</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase inline-block ${
                                        room.status === 'Available' ? 'bg-[#e6f4ea] text-[#137333]' : 
                                        room.status === 'Occupied' ? 'bg-[#fff0db] text-[#b35f00]' : 
                                        'bg-[#ffebed] text-[#ba1a1a]'
                                    }`}>
                                        {room.status}
                                    </span>
                                    {room.status === 'Maintenance' && room.maintenanceSchedule && (
                                        <div className="text-xs text-[#74777f] mt-1 line-clamp-1" title={`${room.maintenanceSchedule.date} ${room.maintenanceSchedule.startTime}-${room.maintenanceSchedule.endTime}: ${room.maintenanceSchedule.note}`}>
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
                        {rooms.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-[#74777f]">No rooms found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
