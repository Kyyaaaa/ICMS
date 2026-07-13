import { formatDateTime } from "../../utils/date";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Ticket, Search, Plus, MessageSquare, ChevronRight, Send, Paperclip } from 'lucide-react';
import Cookies from 'js-cookie';
import type { SupportTicket, TicketMessage } from '../../services/support-ticket.service';
import { SupportTicketService } from '../../services/support-ticket.service';
import { supabase } from '../../../utils/supabase';

const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    
    // If it's today
    if (date.toDateString() === now.toDateString()) {
        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins} mins ago`;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show date and time
    return formatDateTime(date);
};

export const SupportTickets = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');
    // Form state for creating
    const [createCategory, setCreateCategory] = useState('Technical Issue');
    const [createSubject, setCreateSubject] = useState('');
    const [createDescription, setCreateDescription] = useState('');
    const [showResolveConfirm, setShowResolveConfirm] = useState(false);

    const userInfoCookie = Cookies.get('user_info');
    const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
    const userId = userInfo?.id || 'anonymous';
    const userRole = userInfo?.role ? String(userInfo.role).toUpperCase() : 'LEARNER';
    const isStaff = userRole === 'STAFF';

    const selectedTicketRef = useRef<SupportTicket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    useEffect(() => {
        selectedTicketRef.current = selectedTicket;
    }, [selectedTicket]);

    const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>(() => {
        const stored = localStorage.getItem(`readTimestamps_${userId}`);
        return stored ? JSON.parse(stored) : {};
    });

    const markAsRead = useCallback((ticketId: string) => {
        setReadTimestamps(prev => {
            const newTimestamps = { ...prev, [ticketId]: new Date().toISOString() };
            localStorage.setItem(`readTimestamps_${userId}`, JSON.stringify(newTimestamps));
            return newTimestamps;
        });
    }, [userId]);

    // Cross-tab synchronization for Read Receipts
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === `readTimestamps_${userId}`) {
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

        // Subscribe to all changes on a single channel
        // Important: Both staff and learners MUST use the exact same channel name for broadcast to work across them
        const realtimeChannel = supabase
            .channel(`public:support_chat_global`, { config: { broadcast: { ack: false } } })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    // Only add if it belongs to this user (for learners/tutors)
                    if (payload.new.sender_id === userId) {
                        setTickets((prev) => {
                            if (prev.some(t => t.id === payload.new.id)) return prev;
                            return [payload.new as SupportTicket, ...prev];
                        });
                    }
                } else if (payload.eventType === 'UPDATE') {
                    setTickets((prev) => prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new } as SupportTicket : t));
                    setSelectedTicket(current => current?.id === payload.new.id ? { ...current, ...payload.new } as SupportTicket : current);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages' }, (payload) => {
                const newMsg = payload.new as TicketMessage;
                // Avoid applying if we sent it ourselves (optimistic update handles it to prevent duplicates)
                if (newMsg.sender_id === userId) return;
                handleNewMessageEvent(newMsg);
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

    const handleCreateSubmit = async () => {
        if (!createSubject.trim() || !createDescription.trim()) return;
        try {
            const newTicket = await SupportTicketService.createTicket({
                category: createCategory,
                subject: createSubject,
                description: createDescription,
                sender_id: userId,
                sender_role: userRole
            });
            setIsCreating(false);
            setCreateSubject('');
            setCreateDescription('');
            
            // Optimistic insert into ticket list
            setTickets(prev => {
                if (prev.some(t => t.id === newTicket.id)) return prev;
                return [newTicket, ...prev];
            });

            setSelectedTicket(newTicket);
            // newTicket will also come via Realtime but we set it as selected immediately
        } catch (error) {
            console.error('Failed to create ticket', error);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyText.trim() || !selectedTicket) return;
        const ticketSnapshot = tickets.find(t => t.id === selectedTicket.id);
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
            const nextStatus = (selectedTicket.status === 'Open' && (userRole === 'STAFF' || userRole === 'ADMIN')) ? 'In Progress' : selectedTicket.status;
            
            // Optimistic update for selected ticket
            setSelectedTicket(prev => prev ? { 
                ...prev, 
                updated_at: nowIso,
                status: nextStatus
            } : null);

            // Optimistic update for tickets list
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { 
                ...t, 
                last_message: currentText, 
                last_message_sender_id: userId, 
                updated_at: nowIso,
                status: nextStatus
            } : t));

            const newMsg = await SupportTicketService.replyToTicket(selectedTicket.id, currentText, userId, userRole);
            
            // Replace optimistic with real
            setMessages(prev => prev.map(m => m.id === tempId ? newMsg : m));
            
            // Broadcast the new message via Supabase Realtime to ensure immediate delivery
            if (realtimeChannelRef.current) {
                realtimeChannelRef.current.send({
                    type: 'broadcast',
                    event: 'new_message',
                    payload: newMsg
                });
            }
        } catch (error) {
            console.error('Failed to reply', error);
            // Revert optimistic updates carefully to avoid race conditions
            if (ticketSnapshot) {
                setTickets(prev => prev.map(t => t.id === selectedTicket.id ? ticketSnapshot : t));
                setSelectedTicket(prev => prev?.id === selectedTicket.id ? ticketSnapshot : prev);
            }
            setMessages(prev => prev.filter(m => !m.id.toString().startsWith('temp-')));
        }
    };

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!selectedTicket || selectedTicket.status === 'Resolved') return;
        const interval = setInterval(() => setNow(Date.now()), 10000);
        return () => clearInterval(interval);
    }, [selectedTicket]);

    let resolveTimeLeft: number | null = null;
    if (selectedTicket && selectedTicket.status === 'In Progress') {
        const lastUpdate = new Date(selectedTicket.updated_at).getTime();
        const diffMins = (now - lastUpdate) / 1000 / 60;
        if (diffMins >= 10 && diffMins < 15) {
            resolveTimeLeft = Math.ceil(15 - diffMins);
        }
    }



    const handleExtendTicket = async () => {
        if (!selectedTicket) return;
        const originalUpdatedAt = selectedTicket.updated_at;
        try {
            const nowIso = new Date().toISOString();
            // Optimistic update
            setSelectedTicket(prev => prev ? { ...prev, updated_at: nowIso } : null);
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, updated_at: nowIso } : t));
            
            await SupportTicketService.updateTicketStatus(selectedTicket.id, selectedTicket.status);

            if (realtimeChannelRef.current) {
                realtimeChannelRef.current.send({
                    type: 'broadcast',
                    event: 'ticket_status_update',
                    payload: { id: selectedTicket.id, status: selectedTicket.status, updated_at: nowIso }
                });
            }
        } catch (error) {
            console.error('Failed to extend ticket', error);
            // Revert on failure
            setSelectedTicket(prev => prev ? { ...prev, updated_at: originalUpdatedAt } : null);
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, updated_at: originalUpdatedAt } : t));
        }
    };

    const handleMarkResolved = useCallback(async () => {
        if (!selectedTicket || selectedTicket.status === 'Resolved') return;

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

    const autoResolveAttemptedRef = useRef<Record<string, boolean>>({});

    // Frontend fallback: auto-resolve if backend cron missed it
    useEffect(() => {
        if (!selectedTicket || selectedTicket.status !== 'In Progress') return;
        const lastUpdate = new Date(selectedTicket.updated_at).getTime();
        const diffMins = (now - lastUpdate) / 1000 / 60;
        if (diffMins >= 15) {
            if (!autoResolveAttemptedRef.current[selectedTicket.id]) {
                autoResolveAttemptedRef.current[selectedTicket.id] = true;
                setTimeout(() => handleMarkResolved(), 0);
            }
        } else {
            // Reset if it somehow becomes active again (e.g. they extended it on another device)
            autoResolveAttemptedRef.current[selectedTicket.id] = false;
        }
    }, [now, selectedTicket, handleMarkResolved]);

    const filteredTickets = (tickets || []).filter(t => {
        const titleStr = t.title || ''; 
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

    // Exact height calculations based on MainLayout: 
    // Header (72px) + Padding (md: 48px, lg: 64px) + Staff/Tutor SubNav (~51px) = Learner (120/136) / Staff/Tutor (171/187)
    // Adding 1-2px buffer to prevent rounding issues
    const isStaffOrTutor = isStaff || userRole === 'TUTOR';
    const containerHeightClass = isStaffOrTutor 
        ? "h-[calc(100vh-172px)] lg:h-[calc(100vh-188px)]" 
        : "h-[calc(100vh-122px)] lg:h-[calc(100vh-138px)]";

    return (
        <div className={`flex bg-white overflow-hidden font-sans text-[#181c1e] rounded-2xl border border-[#e0e3e5] shadow-sm ${containerHeightClass}`}>
            {/* Left Sidebar - Ticket List */}
            <div className={`w-full md:w-107.5 lg:w-110 xl:w-112.5 border-r border-[#e0e3e5] bg-white flex flex-col h-full shrink-0 absolute md:relative z-10 transition-transform ${(!selectedTicket && !isCreating) ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-[#e0e3e5]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-extrabold text-[#002045] flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-[#0061a5]" />
                            {isStaff ? 'User Tickets' : 'Support'}
                        </h1>
                        {!isStaff && (
                            <button 
                                onClick={() => { setIsCreating(true); setSelectedTicket(null); }}
                                className="w-10 h-10 bg-[#0061a5] text-white rounded-full flex items-center justify-center hover:bg-[#004a80] transition-colors shadow-sm"
                                title="Create Ticket"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    
                    {isStaff && (
                        <div className="flex justify-center items-center gap-1.5 xl:gap-2 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                            <div className="flex items-center gap-1.5 px-2 py-1 xl:px-2.5 xl:py-1.5 bg-[#f1f4f6] rounded-lg shrink-0">
                                <span className="text-[11px] xl:text-xs font-medium text-[#43474e]">Total</span>
                                <span className="text-[11px] xl:text-xs font-bold text-[#43474e] bg-white px-1.5 xl:px-2 py-0.5 rounded-md">{tickets.length}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 xl:px-2.5 xl:py-1.5 bg-[#fff8e1] rounded-lg shrink-0">
                                <span className="text-[11px] xl:text-xs font-medium text-[#f57f17]">Open</span>
                                <span className="text-[11px] xl:text-xs font-bold text-[#f57f17] bg-white px-1.5 xl:px-2 py-0.5 rounded-md">{tickets.filter(t => t.status === 'Open').length}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 xl:px-2.5 xl:py-1.5 bg-[#e6f0fa] rounded-lg shrink-0">
                                <span className="text-[11px] xl:text-xs font-medium text-[#0061a5]">In Progress</span>
                                <span className="text-[11px] xl:text-xs font-bold text-[#0061a5] bg-white px-1.5 xl:px-2 py-0.5 rounded-md">{tickets.filter(t => t.status === 'In Progress').length}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 xl:px-2.5 xl:py-1.5 bg-[#e8f5e9] rounded-lg shrink-0">
                                <span className="text-[11px] xl:text-xs font-medium text-[#2e7d32]">Resolved</span>
                                <span className="text-[11px] xl:text-xs font-bold text-[#2e7d32] bg-white px-1.5 xl:px-2 py-0.5 rounded-md">{tickets.filter(t => t.status === 'Resolved').length}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search tickets..." 
                                className="w-full pl-9 pr-4 py-2 bg-white border border-[#e0e3e5] rounded-lg text-sm focus:outline-none focus:border-[#0061a5] transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {isStaff && (
                            <div className="flex gap-3">
                                <select 
                                    className="flex-1 px-3 py-2 text-sm text-[#43474e] bg-white border border-[#e0e3e5] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                                <select 
                                    className="flex-1 px-3 py-2 text-sm text-[#43474e] bg-white border border-[#e0e3e5] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="All">All Roles</option>
                                    <option value="LEARNER">Learner</option>
                                    <option value="TUTOR">Tutor</option>
                                </select>
                            </div>
                        )}
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
                            onClick={() => { setSelectedTicket(ticket); setIsCreating(false); markAsRead(ticket.id); }}
                            className={`p-4 border-b border-[#f1f4f6] cursor-pointer transition-colors ${selectedTicket?.id === ticket.id && !isCreating ? 'bg-[#f0f7ff] border-l-4 border-l-[#0061a5]' : 'hover:bg-[#f8f9fa] border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-[#74777f]">{ticket.ticket_number}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h3 className={`text-sm leading-tight mb-2 line-clamp-2 ${isUnread ? 'font-bold' : 'font-medium'} ${selectedTicket?.id === ticket.id && !isCreating ? 'text-[#0061a5]' : 'text-[#002045]'}`}>
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
                {isCreating ? (
                    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full flex-1 overflow-y-auto">
                        <button onClick={() => setIsCreating(false)} className="md:hidden flex items-center gap-1 text-[#0061a5] font-bold text-sm mb-4">
                            <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
                        </button>
                        <h2 className="text-2xl font-extrabold text-[#002045] mb-6">Create New Ticket</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#002045] mb-2">Category</label>
                                <select 
                                    className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5]"
                                    value={createCategory}
                                    onChange={(e) => setCreateCategory(e.target.value)}
                                >
                                    <option value="Technical Issue">Technical Issue</option>
                                    <option value="Academic Support">Academic Support</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#002045] mb-2">Subject</label>
                                <input 
                                    type="text" 
                                    placeholder="Briefly describe your issue..." 
                                    className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5]"
                                    value={createSubject}
                                    onChange={(e) => setCreateSubject(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#002045] mb-2">Description</label>
                                <textarea 
                                    rows={6} 
                                    placeholder="Provide details here..." 
                                    className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] resize-none"
                                    value={createDescription}
                                    onChange={(e) => setCreateDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsCreating(false)} className="px-6 py-2.5 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                                <button onClick={handleCreateSubmit} className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0061a5] hover:bg-[#004a80] transition-colors shadow-sm">Submit Ticket</button>
                            </div>
                        </div>
                    </div>
                ) : selectedTicket ? (
                    <>
                        {/* Detail Header */}
                        <div className="p-4 md:p-6 border-b border-[#e0e3e5] bg-white flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
                            <div className="flex-1">
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden flex items-center gap-1 text-[#0061a5] font-bold text-sm mb-2">
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
                                </button>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="text-lg md:text-xl font-extrabold text-[#002045] leading-tight">{selectedTicket.title}</h2>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border whitespace-nowrap ${getStatusStyle(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-[#74777f]">
                                    <span>ID: <strong>{selectedTicket.ticket_number}</strong></span>
                                    <span>Category: <strong>{selectedTicket.category}</strong></span>
                                    {isStaff && selectedTicket.sender_name && (
                                        <span className="flex items-center">
                                            From: <strong className="text-[#0061a5] ml-1">{selectedTicket.sender_name}</strong>
                                            {selectedTicket.sender_role && (
                                                <span className="text-[9px] font-bold bg-[#e0e3e5] text-[#43474e] px-1.5 py-0.5 rounded-md ml-2 tracking-wider">
                                                    {selectedTicket.sender_role.toUpperCase()}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {isStaff && selectedTicket.status !== 'Resolved' && (
                                <button 
                                    onClick={() => setShowResolveConfirm(true)} 
                                    className="shrink-0 flex items-center justify-center w-full md:w-auto px-4 py-2 bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] rounded-xl text-sm font-bold hover:bg-[#c8e6c9] transition-colors shadow-sm"
                                >
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
                                            <span className="text-xs font-bold text-[#43474e]">{msg.sender_id === userId ? 'You' : (msg.sender_name || (msg.sender_role === 'STAFF' ? 'Support Team' : msg.sender_role))}</span>
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

                        {resolveTimeLeft !== null && (
                            <div className="bg-[#fff8e1] border-l-4 border-[#ffe082] p-3 mx-6 my-2 rounded shadow-sm text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-[#f57f17] font-medium">
                                    This conversation will be auto-resolved in <b className="text-red-500">{resolveTimeLeft} minutes</b> due to inactivity. Do you want to continue?
                                </span>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={handleExtendTicket} className="bg-white border border-[#ffe082] text-[#f57f17] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#ffe082] transition-colors">Continue</button>
                                    <button onClick={() => setShowResolveConfirm(true)} className="bg-[#f57f17] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#e65100] transition-colors shadow-sm">Resolve now</button>
                                </div>
                            </div>
                        )}

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
                                                handleReplySubmit();
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={handleReplySubmit}
                                        className={`p-2.5 rounded-xl transition-all mb-1 flex items-center justify-center shrink-0
                                            ${replyText.trim() ? 'bg-[#0061a5] text-white shadow-md hover:bg-[#004a80]' : 'bg-[#e0e3e5] text-[#a1a4ad] cursor-not-allowed'}`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 border-t border-[#e0e3e5] bg-[#f8f9fa] text-center shrink-0">
                                <p className="text-[#74777f] text-sm">This ticket has been resolved and closed. If you need further assistance, please <button onClick={() => { setIsCreating(true); setSelectedTicket(null); }} className="text-[#0061a5] font-bold hover:underline">create a new ticket</button>.</p>
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

            {/* Resolve Confirmation Modal */}
            {showResolveConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full border border-[#e0e3e5] animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-extrabold text-[#002045] mb-2">Resolve Ticket</h3>
                        <p className="text-[#43474e] text-sm mb-6">Are you sure you want to mark this ticket as resolved? The user will not be able to reply anymore.</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowResolveConfirm(false)}
                                className="px-4 py-2 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setShowResolveConfirm(false);
                                    handleMarkResolved();
                                }}
                                className="px-4 py-2 rounded-xl font-bold text-white bg-[#0061a5] hover:bg-[#004a80] transition-colors shadow-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
