import { useState } from 'react';
import { Eye, Search, X, Check } from 'lucide-react';

const ConsultationList = () => {
    const [consultations, setConsultations] = useState([
        { id: 1, name: 'Alex Johnson', phone: '+1 234 567 890', email: 'alex.johnson@example.com', status: 'New', message: 'I need consultation for the IELTS beginner course. What is the schedule?', targetScore: 'IELTS 6.5', date: '20-10-2026', staffNote: '' },
        { id: 2, name: 'Sarah Connor', phone: '+1 987 654 321', email: 'sarah.c@example.com', status: 'Contacted', message: 'Could you please advise on evening classes for TOEIC preparation?', targetScore: 'TOEIC 700+', date: '21-10-2026', staffNote: 'Called on Oct 22, she will decide next week.' },
        { id: 3, name: 'Michael Smith', phone: '+1 555 123 456', email: 'msmith@example.com', status: 'Resolved', message: 'What is the tuition fee for the basic communication course?', targetScore: 'Basic Comm.', date: '22-10-2026', staffNote: 'Enrolled in Basic Comm. cohort 45.' },
    ]);

    const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
    const [tempStatus, setTempStatus] = useState('');
    const [tempNote, setTempNote] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const handleSave = (id: number) => {
        setConsultations(consultations.map(c => c.id === id ? { ...c, status: tempStatus, staffNote: tempNote } : c));
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
                <h1 className="text-[24px] font-bold text-[#002045]">Consultation Requests</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or phone..." 
                            className="pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg w-[300px] focus:ring-2 focus:ring-[#0061a5] focus:outline-none" 
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
                                        onClick={() => {
                                            setSelectedConsultation(item);
                                            setTempStatus(item.status);
                                            setTempNote(item.staffNote || '');
                                        }}
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
            {selectedConsultation && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-fade-in-up">
                        <div className="flex items-center justify-between p-6 border-b border-[#e0e3e5] bg-[#f8f9fa] flex-shrink-0">
                            <h3 className="text-[20px] font-bold text-[#002045]">
                                Consultation Details
                            </h3>
                            <button 
                                onClick={() => setSelectedConsultation(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Full Name</p>
                                    <p className="font-bold text-[#002045] text-lg">{selectedConsultation.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Submitted Date</p>
                                    <p className="font-semibold text-[#43474e]">{selectedConsultation.date}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Phone Number</p>
                                    <p className="font-semibold text-[#002045]">{selectedConsultation.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Email Address</p>
                                    <p className="font-semibold text-[#002045]">{selectedConsultation.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Target / Course Interest</p>
                                    <p className="font-semibold text-[#0061a5] bg-blue-50 w-fit px-3 py-1 rounded-md">{selectedConsultation.targetScore}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2">Message / Notes from Student</p>
                                    <div className="p-4 bg-[#f0f7ff] rounded-xl text-[#002045] leading-relaxed border border-blue-100 font-medium">
                                        "{selectedConsultation.message}"
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-[#181c1e] mb-2">Staff Internal Note</p>
                                    <textarea 
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium resize-none"
                                        placeholder="Add notes about your contact with this student..."
                                        value={tempNote}
                                        onChange={(e) => setTempNote(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-semibold text-gray-500">Update Status:</p>
                                <select 
                                    className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] font-semibold text-[#002045]"
                                    value={tempStatus}
                                    onChange={(e) => setTempStatus(e.target.value)}
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setSelectedConsultation(null)}
                                    className="px-6 py-2.5 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleSave(selectedConsultation.id)}
                                    className="px-6 py-2.5 font-semibold text-white bg-[#0061a5] rounded-xl hover:bg-[#004a80] transition-colors flex items-center gap-2"
                                >
                                    <Check className="w-5 h-5" /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ConsultationList;