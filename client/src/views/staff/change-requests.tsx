import { useState } from 'react';
import { Eye, Search, X, CheckCircle, XCircle, Calendar, Users } from 'lucide-react';

const ChangeRequests = () => {
    const [requests, setRequests] = useState([
        { 
            id: 1, 
            tutor: 'Dr. Sarah Connor', 
            className: 'IELTS-A01', 
            session: 5,
            type: 'Reschedule', 
            originalTime: '10-10-2026 (18:00 - 20:00)', 
            proposedTime: '11-10-2026 (18:00 - 20:00)', 
            reason: 'Personal emergency, need to move the class to the next day.',
            status: 'Pending', 
            submittedAt: '05-10-2026' 
        },
        { 
            id: 2, 
            tutor: 'Mr. James Bond', 
            className: 'TOEIC-B01', 
            session: 2,
            type: 'Substitute', 
            originalTime: '12-10-2026 (19:00 - 21:00)', 
            proposedTime: null, 
            reason: 'Attending a conference, please find a substitute for this session.',
            status: 'Pending', 
            submittedAt: '06-10-2026' 
        },
        { 
            id: 3, 
            tutor: 'Ms. Emily Blunt', 
            className: 'IELTS-A02', 
            session: 8,
            type: 'Reschedule', 
            originalTime: '15-10-2026 (18:00 - 20:00)', 
            proposedTime: '16-10-2026 (18:00 - 20:00)', 
            reason: 'Conflict with another schedule.',
            status: 'Approved', 
            submittedAt: '01-10-2026' 
        },
        { 
            id: 4, 
            tutor: 'Dr. Sarah Connor', 
            className: 'IELTS-A01', 
            session: 12,
            type: 'Reschedule', 
            originalTime: '20-10-2026 (18:00 - 20:00)', 
            proposedTime: null, 
            reason: 'I am sick, please reschedule this session for me but I am not sure when I can teach yet.',
            status: 'Pending', 
            submittedAt: '18-10-2026' 
        },
    ]);

    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [selectedNewDate, setSelectedNewDate] = useState('');
    const [selectedNewTime, setSelectedNewTime] = useState('');
    const [selectedNewRoom, setSelectedNewRoom] = useState('');
    const [staffNote, setStaffNote] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const handleStatusUpdate = (id: number, newStatus: string) => {
        let finalArranged = '';
        if (newStatus === 'Approved' && selectedRequest?.type === 'Reschedule') {
            finalArranged = `${selectedNewDate} (${selectedNewTime}) • ${selectedNewRoom}`;
        }

        setRequests(requests.map(r => {
            if (r.id === id) {
                return { ...r, status: newStatus, finalTime: finalArranged || r.finalTime, staffNote: staffNote };
            }
            return r;
        }));
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
                <h1 className="text-[24px] font-bold text-[#002045]">Schedule Change Requests</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search tutor or class..." 
                            className="pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg w-[250px] focus:ring-2 focus:ring-[#0061a5] focus:outline-none" 
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
                            <th className="p-4 font-semibold text-[#43474e]">Tutor</th>
                            <th className="p-4 font-semibold text-[#43474e]">Class & Session</th>
                            <th className="p-4 font-semibold text-[#43474e]">Request Type</th>
                            <th className="p-4 font-semibold text-[#43474e]">Submitted Date</th>
                            <th className="p-4 font-semibold text-[#43474e]">Status</th>
                            <th className="p-4 font-semibold text-[#43474e] text-right">Actions</th>
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
                                    <span className={`flex items-center gap-1 text-sm font-semibold ${item.type === 'Reschedule' ? 'text-blue-600' : 'text-purple-600'}`}>
                                        {item.type === 'Reschedule' ? <Calendar className="w-4 h-4"/> : <Users className="w-4 h-4"/>} {item.type}
                                    </span>
                                </td>
                                <td className="p-4 text-[#74777f]">{item.submittedAt}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                        item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => {
                                            setSelectedRequest(item);
                                            setSelectedNewDate('');
                                            setSelectedNewTime('');
                                            setSelectedNewRoom('');
                                            setStaffNote(item.staffNote || '');
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
            {selectedRequest && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden animate-fade-in-up">
                        <div className="flex items-center justify-between p-6 border-b border-[#e0e3e5] bg-[#f8f9fa] flex-shrink-0">
                            <h3 className="text-[20px] font-bold text-[#002045]">
                                Request Details
                            </h3>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Tutor</p>
                                    <p className="font-bold text-[#002045] text-lg">{selectedRequest.tutor}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Class & Session</p>
                                    <p className="font-semibold text-[#43474e]">{selectedRequest.className} - Session {selectedRequest.session}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Original Schedule</p>
                                    <p className="font-semibold text-[#e11d48]">{selectedRequest.originalTime}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">
                                        {selectedRequest.type === 'Reschedule' ? 'Proposed by Tutor' : 'Requested Action'}
                                    </p>
                                    <p className={`font-semibold ${selectedRequest.type === 'Reschedule' ? 'text-[#16a34a]' : 'text-[#7c3aed]'}`}>
                                        {selectedRequest.type === 'Reschedule' 
                                            ? (selectedRequest.proposedTime || 'TBD (None provided)') 
                                            : 'Needs Substitute Tutor'}
                                    </p>
                                </div>
                            </div>

                            {selectedRequest.type === 'Reschedule' && selectedRequest.status === 'Pending' && (
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
                                    <p className="text-sm font-bold text-[#002045]">Assign Final Reschedule</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Select Date <span className="text-red-500">*</span></label>
                                            <input 
                                                type="date" 
                                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium"
                                                value={selectedNewDate}
                                                onChange={(e) => {
                                                    setSelectedNewDate(e.target.value);
                                                    setSelectedNewTime('');
                                                    setSelectedNewRoom('');
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Time Slot <span className="text-red-500">*</span></label>
                                            <select 
                                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                                value={selectedNewTime}
                                                onChange={(e) => {
                                                    setSelectedNewTime(e.target.value);
                                                    setSelectedNewRoom('');
                                                }}
                                                disabled={!selectedNewDate}
                                            >
                                                <option value="">-- Select Time --</option>
                                                <option value="08:00 - 10:00">08:00 - 10:00</option>
                                                <option value="13:00 - 15:00">13:00 - 15:00</option>
                                                <option value="18:00 - 20:00">18:00 - 20:00</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Room <span className="text-red-500">*</span></label>
                                            <select 
                                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                                value={selectedNewRoom}
                                                onChange={(e) => setSelectedNewRoom(e.target.value)}
                                                disabled={!selectedNewTime}
                                            >
                                                <option value="">-- Select Room --</option>
                                                <option value="Room 102">Room 102 (Cap: 30)</option>
                                                <option value="Room 205">Room 205 (Cap: 25)</option>
                                                <option value="Lab 1">Lab 1 (Cap: 20)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">You must check available time slots and rooms on the selected date before approving.</p>
                                </div>
                            )}

                            {selectedRequest.type === 'Reschedule' && selectedRequest.status !== 'Pending' && selectedRequest.finalTime && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <p className="text-sm font-semibold text-green-700 mb-1">Final Arranged Schedule</p>
                                    <p className="font-bold text-green-800">{selectedRequest.finalTime}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-2">Tutor's Reason</p>
                                <div className="p-4 bg-[#f0f7ff] rounded-xl text-[#002045] leading-relaxed border border-blue-100 font-medium">
                                    "{selectedRequest.reason}"
                                </div>
                            </div>

                            {selectedRequest.status === 'Pending' ? (
                                <div>
                                    <p className="text-sm font-semibold text-[#181c1e] mb-2">Staff Feedback / Note</p>
                                    <textarea 
                                        rows={2}
                                        className="w-full px-4 py-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium resize-none"
                                        placeholder="Add a message for the tutor (e.g. why it was rejected, or special instructions)..."
                                        value={staffNote}
                                        onChange={(e) => setStaffNote(e.target.value)}
                                    ></textarea>
                                </div>
                            ) : selectedRequest.staffNote && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2">Staff Feedback</p>
                                    <div className="p-4 bg-gray-50 rounded-xl text-[#43474e] leading-relaxed border border-[#c4c6cf] font-medium">
                                        {selectedRequest.staffNote}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedRequest.status === 'Pending' ? (
                            <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] flex justify-end gap-3 flex-shrink-0">
                                <button 
                                    onClick={() => handleStatusUpdate(selectedRequest.id, 'Rejected')}
                                    className="px-6 py-2.5 font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                                >
                                    <XCircle className="w-5 h-5" /> Reject
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(selectedRequest.id, 'Approved')}
                                    disabled={selectedRequest.type === 'Reschedule' && (!selectedNewDate || !selectedNewTime || !selectedNewRoom)}
                                    className="px-6 py-2.5 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle className="w-5 h-5" /> Approve
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] flex justify-end flex-shrink-0">
                                <button 
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-6 py-2.5 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default ChangeRequests;