import React, { useState } from 'react';
import { Ticket, Search, MessageSquare, ChevronRight, Send, Paperclip } from 'lucide-react';

interface TicketMessage {
    id: number;
    sender: 'user' | 'support';
    text: string;
    time: string;
}

interface SupportTicket {
    id: string;
    title: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    category: string;
    updatedAt: string;
    userName: string;
    userRole: 'Learner' | 'Tutor';
    messages: TicketMessage[];
}
const mockTickets: SupportTicket[] = [
    {
        id: 'TCK-1042',
        title: 'Cannot access material for Writing Task 2',
        status: 'Open',
        category: 'Technical Issue',
        updatedAt: '10 mins ago',
        userName: 'Alex Johnson',
        userRole: 'Learner',
        messages: [
            { id: 1, sender: 'user', text: 'Hi, I am enrolled in the IELTS Intensive Mastery but I cannot download the PDF for week 3 Writing Task 2. It shows an error 404.', time: '10:30 AM' }
        ]
    },
    {
        id: 'TCK-0981',
        title: 'Request to change class schedule',
        status: 'In Progress',
        category: 'Course Management',
        updatedAt: 'Yesterday',
        userName: 'Dr. Sarah Connor',
        userRole: 'Tutor',
        messages: [
            { id: 1, sender: 'user', text: 'I would like to move from Class 1 to Class 2 if possible.', time: 'Oct 24, 09:00 AM' },
            { id: 2, sender: 'support', text: 'Hello! Let me check the availability for Class 2. I will get back to you shortly.', time: 'Oct 24, 10:15 AM' }
        ]
    },
    {
        id: 'TCK-0855',
        title: 'Payment receipt not received',
        status: 'Resolved',
        category: 'Billing',
        updatedAt: 'Oct 20',
        userName: 'Michael Smith',
        userRole: 'Learner',
        messages: [
            { id: 1, sender: 'user', text: 'I paid for the course but haven\'t received the email receipt.', time: 'Oct 19, 02:00 PM' },
            { id: 2, sender: 'support', text: 'We apologize for the delay. The receipt has been resent to your registered email.', time: 'Oct 20, 09:00 AM' },
            { id: 3, sender: 'user', text: 'Got it, thanks!', time: 'Oct 20, 09:15 AM' }
        ]
    }
];

export const StaffSupportTickets = () => {
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(mockTickets[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');

    const filteredTickets = mockTickets.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesRole = roleFilter === 'All' || t.userRole === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]';
            case 'In Progress': return 'bg-[#e6f0fa] text-[#0061a5] border-[#bbdefb]';
            case 'Resolved': return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-[calc(100vh-128px)] md:h-[calc(100vh-144px)] bg-white overflow-hidden font-sans text-[#181c1e] rounded-2xl border border-[#e0e3e5] shadow-sm -mt-2">
            {/* Left Sidebar - Ticket List */}
            <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-[#e0e3e5] bg-white flex flex-col h-full shrink-0 absolute md:relative z-10 transition-transform ${!selectedTicket ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-[#e0e3e5]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-[24px] font-extrabold text-[#002045] flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-[#0061a5]" />
                            User Tickets
                        </h1>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search tickets..." 
                                className="w-full pl-9 pr-4 py-2 bg-[#f1f4f6] border border-[#e0e3e5] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select 
                                className="flex-1 py-1.5 px-2 bg-white border border-[#c4c6cf] rounded-lg text-[13px] text-[#43474e] focus:outline-none focus:border-[#0061a5]"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                            <select 
                                className="flex-1 py-1.5 px-2 bg-white border border-[#c4c6cf] rounded-lg text-[13px] text-[#43474e] focus:outline-none focus:border-[#0061a5]"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Learner">Learner</option>
                                <option value="Tutor">Tutor</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.map(ticket => (
                        <div 
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-4 border-b border-[#f1f4f6] cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-[#f0f7ff] border-l-4 border-l-[#0061a5]' : 'hover:bg-[#f8f9fa] border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[12px] font-bold text-[#74777f]">{ticket.id}</span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h3 className={`text-[14px] font-bold leading-tight mb-2 line-clamp-2 ${selectedTicket?.id === ticket.id ? 'text-[#0061a5]' : 'text-[#002045]'}`}>
                                {ticket.title}
                            </h3>
                            <div className="flex justify-between items-center text-[12px] text-[#74777f]">
                                <span>{ticket.category}</span>
                                <span>{ticket.updatedAt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Detail / Chat View */}
            <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                {selectedTicket ? (
                    <>
                        {/* Detail Header */}
                        <div className="p-4 md:p-6 border-b border-[#e0e3e5] bg-white flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
                            <div>
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden flex items-center gap-1 text-[#0061a5] font-bold text-[14px] mb-2">
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
                                </button>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="text-[18px] md:text-[20px] font-extrabold text-[#002045] leading-tight">{selectedTicket.title}</h2>
                                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${getStatusStyle(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#74777f]">
                                    <span>ID: <strong>{selectedTicket.id}</strong></span>
                                    <span>Category: <strong>{selectedTicket.category}</strong></span>
                                    <span>From: <strong className={selectedTicket.userRole === 'Tutor' ? 'text-purple-600' : 'text-blue-600'}>{selectedTicket.userName} ({selectedTicket.userRole})</strong></span>
                                </div>
                            </div>
                            {selectedTicket.status !== 'Resolved' && (
                                <button className="px-4 py-2 bg-[#f1f4f6] text-[#002045] font-bold text-[13px] rounded-lg hover:bg-[#e0e3e5] transition-colors whitespace-nowrap border border-[#c4c6cf]">
                                    Mark as Resolved
                                </button>
                            )}
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f7fafc]">
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {selectedTicket.messages.map(msg => (
                                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'support' ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[12px] font-bold text-[#43474e]">
                                                {msg.sender === 'support' ? 'You' : `${selectedTicket.userName} (${selectedTicket.userRole})`}
                                            </span>
                                            <span className="text-[11px] text-[#74777f]">{msg.time}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-[90%] md:max-w-[80%] text-[14px] leading-relaxed shadow-sm ${msg.sender === 'support' ? 'bg-[#0061a5] text-white rounded-tr-sm' : 'bg-white border border-[#e0e3e5] text-[#181c1e] rounded-tl-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reply Box */}
                        {selectedTicket.status !== 'Resolved' ? (
                            <div className="p-4 border-t border-[#e0e3e5] bg-white shrink-0">
                                <div className="max-w-3xl mx-auto flex items-end gap-2 md:gap-3 bg-[#f1f4f6] p-2 rounded-2xl border border-[#e0e3e5] focus-within:border-[#0061a5] focus-within:ring-1 focus-within:ring-[#0061a5]/50 transition-all">
                                    <button className="p-2 text-[#74777f] hover:text-[#002045] hover:bg-[#e0e3e5] rounded-xl transition-colors mb-1 hidden sm:block">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <textarea 
                                        rows={1}
                                        placeholder="Type your reply..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-2 text-[14px] min-h-[44px] max-h-[120px]"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                if(replyText.trim() !== '') setReplyText('');
                                            }
                                        }}
                                    />
                                    <button 
                                        className={`p-2.5 rounded-xl transition-all mb-1 flex items-center justify-center shrink-0
                                            ${replyText.trim() ? 'bg-[#0061a5] text-white shadow-md hover:bg-[#004a80]' : 'bg-[#e0e3e5] text-[#a1a4ad] cursor-not-allowed'}`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] text-center shrink-0">
                                <p className="text-[#74777f] text-[14px]">This ticket has been resolved and closed.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center flex-col text-[#74777f]">
                        <MessageSquare className="w-16 h-16 mb-4 text-[#c4c6cf]" />
                        <h3 className="text-[20px] font-bold text-[#002045] mb-2">Select a Ticket</h3>
                        <p className="text-[14px]">Choose a ticket from the left to view details or reply.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
