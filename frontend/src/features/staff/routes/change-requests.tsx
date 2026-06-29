import { useState, useEffect } from 'react';
import { Eye, Search, Calendar, Users, MapPin } from 'lucide-react';
import type { ChangeRequest } from '../types/change-request';
import { ChangeRequestsService } from '../services/change-requests.service';
import { ChangeRequestModal } from '../components/ChangeRequestModal';

const ChangeRequests = () => {
    const [requests, setRequests] = useState<ChangeRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    useEffect(() => {
        const loadRequests = async () => {
            const data = await ChangeRequestsService.getRequests();
            setRequests(data);
        };
        loadRequests();
    }, []);

    const handleStatusUpdate = async (
        id: string, 
        newStatus: string, 
        finalTime?: string, 
        staffNote?: string, 
        substituteTutorId?: string,
        newDate?: string,
        newSlot?: string,
        newRoomId?: string
    ) => {
        const request = requests.find(r => r.id === id);
        if (request) {
            try {
                const updatedRequest = { ...request, status: newStatus, finalTime: finalTime || request.finalTime, staffNote: staffNote };
                await ChangeRequestsService.updateRequest(updatedRequest, substituteTutorId, newDate, newSlot, newRoomId);
                setRequests(requests.map(r => r.id === id ? updatedRequest : r));
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to update status. Please try again.");
            }
        }
        setSelectedRequest(null);
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.tutor.toLowerCase().includes(searchTerm.toLowerCase()) || r.className.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        const matchesType = typeFilter === 'All' || r.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#002045]">Schedule Change Requests</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search tutor or class..." 
                            className="pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg w-62.5 focus:ring-2 focus:ring-[#0061a5] focus:outline-none" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061a5] font-medium bg-white text-[#181c1e]"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Reschedule">Reschedule</option>
                        <option value="Substitute">Substitute</option>
                    </select>
                    <select 
                        className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061a5] font-medium bg-white text-[#181c1e]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                        <tr>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Tutor</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Class & Session</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Request Type</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Submitted Date</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-[#74777f] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(item => (
                            <tr key={item.id} className="border-b border-[#e0e3e5] hover:bg-gray-50">
                                <td className="p-4 font-bold text-[#002045]">{item.tutor}</td>
                                <td className="p-4">
                                    <div className="font-semibold text-[#43474e]">{item.className}</div>
                                    <div className="text-sm text-gray-500">Session {item.session}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1.5 text-sm font-semibold ${
                                        item.type?.toLowerCase() === 'reschedule' ? 'text-[#0061a5]' : 
                                        (item.type?.toLowerCase() === 'substitute tutor' || item.type?.toLowerCase() === 'substitute') ? 'text-purple-600' :
                                        'text-[#16a34a]'
                                    }`}>
                                        {item.type?.toLowerCase() === 'reschedule' ? <Calendar className="w-4 h-4"/> : 
                                         (item.type?.toLowerCase() === 'substitute tutor' || item.type?.toLowerCase() === 'substitute') ? <Users className="w-4 h-4"/> : 
                                         <MapPin className="w-4 h-4"/>} 
                                        {item.type?.toLowerCase() === 'reschedule' ? 'Reschedule' : 
                                         (item.type?.toLowerCase() === 'substitute tutor' || item.type?.toLowerCase() === 'substitute') ? 'Substitute' : 
                                         'Change Room'}
                                    </span>
                                </td>
                                <td className="p-4 text-[#74777f]">{item.submittedAt}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                        item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                        (item.status === 'Cancelled' || item.status === 'Canceled') ? 'bg-gray-100 text-gray-600' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => setSelectedRequest(item)}
                                        className="text-[#0061a5] hover:bg-[#f0f7ff] px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-end gap-1 ml-auto"
                                    >
                                        <Eye className="w-4 h-4"/> View Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Detail Modal */}
            {selectedRequest && (
                <ChangeRequestModal 
                    request={selectedRequest} 
                    onClose={() => setSelectedRequest(null)} 
                    onUpdateStatus={handleStatusUpdate} 
                />
            )}
        </div>
    );
};
export default ChangeRequests;
