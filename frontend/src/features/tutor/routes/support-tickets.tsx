import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { SupportTicketService } from '@/shared/services/support-ticket.service';
import type { SupportTicket, CreateSupportTicketData } from '@/shared/services/support-ticket.service';
import { SupportTicketList } from '../components/SupportTicketList';
import { SupportTicketDetail } from '../components/SupportTicketDetail';
import { CreateSupportTicketForm } from '../components/CreateSupportTicketForm';

import Cookies from 'js-cookie';

export const TutorSupportTickets = () => {
    const userInfoCookie = Cookies.get('user_info');
    const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
    const userId = userInfo?.id || 'anonymous';
    const userRole = userInfo?.role ? String(userInfo.role).toUpperCase() : 'TUTOR';

    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    useEffect(() => {
        const fetchTickets = async () => {
            const data = await SupportTicketService.getTickets(userId, userRole);
            setTickets(data);
            if (data.length > 0) {
                setSelectedTicket(data[0]);
            }
        };
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateSubmit = async (data: Omit<CreateSupportTicketData, 'sender_id' | 'sender_role'>) => {
        try {
            const newTicket = await SupportTicketService.createTicket({
                ...data,
                sender_id: userId,
                sender_role: 'TUTOR'
            });
            setTickets([newTicket, ...tickets]);
            setIsCreating(false);
            setSelectedTicket(newTicket);
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    };

    const handleReplySubmit = async () => {
        if (!selectedTicket || !replyText.trim()) return;
        
        const newMsg = await SupportTicketService.replyToTicket(selectedTicket.id, replyText, userId, userRole);
        
        const updatedTicket = {
            ...selectedTicket,
            messages: [...(selectedTicket.messages || []), newMsg],
            updated_at: new Date().toISOString()
        };

        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
        setReplyText('');
    };

    const handleResolveClick = async () => {
        if (!selectedTicket) return;
        await SupportTicketService.updateTicketStatus(selectedTicket.id, 'Resolved');
        const updatedTicket = { ...selectedTicket, status: 'Resolved' as const };
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
    };

    return (
        <div className="flex h-[calc(100vh-128px)] md:h-[calc(100vh-144px)] bg-white overflow-hidden font-sans text-[#181c1e] rounded-2xl border border-[#e0e3e5] shadow-sm -mt-2">
            <SupportTicketList 
                tickets={filteredTickets}
                selectedTicketId={selectedTicket?.id}
                isCreating={isCreating}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSelectTicket={(ticket) => { setSelectedTicket(ticket); setIsCreating(false); }}
                onCreateClick={() => { setIsCreating(true); setSelectedTicket(null); }}
            />

            {/* Right Side - Detail / Chat View */}
            <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                {isCreating ? (
                    <CreateSupportTicketForm 
                        onCancel={() => setIsCreating(false)}
                        onSubmit={handleCreateSubmit}
                    />
                ) : selectedTicket ? (
                    <SupportTicketDetail 
                        ticket={selectedTicket}
                        replyText={replyText}
                        onReplyTextChange={setReplyText}
                        onReplySubmit={handleReplySubmit}
                        onResolveClick={handleResolveClick}
                        onBackClick={() => setSelectedTicket(null)}
                    />
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

export default TutorSupportTickets;
