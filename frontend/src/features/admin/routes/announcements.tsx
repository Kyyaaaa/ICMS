import { showAlertModal, showConfirmModal } from '@/utils/modal';
import { useState, useEffect } from 'react';
import { Megaphone, Plus, Filter, Search } from 'lucide-react';
import type { Announcement, AudienceScope } from '../types/announcement';
import { AnnouncementsService } from '../services/announcements.service';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { AnnouncementFormModal } from '../components/AnnouncementFormModal';

const mockClasses = [
    { id: 'c1', name: 'Math 101 - Fall 2026' },
    { id: 'c2', name: 'Physics 201 - Fall 2026' },
    { id: 'c3', name: 'Chemistry 101 - Fall 2026' },
    { id: 'c4', name: 'English 102 - Fall 2026' },
];

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | undefined>(undefined);

    const [filterScope, setFilterScope] = useState<'All' | AudienceScope>('All');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Published' | 'Scheduled'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            const data = await AnnouncementsService.getAnnouncements();
            setAnnouncements(data);
            setLoading(false);
        };
        fetchAnnouncements();
    }, []);

    const handleOpenModal = (mode: 'create' | 'edit', ann?: Announcement) => {
        setModalMode(mode);
        setSelectedAnnouncement(ann);
        setIsModalOpen(true);
    };

    const handleActualSave = async (formData: Omit<Announcement, 'id' | 'date' | 'status'> & { publishMode: 'now' | 'schedule' }) => {
        const isConfirmed = await showConfirmModal('Confirm Update', 'Are you sure you want to save this announcement?', 'warning');
        if (!isConfirmed) return;

        if (formData.publishMode === 'schedule' && !formData.scheduledFor) {
            showAlertModal('Notification', "Please select a date and time for the scheduled announcement.", 'info');
            return;
        }

        const finalAudience = { ...formData.audience };
        if (finalAudience.scope === 'System Wide') {
            finalAudience.roles = [];
            finalAudience.classes = [];
        } else if (finalAudience.scope === 'Specific Roles') {
            finalAudience.classes = [];
        } else if (finalAudience.scope === 'Specific Classes') {
            finalAudience.roles = [];
        }

        if (modalMode === 'create') {
            const newAnn = await AnnouncementsService.createAnnouncement({
                title: formData.title,
                content: formData.content,
                audience: finalAudience,
                scheduledFor: formData.publishMode === 'schedule' ? formData.scheduledFor : undefined
            });
            setAnnouncements([newAnn, ...announcements]);
        } else if (selectedAnnouncement) {
            const updatedAnn = await AnnouncementsService.updateAnnouncement({
                id: selectedAnnouncement.id,
                title: formData.title,
                content: formData.content,
                audience: finalAudience,
                scheduledFor: formData.publishMode === 'schedule' ? formData.scheduledFor : undefined
            });
            setAnnouncements(announcements.map(ann => ann.id === updatedAnn.id ? updatedAnn : ann));
        }

        setIsModalOpen(false);
        setSelectedAnnouncement(undefined);
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await showConfirmModal('Confirm Delete', 'Are you sure you want to delete this announcement?', 'warning');
        if (isConfirmed) {
            await AnnouncementsService.deleteAnnouncement(id);
            setAnnouncements(announcements.filter(ann => ann.id !== id));
        }
    };

    const filteredAnnouncements = announcements.filter(ann => {
        const matchScope = filterScope === 'All' || ann.audience.scope === filterScope;
        const matchStatus = filterStatus === 'All' || ann.status === filterStatus;
        const query = searchQuery.toLowerCase();
        const matchSearch = ann.title.toLowerCase().includes(query) || ann.content.toLowerCase().includes(query);
        return matchScope && matchStatus && matchSearch;
    });

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">System Announcements</h1>
                    <p className="text-[#43474e] text-sm mt-1">Broadcast important information across the platform or to specific groups.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center gap-2 bg-[#0061a5] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    New Announcement
                </button>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-4 rounded-2xl shadow-sm border border-[#e0e3e5] gap-4">
                <div className="relative w-full lg:w-100">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#74777f]" />
                    <input 
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors"
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-5 h-5 text-[#74777f]" />
                        <select 
                            value={filterScope}
                            onChange={e => setFilterScope(e.target.value as 'All' | AudienceScope)}
                            className="px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer w-full sm:w-auto"
                        >
                            <option value="All">All Scopes</option>
                            <option value="System Wide">System Wide</option>
                            <option value="Specific Roles">Specific Roles</option>
                            <option value="Specific Classes">Specific Classes</option>
                        </select>
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as 'All' | 'Published' | 'Scheduled')}
                        className="px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer w-full sm:w-auto"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAnnouncements.length > 0 ? filteredAnnouncements.map(ann => (
                        <AnnouncementCard 
                            key={ann.id}
                            announcement={ann}
                            mockClasses={mockClasses}
                            onEdit={(ann) => handleOpenModal('edit', ann)}
                            onDelete={handleDelete}
                        />
                    )) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-12 text-center text-[#74777f]">
                            <Megaphone size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-base font-bold text-[#181c1e]">No announcements found.</p>
                            <p className="text-sm mt-1">Try changing your filter or create a new announcement.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <AnnouncementFormModal 
                    mode={modalMode}
                    initialData={selectedAnnouncement}
                    mockClasses={mockClasses}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleActualSave}
                />
            )}
        </div>
    );
};

export default AdminAnnouncements;
