import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateSupportTicket = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto mt-[40px] bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[40px] text-center animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-[#d2e4ff] flex items-center justify-center mx-auto mb-[24px]">
                    <CheckCircle2 className="w-8 h-8 text-[#0061a5]" />
                </div>
                <h2 className="text-[24px] font-bold text-[#181c1e] mb-[16px]">Ticket Created Successfully!</h2>
                <p className="text-[16px] text-[#43474e] mb-[32px]">Our support team has received your request and will respond within 24 hours.</p>
                <Link to={`/learner/support`} className="inline-block px-[24px] py-[10px] bg-[#002045] text-white rounded-[8px] font-semibold hover:bg-[#0061a5] transition-colors">
                    Back to Tickets
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-[24px] animate-fade-in-up">
            <div className="flex items-center gap-[16px]">
                <Link to={`/learner/support`} className="text-[#0061a5] hover:underline font-medium text-[14px]">← Back to Tickets</Link>
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Submit a Support Ticket</h1>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-[24px] md:p-[32px] space-y-[24px]">
                
                <div className="space-y-[8px]">
                    <label className="text-[14px] font-semibold text-[#181c1e]">Topic / Category</label>
                    <select 
                        className="w-full px-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" 
                        required
                    >
                        <option value="" disabled selected>Select a category...</option>
                        <option value="technical">Technical Issue (System Bug)</option>
                        <option value="payment">Payment & Billing</option>
                        <option value="academic">Academic & Curriculum</option>
                        <option value="facility">Facility & Classroom</option>
                        <option value="other">Other Inquiry</option>
                    </select>
                </div>

                <div className="space-y-[8px]">
                    <label className="text-[14px] font-semibold text-[#181c1e]">Subject</label>
                    <input 
                        type="text" 
                        placeholder="Briefly describe your issue..." 
                        className="w-full px-[16px] py-[10px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20" 
                        required 
                    />
                </div>

                <div className="space-y-[8px]">
                    <label className="text-[14px] font-semibold text-[#181c1e]">Description</label>
                    <textarea 
                        rows={6} 
                        className="w-full px-[16px] py-[12px] bg-white border border-[#c4c6cf] rounded-[8px] text-[16px] focus:outline-none focus:border-[#0061a5] focus:ring-[3px] focus:ring-[#0061a5]/20 resize-none"
                        placeholder="Please provide as much detail as possible so we can assist you better..."
                        required
                    ></textarea>
                </div>

                <div className="pt-[16px] border-t border-[#e0e3e5] flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="bg-[#002045] text-white px-[32px] py-[12px] rounded-[8px] font-semibold flex items-center gap-[8px] hover:bg-[#0061a5] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : <><Send className="w-5 h-5"/> Submit Ticket</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateSupportTicket;
