import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Room } from '../types/classroom';
import { ClassroomsService } from '../services/classrooms.service';
import { ClassroomFilters } from '../components/ClassroomFilters';
import { ClassroomsTable } from '../components/ClassroomsTable';
import { ClassroomFormModal } from '../components/ClassroomFormModal';

const AdminClassrooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // CRUD Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({
        name: '',
        capacity: 30,
        status: 'Available'
    });

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            const data = await ClassroomsService.getClassrooms();
            setRooms(data);
            setLoading(false);
        };
        fetchRooms();
    }, []);

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

    const handleSave = async () => {
        if (editingId) {
            const updated = await ClassroomsService.updateClassroom(editingId, formData);
            setRooms(rooms.map(r => r.id === editingId ? updated : r));
        } else {
            const created = await ClassroomsService.createClassroom(formData);
            setRooms([...rooms, created]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            const success = await ClassroomsService.deleteClassroom(id);
            if (success) {
                setRooms(rooms.filter(r => r.id !== id));
            }
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

            <ClassroomFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <ClassroomsTable 
                    rooms={filteredRooms} 
                    handleOpenModal={handleOpenModal} 
                    handleDelete={handleDelete} 
                />
            )}

            {isModalOpen && (
                <ClassroomFormModal 
                    editingId={editingId}
                    formData={formData}
                    setFormData={setFormData}
                    handleCloseModal={handleCloseModal}
                    handleSave={handleSave}
                />
            )}
        </div>
    );
};

export default AdminClassrooms;
