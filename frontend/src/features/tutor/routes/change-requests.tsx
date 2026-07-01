import { useState, useEffect } from 'react';
import { FileEdit, Plus, Search } from 'lucide-react';
import { ChangeRequestService } from '../services/change-request.service';
import type { TutorChangeRequest, CreateChangeRequestData } from '../types/change-request';
import { ChangeRequestList } from '../components/ChangeRequestList';
import { ChangeRequestDetail } from '../components/ChangeRequestDetail';
import { CreateChangeRequestForm } from '../components/CreateChangeRequestForm';

const TutorChangeRequests = () => {
    const [requests, setRequests] = useState<TutorChangeRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedRequest, setSelectedRequest] = useState<TutorChangeRequest | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            const data = await ChangeRequestService.getRequests();
            setRequests(data);
            setLoading(false);
        };
        fetchRequests();
    }, []);

    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.className.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreateRequest = async (data: CreateChangeRequestData) => {
        try {
            const newReq = await ChangeRequestService.createRequest(data);
            setRequests([newReq, ...requests]);
            setIsCreating(false);
            alert('Change request submitted successfully');
        } catch (error: any) {
            const backendError = error.response?.data?.error;
            alert(backendError || 'Failed to submit change request. Please try again.');
        }
    };

    const handleCancelRequest = async (id: string) => {
        await ChangeRequestService.cancelRequest(id);
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r));
        setSelectedRequest(null);
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5] shrink-0">
                        <FileEdit className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#002045]">My Change Requests</h1>
                        <p className="text-[#43474e] text-sm">Submit and track your schedule change requests</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004a80] transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </button>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#e0e3e5]">
                <div className="relative flex-1 max-w-sm">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search class..." 
                        className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#e0e3e5] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-2 border border-[#e0e3e5] rounded-xl focus:outline-none focus:border-[#0061a5] font-medium bg-[#f8f9fa] text-[#181c1e] text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <ChangeRequestList 
                    requests={filteredRequests} 
                    onSelectRequest={setSelectedRequest} 
                />
            )}

            {/* View Detail Modal */}
            {selectedRequest && (
                <ChangeRequestDetail 
                    request={selectedRequest} 
                    onClose={() => setSelectedRequest(null)}
                    onCancel={() => handleCancelRequest(selectedRequest.id)}
                />
            )}

            {/* Create Request Modal */}
            {isCreating && (
                <CreateChangeRequestForm 
                    onClose={() => setIsCreating(false)} 
                    onSubmit={handleCreateRequest} 
                />
            )}
        </div>
    );
};

export default TutorChangeRequests;
