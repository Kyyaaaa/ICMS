import { useState } from 'react';
import { FileEdit, Plus, Search, Eye, X, Calendar, Users, Send } from 'lucide-react';

const TutorChangeRequests = () => {
    const [requests, setRequests] = useState([
        { 
            id: 1, 
            className: 'IELTS-A01', 
            session: 5,
            type: 'Reschedule', 
            originalTime: '10-10-2026 (18:00 - 20:00)', 
            proposedTime: '11-10-2026 (18:00 - 20:00)', 
            reason: 'Personal emergency, need to move the class to the next day.',
            status: 'Pending', 
            submittedAt: '05-10-2026',
            staffNote: '',
            finalTime: ''
        },
        { 
            id: 4, 
            className: 'IELTS-A01', 
            session: 12,
            type: 'Reschedule', 
            originalTime: '20-10-2026 (18:00 - 20:00)', 
            proposedTime: null, 
            reason: 'I am sick, please reschedule this session for me but I am not sure when I can teach yet.',
            status: 'Pending', 
            submittedAt: '18-10-2026',
            staffNote: '',
            finalTime: ''
        },
        { 
            id: 3, 
            className: 'IELTS-A02', 
            session: 8,
            type: 'Reschedule', 
            originalTime: '15-10-2026 (18:00 - 20:00)', 
            proposedTime: '16-10-2026 (18:00 - 20:00)', 
            reason: 'Conflict with another schedule.',
            status: 'Approved', 
            submittedAt: '01-10-2026',
            staffNote: 'Rescheduled as requested.',
            finalTime: '16-10-2026 (18:00 - 20:00) • Room 102'
        },
    ]);

    const [selectedRequest, setSelectedRequest] = useState<Record<string, unknown> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form States
    const [newType, setNewType] = useState('Reschedule');
    const [newClassSession, setNewClassSession] = useState('');
    const [newProposedDate, setNewProposedDate] = useState('');
    const [newProposedTimeSlot, setNewProposedTimeSlot] = useState('');
    const [newProposedRoom, setNewProposedRoom] = useState('');
    const [newReason, setNewReason] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.className.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const proposedString = newType === 'Reschedule' && newProposedDate 
            ? `${newProposedDate.split('-').reverse().join('-')} (${newProposedTimeSlot || 'Any Time'}) • ${newProposedRoom || 'Any Room'}` 
            : null;

        const newReq = {
            id: Date.now(),
            className: newClassSession.split(' - ')[0] || 'Unknown Class',
            session: parseInt(newClassSession.split('Session ')[1] || '1'),
            type: newType,
            originalTime: 'TBD',
            proposedTime: proposedString,
            reason: newReason,
            status: 'Pending',
            submittedAt: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
            staffNote: '',
            finalTime: ''
        };
        setRequests([newReq, ...requests]);
        setIsCreating(false);
        setNewType('Reschedule');
        setNewClassSession('');
        setNewProposedDate('');
        setNewProposedTimeSlot('');
        setNewProposedRoom('');
        setNewReason('');
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5] shrink-0">
                        <FileEdit className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-[24px] font-bold text-[#002045]">My Change Requests</h1>
                        <p className="text-[#43474e] text-[14px]">Submit and track your schedule change requests</p>
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
                        className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#e0e3e5] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-2 border border-[#e0e3e5] rounded-xl focus:outline-none focus:border-[#0061a5] font-medium bg-[#f8f9fa] text-[#181c1e] text-[14px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                        <tr>
                            <th className="p-4 font-bold text-[13px] text-[#74777f] uppercase">Class & Session</th>
                            <th className="p-4 font-bold text-[13px] text-[#74777f] uppercase">Type</th>
                            <th className="p-4 font-bold text-[13px] text-[#74777f] uppercase">Submitted</th>
                            <th className="p-4 font-bold text-[13px] text-[#74777f] uppercase">Status</th>
                            <th className="p-4 font-bold text-[13px] text-[#74777f] uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e3e5]">
                        {filteredRequests.map(item => (
                            <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-[#002045]">{item.className}</div>
                                    <div className="text-[13px] text-[#74777f] font-medium mt-0.5">Session {item.session}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1.5 text-[13px] font-bold ${item.type === 'Reschedule' ? 'text-[#0061a5]' : 'text-purple-600'}`}>
                                        {item.type === 'Reschedule' ? <Calendar className="w-4 h-4"/> : <Users className="w-4 h-4"/>} {item.type}
                                    </span>
                                </td>
                                <td className="p-4 text-[14px] text-[#43474e] font-medium">{item.submittedAt}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold border ${
                                        item.status === 'Pending' ? 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]' : 
                                        item.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]' : 
                                        'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => setSelectedRequest(item)}
                                        className="text-[#0061a5] hover:bg-[#e6f0fa] px-3 py-2 rounded-lg font-bold text-[13px] transition-colors inline-flex items-center gap-1.5"
                                    >
                                        <Eye className="w-4 h-4"/> Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-[#74777f] font-medium">
                                    No requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-fade-in-up">
                        <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                            <h3 className="text-[18px] font-bold text-[#002045]">
                                Request Details
                            </h3>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 hover:bg-[#e0e3e5] rounded-full transition-colors text-[#74777f]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-1">Class & Session</p>
                                    <p className="font-bold text-[#181c1e] text-[16px]">{selectedRequest.className} - Session {selectedRequest.session}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold border ${
                                    selectedRequest.status === 'Pending' ? 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]' : 
                                    selectedRequest.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]' : 
                                    'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                    {selectedRequest.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                <div>
                                    <p className="text-[12px] font-bold text-[#74777f] mb-1">Original Time</p>
                                    <p className="font-semibold text-[#181c1e] text-[14px]">{selectedRequest.originalTime}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-[#74777f] mb-1">
                                        {selectedRequest.type === 'Reschedule' ? 'Proposed Time' : 'Request Type'}
                                    </p>
                                    <p className={`font-semibold text-[14px] ${selectedRequest.type === 'Reschedule' ? 'text-[#0061a5]' : 'text-purple-600'}`}>
                                        {selectedRequest.type === 'Reschedule' 
                                            ? (selectedRequest.proposedTime || 'None provided') 
                                            : 'Needs Substitute Tutor'}
                                    </p>
                                </div>
                            </div>

                            {selectedRequest.status === 'Approved' && selectedRequest.finalTime && (
                                <div className="p-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl">
                                    <p className="text-[12px] font-bold text-[#2e7d32] uppercase tracking-wider mb-1">Final Arranged Schedule</p>
                                    <p className="font-bold text-[#1b5e20]">{selectedRequest.finalTime}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-2">Your Reason</p>
                                <div className="p-4 bg-white border border-[#e0e3e5] rounded-xl text-[#43474e] text-[14px] leading-relaxed font-medium">
                                    "{selectedRequest.reason}"
                                </div>
                            </div>

                            {selectedRequest.staffNote && (
                                <div>
                                    <p className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider mb-2">Staff Feedback</p>
                                    <div className="p-4 bg-[#f0f7ff] border border-[#bbdefb] rounded-xl text-[#0061a5] text-[14px] leading-relaxed font-medium">
                                        {selectedRequest.staffNote}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Request Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden animate-fade-in-up max-h-[90vh]">
                        <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                            <h3 className="text-[18px] font-bold text-[#002045] flex items-center gap-2">
                                <FileEdit className="w-5 h-5 text-[#0061a5]" />
                                New Change Request
                            </h3>
                            <button 
                                onClick={() => setIsCreating(false)}
                                className="p-2 hover:bg-[#e0e3e5] rounded-full transition-colors text-[#74777f]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#002045] mb-2">Request Type <span className="text-rose-500">*</span></label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setNewType('Reschedule')}
                                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${newType === 'Reschedule' ? 'bg-[#e6f0fa] border-[#0061a5] text-[#0061a5]' : 'bg-white border-[#c4c6cf] text-[#43474e] hover:border-[#0061a5]'}`}
                                            >
                                                <Calendar className="w-4 h-4" /> Reschedule
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setNewType('Substitute')}
                                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${newType === 'Substitute' ? 'bg-[#f3e8ff] border-[#9333ea] text-[#9333ea]' : 'bg-white border-[#c4c6cf] text-[#43474e] hover:border-[#9333ea]'}`}
                                            >
                                                <Users className="w-4 h-4" /> Substitute
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#002045] mb-2">Class & Session <span className="text-rose-500">*</span></label>
                                        <select 
                                            required
                                            value={newClassSession}
                                            onChange={(e) => setNewClassSession(e.target.value)}
                                            className="w-full p-2.5 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] text-[14px] h-[46px]"
                                        >
                                            <option value="">Select class & session...</option>
                                            <option value="IELTS-A01 - Session 6">IELTS-A01 - Session 6 (Next Monday)</option>
                                            <option value="TOEIC-B01 - Session 3">TOEIC-B01 - Session 3 (Next Tuesday)</option>
                                        </select>
                                    </div>
                                </div>

                            {newType === 'Reschedule' && (
                                <div className="p-4 bg-[#f0f7ff] border border-[#bbdefb] rounded-xl space-y-4">
                                    <p className="text-[13px] font-bold text-[#002045]">Proposed New Schedule (Optional)</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[12px] font-bold text-[#43474e] mb-1">Select Date</label>
                                            <input 
                                                type="date" 
                                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-[13px] font-medium"
                                                value={newProposedDate}
                                                onChange={(e) => {
                                                    setNewProposedDate(e.target.value);
                                                    setNewProposedTimeSlot('');
                                                    setNewProposedRoom('');
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[12px] font-bold text-[#43474e] mb-1">Time Slot</label>
                                            <select 
                                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-[13px] font-medium disabled:bg-[#f1f4f6] disabled:text-[#74777f]"
                                                value={newProposedTimeSlot}
                                                onChange={(e) => {
                                                    setNewProposedTimeSlot(e.target.value);
                                                    setNewProposedRoom('');
                                                }}
                                                disabled={!newProposedDate}
                                            >
                                                <option value="">-- Any Time --</option>
                                                <option value="08:00 - 10:00">08:00 - 10:00</option>
                                                <option value="13:00 - 15:00">13:00 - 15:00</option>
                                                <option value="18:00 - 20:00">18:00 - 20:00</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[12px] font-bold text-[#43474e] mb-1">Room</label>
                                            <select 
                                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-[13px] font-medium disabled:bg-[#f1f4f6] disabled:text-[#74777f]"
                                                value={newProposedRoom}
                                                onChange={(e) => setNewProposedRoom(e.target.value)}
                                                disabled={!newProposedTimeSlot}
                                            >
                                                <option value="">-- Any Room --</option>
                                                <option value="Room 102">Room 102 (Cap: 30)</option>
                                                <option value="Room 205">Room 205 (Cap: 25)</option>
                                                <option value="Lab 1">Lab 1 (Cap: 20)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-[#74777f]">Leave blank if you want staff to arrange a time for you.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-[13px] font-bold text-[#002045] mb-2">Reason <span className="text-rose-500">*</span></label>
                                <textarea 
                                    required
                                    rows={3} 
                                    value={newReason}
                                    onChange={(e) => setNewReason(e.target.value)}
                                    placeholder="Please provide a detailed reason..." 
                                    className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] resize-none text-[14px]"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0061a5] hover:bg-[#004a80] transition-colors shadow-sm flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Submit
                                </button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorChangeRequests;
