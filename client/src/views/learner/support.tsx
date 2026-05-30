import React from 'react';
import { MessageSquare, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportTickets = () => {
    const tickets = [
        { id: 'TKT-1001', subject: 'Unable to access reading materials', date: 'Oct 15, 2024', status: 'resolved' },
        { id: 'TKT-1002', subject: 'Question about payment refund', date: 'Oct 16, 2024', status: 'open' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return <CheckCircle2 className="w-4 h-4 text-[#0061a5]" />;
            case 'open': return <Clock className="w-4 h-4 text-[#c9a82c]" />;
            case 'closed': return <XCircle className="w-4 h-4 text-[#74777f]" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'resolved': return <span className="px-[8px] py-[4px] bg-[#d2e4ff] text-[#0061a5] text-[12px] font-bold rounded uppercase">Resolved</span>;
            case 'open': return <span className="px-[8px] py-[4px] bg-[#fff8e1] text-[#c9a82c] text-[12px] font-bold rounded uppercase">Open</span>;
            case 'closed': return <span className="px-[8px] py-[4px] bg-[#e5e9eb] text-[#74777f] text-[12px] font-bold rounded uppercase">Closed</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-[24px] max-w-6xl animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Support Tickets</h1>
                
                <Link to="/learner/support/new" className="bg-[#002045] text-white px-[16px] py-[10px] rounded-[8px] font-semibold flex items-center gap-[8px] hover:bg-[#0061a5] transition-colors">
                    <Plus className="w-5 h-5"/> New Ticket
                </Link>
            </div>
            
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Ticket ID</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Subject</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Created Date</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e]">Status</th>
                                <th className="py-[16px] px-[24px] text-[14px] font-semibold text-[#181c1e] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc] transition-colors">
                                    <td className="py-[16px] px-[24px] font-medium text-[#181c1e]">{ticket.id}</td>
                                    <td className="py-[16px] px-[24px] text-[#43474e]">{ticket.subject}</td>
                                    <td className="py-[16px] px-[24px] text-[#43474e]">{ticket.date}</td>
                                    <td className="py-[16px] px-[24px]">
                                        <div className="flex items-center gap-[8px]">
                                            {getStatusIcon(ticket.status)}
                                            {getStatusBadge(ticket.status)}
                                        </div>
                                    </td>
                                    <td className="py-[16px] px-[24px] text-right">
                                        <Link to={`/learner/support/${ticket.id}`} className="inline-block px-[16px] py-[6px] bg-white border border-[#002045] text-[#002045] text-[12px] font-semibold rounded hover:bg-[#d2e4ff] transition-colors">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-[48px] text-center text-[#74777f]">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-[16px] text-[#e0e3e5]" />
                                        <p>You haven't submitted any support tickets yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;
