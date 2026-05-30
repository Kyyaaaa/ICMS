import React from 'react';
import { Clock, User, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const TicketDetail = () => {
    const { id } = useParams();

    return (
        <div className="max-w-4xl mx-auto space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/support`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Tickets</Link>
            </div>
            
            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                {/* Header */}
                <div className="p-[24px] md:p-[32px] border-b border-[#e0e3e5] bg-[#f7fafc]">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-[16px]">
                        <div>
                            <div className="flex items-center gap-[12px] mb-[8px]">
                                <span className="px-[8px] py-[4px] bg-[#fff8e1] text-[#c9a82c] text-[12px] font-bold rounded uppercase">Open</span>
                                <span className="text-[#74777f] font-medium text-[14px]">{id}</span>
                            </div>
                            <h1 className="text-[20px] md:text-[24px] font-bold text-[#181c1e]">Question about payment refund</h1>
                        </div>
                        <div className="text-[12px] text-[#74777f] text-right">
                            Created: Oct 16, 2024<br/>
                            Category: Payment & Billing
                        </div>
                    </div>
                </div>

                {/* Conversation */}
                <div className="p-[24px] md:p-[32px] space-y-[32px]">
                    
                    {/* Learner Message */}
                    <div className="flex gap-[16px]">
                        <div className="w-10 h-10 rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold shrink-0">
                            JD
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-[8px] mb-[4px]">
                                <span className="font-bold text-[#181c1e]">John Doe (You)</span>
                                <span className="text-[12px] text-[#74777f] flex items-center gap-1"><Clock className="w-3 h-3"/> Oct 16, 14:30</span>
                            </div>
                            <div className="bg-[#f7fafc] border border-[#e0e3e5] rounded-[8px] rounded-tl-none p-[16px] text-[#43474e] text-[14px] leading-relaxed">
                                Hello, I submitted a refund request yesterday for my IELTS Academic Writing class. I would like to know the current status of my request. How long does the process usually take?
                            </div>
                        </div>
                    </div>

                    {/* Staff Message */}
                    <div className="flex gap-[16px]">
                        <div className="w-10 h-10 rounded-full bg-[#e5e9eb] text-[#43474e] flex items-center justify-center font-bold shrink-0">
                            <ShieldAlert className="w-5 h-5"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-[8px] mb-[4px]">
                                <span className="font-bold text-[#181c1e]">Support Staff</span>
                                <span className="text-[12px] text-[#74777f] flex items-center gap-1"><Clock className="w-3 h-3"/> Oct 16, 16:15</span>
                            </div>
                            <div className="bg-[#f1f4f6] border border-[#e0e3e5] rounded-[8px] rounded-tl-none p-[16px] text-[#43474e] text-[14px] leading-relaxed">
                                Hi John,<br/><br/>
                                Thank you for contacting us. We have received your refund request. The administration team is currently reviewing it. Typically, refunds are processed within 2-3 business days if all conditions are met. <br/><br/>
                                You will receive an automated email once it's approved. Let us know if you need any further assistance!
                            </div>
                        </div>
                    </div>

                </div>

                {/* Reply Form */}
                <div className="p-[24px] md:p-[32px] border-t border-[#e0e3e5] bg-[#f7fafc]">
                    <div className="flex gap-[16px]">
                        <div className="w-10 h-10 rounded-full bg-[#d2e4ff] text-[#0061a5] flex items-center justify-center font-bold shrink-0 mt-1 hidden sm:flex">
                            JD
                        </div>
                        <div className="flex-1">
                            <textarea 
                                rows={3} 
                                className="w-full px-[16px] py-[12px] bg-white border border-[#c4c6cf] rounded-[8px] text-[14px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 resize-none mb-[12px]"
                                placeholder="Type your reply here..."
                            ></textarea>
                            <div className="flex justify-end">
                                <button className="bg-[#002045] text-white px-[24px] py-[8px] rounded-[8px] text-[14px] font-semibold hover:bg-[#0061a5] transition-colors">
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;
