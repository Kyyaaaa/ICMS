import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { CreateSupportTicketData } from '../types/support-ticket';

interface CreateSupportTicketFormProps {
    onCancel: () => void;
    onSubmit: (data: CreateSupportTicketData) => void;
}

export const CreateSupportTicketForm = ({ onCancel, onSubmit }: CreateSupportTicketFormProps) => {
    const [category, setCategory] = useState('Facility & Equipment');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ category, subject, description });
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto w-full flex-1 overflow-y-auto">
            <button onClick={onCancel} className="md:hidden flex items-center gap-1 text-[#0061a5] font-bold text-[14px] mb-4">
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
            </button>
            <h2 className="text-[24px] font-extrabold text-[#002045] mb-6">Create New Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[14px] font-bold text-[#002045] mb-2">Category</label>
                    <select 
                        required
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5]"
                    >
                        <option>Facility & Equipment</option>
                        <option>Schedule Issue</option>
                        <option>System Issue</option>
                        <option>Payroll</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[14px] font-bold text-[#002045] mb-2">Subject</label>
                    <input 
                        required
                        type="text" 
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="Briefly describe your issue..." 
                        className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5]" 
                    />
                </div>
                <div>
                    <label className="block text-[14px] font-bold text-[#002045] mb-2">Description</label>
                    <textarea 
                        required
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={6} 
                        placeholder="Provide details here..." 
                        className="w-full p-3 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] resize-none"
                    ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0061a5] hover:bg-[#004a80] transition-colors shadow-sm">Submit Ticket</button>
                </div>
            </form>
        </div>
    );
};
