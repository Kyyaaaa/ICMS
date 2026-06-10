import { Ticket, Search, Plus } from 'lucide-react';
import type { SupportTicket } from '../types/support-ticket';

interface SupportTicketListProps {
    tickets: SupportTicket[];
    selectedTicketId?: string;
    isCreating: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSelectTicket: (ticket: SupportTicket) => void;
    onCreateClick: () => void;
}

export const SupportTicketList = ({ 
    tickets, 
    selectedTicketId, 
    isCreating, 
    searchTerm, 
    onSearchChange, 
    onSelectTicket, 
    onCreateClick 
}: SupportTicketListProps) => {

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]';
            case 'In Progress': return 'bg-[#e6f0fa] text-[#0061a5] border-[#bbdefb]';
            case 'Resolved': return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-[#e0e3e5] bg-white flex flex-col h-full shrink-0 absolute md:relative z-10 transition-transform ${(!selectedTicketId && !isCreating) ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-6 border-b border-[#e0e3e5]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[24px] font-extrabold text-[#002045] flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-[#0061a5]" />
                        Support
                    </h1>
                    <button 
                        onClick={onCreateClick}
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
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {tickets.map(ticket => (
                    <div 
                        key={ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                        className={`p-4 border-b border-[#f1f4f6] cursor-pointer transition-colors ${selectedTicketId === ticket.id && !isCreating ? 'bg-[#f0f7ff] border-l-4 border-l-[#0061a5]' : 'hover:bg-[#f8f9fa] border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[12px] font-bold text-[#74777f]">{ticket.id}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getStatusStyle(ticket.status)}`}>
                                {ticket.status}
                            </span>
                        </div>
                        <h3 className={`text-[14px] font-bold leading-tight mb-2 line-clamp-2 ${selectedTicketId === ticket.id && !isCreating ? 'text-[#0061a5]' : 'text-[#002045]'}`}>
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
    );
};
