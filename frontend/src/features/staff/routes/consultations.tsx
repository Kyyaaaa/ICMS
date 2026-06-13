import { useState, useEffect } from 'react';
import { Eye, Search } from 'lucide-react';
import type { ConsultationRequest } from '../types/consultation';
import { ConsultationsService } from '../services/consultations.service';
import { ConsultationModal } from '../components/ConsultationModal';

const ConsultationList = () => {
    const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const loadData = async () => {
            const data = await ConsultationsService.getConsultations();
            setConsultations(data);
        };
        loadData();
    }, []);

    const handleSave = async (id: number, status: string, note: string) => {
        const item = consultations.find(c => c.id === id);
        if (item) {
            const updated = { ...item, status, staffNote: note };
            await ConsultationsService.updateConsultation(updated);
            setConsultations(consultations.map(c => c.id === id ? updated : c));
        }
        setSelectedConsultation(null);
    };

    const filteredConsultations = consultations.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
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
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                        <tr>
                            <th className="p-4 font-semibold text-[#43474e]">Full Name</th>
                            <th className="p-4 font-semibold text-[#43474e]">Phone Number</th>
                            <th className="p-4 font-semibold text-[#43474e]">Email Address</th>
                            <th className="p-4 font-semibold text-[#43474e]">Submitted Date</th>
                            <th className="p-4 font-semibold text-[#43474e]">Status</th>
                            <th className="p-4 font-semibold text-[#43474e] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredConsultations.map(item => (
                            <tr key={item.id} className="border-b border-[#e0e3e5] hover:bg-gray-50">
                                <td className="p-4 font-bold text-[#002045]">{item.name}</td>
                                <td className="p-4 text-[#43474e]">{item.phone}</td>
                                <td className="p-4 text-[#43474e]">{item.email}</td>
                                <td className="p-4 text-[#74777f]">{item.date}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        item.status === 'New' ? 'bg-blue-100 text-[#0061a5]' : 
                                        item.status === 'Contacted' ? 'bg-amber-100 text-amber-700' : 
                                        'bg-green-100 text-green-700'
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
                        ))}
                    </tbody>
                </table>
            </div>

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
