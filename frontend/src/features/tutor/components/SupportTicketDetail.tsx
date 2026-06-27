import { ChevronRight, Paperclip, Send } from 'lucide-react';
import type { SupportTicket } from '@/shared/services/support-ticket.service';

interface SupportTicketDetailProps {
    ticket: SupportTicket;
    replyText: string;
    onReplyTextChange: (text: string) => void;
    onReplySubmit: () => void;
    onResolveClick: () => void;
    onBackClick: () => void;
}

export const SupportTicketDetail = ({
    ticket,
    replyText,
    onReplyTextChange,
    onReplySubmit,
    onResolveClick,
    onBackClick
}: SupportTicketDetailProps) => {

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]';
            case 'In Progress': return 'bg-[#e6f0fa] text-[#0061a5] border-[#bbdefb]';
            case 'Resolved': return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
            {/* Detail Header */}
            <div className="p-4 md:p-6 border-b border-[#e0e3e5] bg-white flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
                <div>
                    <button onClick={onBackClick} className="md:hidden flex items-center gap-1 text-[#0061a5] font-bold text-sm mb-2">
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
                    </button>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-lg md:text-xl font-extrabold text-[#002045] leading-tight">{ticket.title}</h2>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border whitespace-nowrap ${getStatusStyle(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#74777f]">
                        <span>ID: <strong>{ticket.id}</strong></span>
                        <span>Category: <strong>{ticket.category}</strong></span>
                    </div>
                </div>
                {ticket.status !== 'Resolved' && (
                    <button 
                        onClick={onResolveClick}
                        className="px-4 py-2 bg-[#f1f4f6] text-[#002045] font-bold text-xs rounded-lg hover:bg-[#e0e3e5] transition-colors whitespace-nowrap border border-[#c4c6cf]"
                    >
                        Mark as Resolved
                    </button>
                )}
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f7fafc]">
                <div className="space-y-6 max-w-3xl mx-auto">
                    {(ticket.messages || []).map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender_role === 'TUTOR' ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-[#43474e]">{msg.sender_role === 'TUTOR' ? 'You' : 'Support Team'}</span>
                                <span className="text-xs text-[#74777f]">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={`p-4 rounded-2xl max-w-[90%] md:max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.sender_role === 'TUTOR' ? 'bg-[#0061a5] text-white rounded-tr-sm' : 'bg-white border border-[#e0e3e5] text-[#181c1e] rounded-tl-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reply Box */}
            {ticket.status !== 'Resolved' ? (
                <div className="p-4 border-t border-[#e0e3e5] bg-white shrink-0">
                    <div className="max-w-3xl mx-auto flex items-end gap-2 md:gap-3 bg-[#f1f4f6] p-2 rounded-2xl border border-[#e0e3e5] focus-within:border-[#0061a5] focus-within:ring-1 focus-within:ring-[#0061a5]/50 transition-all">
                        <button className="p-2 text-[#74777f] hover:text-[#002045] hover:bg-[#e0e3e5] rounded-xl transition-colors mb-1 hidden sm:block">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <textarea 
                            rows={1}
                            placeholder="Type your reply..."
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-2 text-sm min-h-11 max-h-30"
                            value={replyText}
                            onChange={(e) => onReplyTextChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (replyText.trim() !== '') {
                                        onReplySubmit();
                                    }
                                }
                            }}
                        />
                        <button 
                            onClick={() => replyText.trim() && onReplySubmit()}
                            className={`p-2.5 rounded-xl transition-all mb-1 flex items-center justify-center shrink-0
                                ${replyText.trim() ? 'bg-[#0061a5] text-white shadow-md hover:bg-[#004a80]' : 'bg-[#e0e3e5] text-[#a1a4ad] cursor-not-allowed'}`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] text-center shrink-0">
                    <p className="text-[#74777f] text-sm">
                        This ticket has been resolved and closed. If you need further assistance, please create a new ticket.
                    </p>
                </div>
            )}
        </div>
    );
};
