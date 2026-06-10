import { useState } from 'react';
import { Ticket, Search, Plus, MessageSquare, ChevronRight, Send, Paperclip } from 'lucide-react';

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
    messages: TicketMessage[];
}

const mockTickets: SupportTicket[] = [
    {
        id: 'TCK-2041',
        title: 'Projector not working in Room 302',
        status: 'Open',
        category: 'Facility & Equipment',
        updatedAt: '10 mins ago',
        messages: [
            { id: 1, sender: 'user', text: 'Hi, I am currently teaching in Room 302 and the projector won\'t turn on. Please send IT support.', time: '18:05' }
        ]
    },
    {
        id: 'TCK-1981',
        title: 'Salary discrepancy for last month',
        status: 'In Progress',
        category: 'Payroll',
        updatedAt: 'Yesterday',
        messages: [
            { id: 1, sender: 'user', text: 'Hello, my teaching hours for the TOEIC Prep class on May 15th seem to be missing from the payroll.', time: 'May 20, 09:00 AM' },
            { id: 2, sender: 'support', text: 'Hi, we are checking the logs. We will get back to you shortly.', time: 'May 20, 10:15 AM' }
        ]
    },
    {
        id: 'TCK-1855',
        title: 'Air conditioning issue in Room 201',
        status: 'Resolved',
        category: 'Facility & Equipment',
        updatedAt: 'May 10',
        messages: [
            { id: 1, sender: 'user', text: 'The AC is leaking water near the whiteboard.', time: 'May 09, 02:00 PM' },
            { id: 2, sender: 'support', text: 'Thank you for reporting. Maintenance has fixed the issue.', time: 'May 10, 09:00 AM' },
            { id: 3, sender: 'user', text: 'Great, thanks!', time: 'May 10, 09:15 AM' }
        ]
    }
];

export const TutorSupportTickets = () => {
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(mockTickets[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const filteredTickets = mockTickets.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()));

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
            <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-[#e0e3e5] bg-white flex flex-col h-full shrink-0 absolute md:relative z-10 transition-transform ${(!selectedTicket && !isCreating) ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-[#e0e3e5]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-[24px] font-extrabold text-[#002045] flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-[#0061a5]" />
                            Support
                        </h1>
                        <button 
                            onClick={() => { setIsCreating(true); setSelectedTicket(null); }}
                            className="w-10 h-10 bg-[#0061a5] text-white rounded-full flex items-center justify-center hover:bg-[#004a80] transition-colors shadow-sm"
                            title="Create Ticket"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    
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
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.map(ticket => (
                        <div 
                            key={ticket.id}
                            onClick={() => { setSelectedTicket(ticket); setIsCreating(false); }}
                            className={`p-4 border-b border-[#f1f4f6] cursor-pointer transition-colors ${selectedTicket?.id === ticket.id && !isCreating ? 'bg-[#f0f7ff] border-l-4 border-l-[#0061a5]' : 'hover:bg-[#f8f9fa] border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[12px] font-bold text-[#74777f]">{ticket.id}</span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h3 className={`text-[14px] font-bold leading-tight mb-2 line-clamp-2 ${selectedTicket?.id === ticket.id && !isCreating ? 'text-[#0061a5]' : 'text-[#002045]'}`}>
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
                {isCreating ? (
                    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full flex-1 overflow-y-auto">
                        <button onClick={() => setIsCreating(false)} className="md:hidden flex items-center gap-1 text-[#0061a5] font-bold text-[14px] mb-4">
                            <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
                        </button>
                        <h2 className="text-[24px] font-extrabold text-[#002045] mb-6">Create New Ticket</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[14px] font-bold text-[#002045] mb-2">Category</label>
                                <select className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5]">
                                    <option>Facility & Equipment</option>
                                    <option>Schedule Issue</option>
                                    <option>System Issue</option>
                                    <option>Payroll</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-[#002045] mb-2">Subject</label>
                                <input type="text" placeholder="Briefly describe your issue..." className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5]" />
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-[#002045] mb-2">Description</label>
                                <textarea rows={6} placeholder="Provide details here..." className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] resize-none"></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsCreating(false)} className="px-6 py-2.5 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                                <button className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0061a5] hover:bg-[#004a80] transition-colors shadow-sm">Submit Ticket</button>
                            </div>
                        </div>
                    </div>
                ) : selectedTicket ? (
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
                                <div className="flex items-center gap-4 text-[13px] text-[#74777f]">
                                    <span>ID: <strong>{selectedTicket.id}</strong></span>
                                    <span>Category: <strong>{selectedTicket.category}</strong></span>
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
                                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[12px] font-bold text-[#43474e]">{msg.sender === 'user' ? 'You' : 'Support Team'}</span>
                                            <span className="text-[11px] text-[#74777f]">{msg.time}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-[90%] md:max-w-[80%] text-[14px] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#0061a5] text-white rounded-tr-sm' : 'bg-white border border-[#e0e3e5] text-[#181c1e] rounded-tl-sm'}`}>
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
                                <p className="text-[#74777f] text-[14px]">This ticket has been resolved and closed. If you need further assistance, please <button onClick={() => { setIsCreating(true); setSelectedTicket(null); }} className="text-[#0061a5] font-bold hover:underline">create a new ticket</button>.</p>
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
