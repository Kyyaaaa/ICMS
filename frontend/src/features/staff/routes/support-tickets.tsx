import { formatDateTime } from "../../../shared/utils/date";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Ticket, Search, MessageSquare, ChevronRight, Send, Paperclip } from 'lucide-react';
import Cookies from 'js-cookie';
import type { SupportTicket, TicketMessage } from '../../../shared/services/support-ticket.service';
import { SupportTicketService } from '../../../shared/services/support-ticket.service';
import { supabase } from '../../../utils/supabase';

const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (date.toDateString() === now.toDateString()) {
        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins} mins ago`;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return formatDateTime(date);
};

export const StaffSupportTickets = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');

    const userId = Cookies.get('user_info') ? JSON.parse(Cookies.get('user_info') as string).id : 'anonymous';
    const userRole = 'STAFF';

    const selectedTicketRef = useRef<SupportTicket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    useEffect(() => {
        selectedTicketRef.current = selectedTicket;
    }, [selectedTicket]);

    const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>(() => {
        const stored = localStorage.getItem(`readTimestamps_staff_${userId}`);
        return stored ? JSON.parse(stored) : {};
    });

    const markAsRead = useCallback((ticketId: string) => {
        setReadTimestamps(prev => {
            const newTimestamps = { ...prev, [ticketId]: new Date().toISOString() };
            localStorage.setItem(`readTimestamps_staff_${userId}`, JSON.stringify(newTimestamps));
            return newTimestamps;
        });
    }, [userId]);

    // Cross-tab synchronization for Read Receipts
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === `readTimestamps_staff_${userId}`) {
                setReadTimestamps(e.newValue ? JSON.parse(e.newValue) : {});
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [userId]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await SupportTicketService.getTickets(userId, userRole);
                setTickets(data || []);
            } catch (error) {
                console.error('Failed to load tickets', error);
            }
        };
        void fetchTickets();

        const handleNewMessageEvent = (newMsg: TicketMessage) => {
            setTickets(prev => {
                const exists = prev.some(t => t.id === newMsg.ticket_id);
                if (!exists) return prev;
                return prev.map(t => t.id === newMsg.ticket_id ? { 
                    ...t, 
                    last_message: newMsg.text, 
                    last_message_sender_id: newMsg.sender_id, 
                    updated_at: newMsg.created_at 
                } : t);
            });

            if (selectedTicketRef.current && newMsg.ticket_id === selectedTicketRef.current.id) {
                markAsRead(newMsg.ticket_id);
                setMessages((prev) => {
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
            }
        };

        // Important: Both staff and learners MUST use the exact same channel name for broadcast to work across them
        const realtimeChannel = supabase
            .channel(`public:support_chat_global`, { config: { broadcast: { ack: false } } })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTickets((prev) => {
                        if (prev.some(t => t.id === payload.new.id)) return prev;
                        return [payload.new as SupportTicket, ...prev];
                    });
                } else if (payload.eventType === 'UPDATE') {
                    setTickets((prev) => prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new } as SupportTicket : t));
                    setSelectedTicket(current => current?.id === payload.new.id ? { ...current, ...payload.new } as SupportTicket : current);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages' }, (payload) => {
                handleNewMessageEvent(payload.new as TicketMessage);
            })
            .on('broadcast', { event: 'new_message' }, (payload) => {
                const newMsg = payload.payload as TicketMessage;
                // Avoid applying the broadcast if we sent it ourselves (optimistic update handles it)
                if (newMsg.sender_id === userId) return;
                handleNewMessageEvent(newMsg);
            })
            .on('broadcast', { event: 'ticket_status_update' }, (payload) => {
                const updatedTicket = payload.payload;
                setTickets((prev) => prev.map(t => t.id === updatedTicket.id ? { ...t, ...updatedTicket } : t));
                setSelectedTicket(current => current?.id === updatedTicket.id ? { ...current, ...updatedTicket } : current);
            })
            .subscribe();

        // Save channel to ref for broadcasting
        realtimeChannelRef.current = realtimeChannel;

        return () => {
            supabase.removeChannel(realtimeChannel);
        };
    }, [userId, userRole, markAsRead]);

    const selectedTicketId = selectedTicket?.id;
    useEffect(() => {
        if (!selectedTicketId) return;

        const fetchMessages = async () => {
            try {
                const data = await SupportTicketService.getTicketMessages(selectedTicketId);
                setMessages(data);
            } catch (error) {
                console.error('Failed to load messages', error);
            }
        };
        void fetchMessages();
    }, [selectedTicketId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredTickets = (tickets || []).filter(t => {
        const titleStr = t.title || ''; // Fallback for missing title
        const matchesSearch = titleStr.toLowerCase().includes((searchTerm || '').toLowerCase()) || (t.ticket_number || '').toLowerCase().includes((searchTerm || '').toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesRole = roleFilter === 'All' || (t.sender_role || '').toUpperCase() === roleFilter.toUpperCase();
        return matchesSearch && matchesStatus && matchesRole;
    }).sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime());

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]';
            case 'In Progress': return 'bg-[#e6f0fa] text-[#0061a5] border-[#bbdefb]';
            case 'Resolved': return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;
        const originalTickets = [...tickets];
        try {
            // Optimistic update
            const tempId = `temp-${Date.now()}`;
            const optimisticMsg = {
                id: tempId,
                ticket_id: selectedTicket.id,
                sender_id: userId,
                sender_role: userRole,
                text: replyText,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMsg]);
            const currentText = replyText;
            setReplyText('');

            const nowIso = new Date().toISOString();
            
            // Optimistic update for selected ticket
            setSelectedTicket(prev => prev ? { ...prev, updated_at: nowIso } : null);

            // Optimistic update for tickets list
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { 
                ...t, 
                last_message: currentText, 
                last_message_sender_id: userId, 
                updated_at: nowIso 
            } : t));

            const newMsg = await SupportTicketService.replyToTicket(selectedTicket.id, currentText, userId, userRole);
            setMessages(prev => prev.map(m => m.id === tempId ? newMsg : m));
            
            // Broadcast the new message via Supabase Realtime to ensure immediate delivery
            if (realtimeChannelRef.current) {
                realtimeChannelRef.current.send({
                    type: 'broadcast',
                    event: 'new_message',
                    payload: newMsg
                });
            }
            
            // If the ticket was Open, change to In Progress when Staff replies
            if (selectedTicket.status === 'Open') {
                // Optimistic status update
                setSelectedTicket(prev => prev ? { ...prev, status: 'In Progress' } : null);
                setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'In Progress' } : t));
                await SupportTicketService.updateTicketStatus(selectedTicket.id, 'In Progress');
            }
        } catch (error) {
            console.error('Failed to reply', error);
            // Revert optimistic updates
            setTickets(originalTickets);
            setMessages(prev => prev.filter(m => !m.id.toString().startsWith('temp-')));
        }
    };

    const handleMarkResolved = useCallback(async () => {
        if (!selectedTicket) return;
        try {
            const nowIso = new Date().toISOString();
            // Optimistic update
            setSelectedTicket(prev => prev ? { ...prev, status: 'Resolved', updated_at: nowIso } : null);
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'Resolved', updated_at: nowIso } : t));
            
            await SupportTicketService.updateTicketStatus(selectedTicket.id, 'Resolved');

            if (realtimeChannelRef.current) {
                realtimeChannelRef.current.send({
                    type: 'broadcast',
                    event: 'ticket_status_update',
                    payload: { id: selectedTicket.id, status: 'Resolved', updated_at: nowIso }
                });
            }
        } catch (error) {
            console.error('Failed to mark resolved', error);
            // Revert on failure
            setSelectedTicket(prev => prev ? { ...prev, status: selectedTicket.status } : null);
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: selectedTicket.status } : t));
        }
    }, [selectedTicket]);


    return (
        <div className="flex h-[calc(100vh-128px)] md:h-[calc(100vh-144px)] bg-white overflow-hidden font-sans text-[#181c1e] rounded-2xl border border-[#e0e3e5] shadow-sm -mt-2">
            {/* Left Sidebar - Ticket List */}
            <div className={`w-full md:w-87.5 lg:w-100 border-r border-[#e0e3e5] bg-white flex flex-col h-full shrink-0 absolute md:relative z-10 transition-transform ${!selectedTicket ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-[#e0e3e5]">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-extrabold text-[#002045] flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-[#0061a5]" />
                            User Tickets
                        </h1>
                    </div>

                    {/* Stats Overview */}
                    <div className="flex gap-1.5 mb-6 text-xs overflow-x-auto w-full" style={{ scrollbarWidth: 'none' }}>
                        <div className="bg-[#f0f2f5] text-[#495057] px-2 py-1.5 rounded-lg font-medium flex items-center gap-1 whitespace-nowrap shrink-0">
                            Total <span className="bg-white text-[#002045] px-1.5 py-0.5 rounded text-[10px] font-bold">{tickets.length}</span>
                        </div>
                        <div className="bg-[#fff3cd] text-[#856404] px-2 py-1.5 rounded-lg font-medium flex items-center gap-1 whitespace-nowrap shrink-0">
                            Open <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-bold">{tickets.filter(t => t.status === 'Open').length}</span>
                        </div>
                        <div className="bg-[#cce5ff] text-[#004085] px-2 py-1.5 rounded-lg font-medium flex items-center gap-1 whitespace-nowrap shrink-0">
                            In Progress <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-bold">{tickets.filter(t => t.status === 'In Progress').length}</span>
                        </div>
                        <div className="bg-[#e8f5e9] text-[#2e7d32] px-2 py-1.5 rounded-lg font-medium flex items-center gap-1 whitespace-nowrap shrink-0">
                            Resolved <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-bold">{tickets.filter(t => t.status === 'Resolved').length}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search tickets..." 
                                className="w-full pl-9 pr-4 py-2 bg-[#f1f4f6] border border-[#e0e3e5] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select 
                                className="flex-1 py-1.5 px-2 bg-white border border-[#c4c6cf] rounded-lg text-xs text-[#43474e] focus:outline-none focus:border-[#0061a5]"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                            <select 
                                className="flex-1 py-1.5 px-2 bg-white border border-[#c4c6cf] rounded-lg text-xs text-[#43474e] focus:outline-none focus:border-[#0061a5]"
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
                    {filteredTickets.map(ticket => {
                        const isUnread = ticket.last_message_sender_id 
                            && ticket.last_message_sender_id !== userId 
                            && new Date(ticket.updated_at) > new Date(readTimestamps[ticket.id] || '2000-01-01');

                        return (
                        <div 
                            key={ticket.id}
                            onClick={() => { setSelectedTicket(ticket); markAsRead(ticket.id); }}
                            className={`p-4 border-b border-[#f1f4f6] cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-[#f0f7ff] border-l-4 border-l-[#0061a5]' : 'hover:bg-[#f8f9fa] border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-[#74777f]">{ticket.ticket_number}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h3 className={`text-sm leading-tight mb-2 line-clamp-2 ${isUnread ? 'font-bold' : 'font-medium'} ${selectedTicket?.id === ticket.id ? 'text-[#0061a5]' : 'text-[#002045]'}`}>
                                {ticket.title}
                            </h3>
                            {ticket.last_message && (
                                <p className={`text-xs mb-2 line-clamp-1 ${isUnread ? 'font-bold text-[#002045]' : 'text-[#74777f]'}`}>
                                    {ticket.last_message_sender_id === userId ? 'You: ' : ''}{ticket.last_message}
                                </p>
                            )}
                            <div className="flex justify-between items-center text-xs text-[#74777f]">
                                <span>{ticket.category}</span>
                                <span>{formatTimestamp(ticket.updated_at)}</span>
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            {/* Right Side - Detail / Chat View */}
            <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                {selectedTicket ? (
                    <>
                        {/* Detail Header */}
                        <div className="p-4 md:p-6 border-b border-[#e0e3e5] bg-white flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
                            <div>
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden flex items-center gap-1 text-[#0061a5] font-bold text-sm mb-2">
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
                                </button>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="text-lg md:text-xl font-extrabold text-[#002045] leading-tight">{selectedTicket.title}</h2>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border whitespace-nowrap ${getStatusStyle(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-[#74777f]">
                                    <span>ID: <strong>{selectedTicket.ticket_number}</strong></span>
                                    <span>Category: <strong>{selectedTicket.category}</strong></span>
                                    <span>Account: <strong className="text-[#002045]">{selectedTicket.sender_name || 'User'}</strong></span>
                                    <span>Role: <strong className={selectedTicket.sender_role?.toUpperCase() === 'TUTOR' ? 'text-purple-600' : 'text-blue-600'}>{selectedTicket.sender_role}</strong></span>
                                </div>
                            </div>
                            {selectedTicket.status !== 'Resolved' && (
                                <button onClick={handleMarkResolved} className="px-4 py-2 bg-[#f1f4f6] text-[#002045] font-bold text-xs rounded-lg hover:bg-[#e0e3e5] transition-colors whitespace-nowrap border border-[#c4c6cf]">
                                    Mark as Resolved
                                </button>
                            )}
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f7fafc]">
                            <div className="space-y-6 max-w-3xl mx-auto flex flex-col justify-end min-h-full">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex flex-col ${msg.sender_id === userId ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-[#43474e]">
                                                {msg.sender_id === userId ? 'You' : `${selectedTicket.sender_name || 'User'} (${msg.sender_role})`}
                                            </span>
                                            <span className="text-xs text-[#74777f]">{formatTimestamp(msg.created_at)}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-[90%] md:max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.sender_id === userId ? 'bg-[#0061a5] text-white rounded-tr-sm' : 'bg-white border border-[#e0e3e5] text-[#181c1e] rounded-tl-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
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
                                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-2 text-sm min-h-11 max-h-30"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendReply();
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={handleSendReply}
                                        className={`p-2.5 rounded-xl transition-all mb-1 flex items-center justify-center shrink-0
                                            ${replyText.trim() ? 'bg-[#0061a5] text-white shadow-md hover:bg-[#004a80]' : 'bg-[#e0e3e5] text-[#a1a4ad] cursor-not-allowed'}`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] text-center shrink-0">
                                <p className="text-[#74777f] text-sm">This ticket has been resolved and closed.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center flex-col text-[#74777f]">
                        <MessageSquare className="w-16 h-16 mb-4 text-[#c4c6cf]" />
                        <h3 className="text-xl font-bold text-[#002045] mb-2">Select a Ticket</h3>
                        <p className="text-sm">Choose a ticket from the left to view details or reply.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
