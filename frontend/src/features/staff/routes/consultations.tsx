import { formatDate } from "../../../shared/utils/date";
import { useState, useEffect, useCallback } from 'react';
import { Eye, Search } from 'lucide-react';
import type { ConsultationRequest } from '../types/consultation';
import { ConsultationsService } from '../services/consultations.service';
import { ConsultationModal } from '../components/ConsultationModal';
import { showAlertModal } from '@/utils/modal';
import { Pagination } from '@/shared/components/common/Pagination';

const ConsultationList = () => {
    const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 10;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await ConsultationsService.getConsultations({
                status: statusFilter,
                page: currentPage,
                limit: limit
            });
            setConsultations(response.data);
            setTotalItems(response.total);
        } catch (error) {
            console.error(error);
            showAlertModal('Error', 'Cannot load consultation requests.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleSave = async (id: string, status: string, call_notes: string) => {
        try {
            await ConsultationsService.updateConsultation(id, { status, call_notes });
            setSelectedConsultation(null);
            loadData(); // Reload to get fresh data and updated staff assignment
        } catch (error: unknown) {
            console.error(error);
            const err = error as { response?: { status?: number } };
            if (err?.response?.status === 409) {
                showAlertModal('Conflict', 'This request has been taken by another staff.', 'error');
                setSelectedConsultation(null);
                loadData(); // Refresh the list
            } else {
                showAlertModal('Error', 'An error occurred while updating the request.', 'error');
            }
        }
    };

    const filteredConsultations = consultations.filter(c => {
        const name = c.guest_name || '';
        const phone = c.guest_phone || '';
        // Status is already filtered on backend, just filter local search term
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || phone.includes(searchTerm);
    });

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#002045]">Consultation Requests</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or phone..." 
                            className="pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg w-75 focus:ring-2 focus:ring-[#0061a5] focus:outline-none" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061a5] font-medium bg-white text-[#181c1e]"
                        value={statusFilter}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                        <tr>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Guest Name</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Phone</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Email</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Submitted Date</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : filteredConsultations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No consultation requests found.</td>
                            </tr>
                        ) : (
                            filteredConsultations.map(item => (
                                <tr key={item.id} className="border-b border-[#e0e3e5] hover:bg-gray-50">
                                    <td className="p-4 font-bold text-[#002045]">{item.guest_name}</td>
                                    <td className="p-4 text-[#43474e]">{item.guest_phone}</td>
                                    <td className="p-4 text-[#43474e]">{item.guest_email || '-'}</td>
                                    <td className="p-4 text-[#74777f]">{formatDate(item.created_at)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            item.status === 'Pending' ? 'bg-blue-100 text-[#0061a5]' : 
                                            item.status === 'Contacted' ? 'bg-amber-100 text-amber-700' : 
                                            item.status === 'Converted' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => setSelectedConsultation(item)}
                                            className="text-[#0061a5] hover:bg-[#f0f7ff] px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-end gap-1 ml-auto"
                                        >
                                            <Eye className="w-4 h-4"/> View Detail
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalItems > limit && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onPageChange={setCurrentPage}
                    itemName="consultations"
                />
            )}

            {selectedConsultation && (
                <ConsultationModal 
                    consultation={selectedConsultation} 
                    onClose={() => setSelectedConsultation(null)} 
                    onSave={handleSave} 
                />
            )}
        </div>
    );
};
export default ConsultationList;
