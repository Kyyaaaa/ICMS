import { useState } from 'react';
import { X, UserPlus, Save, Search } from 'lucide-react';

interface AddStudentModalProps {
    availableLearners: { id: string; full_name: string; email: string; }[];
    onClose: () => void;
    onSave: (learnerId: string) => void;
}

export const AddStudentModal = ({ availableLearners, onClose, onSave }: AddStudentModalProps) => {
    const [selectedLearner, setSelectedLearner] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredLearners = availableLearners.filter(l => 
        l.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = () => {
        if (!selectedLearner) return;
        onSave(selectedLearner);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002045]/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                    <h3 className="text-lg font-bold text-[#002045] flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-[#0061a5]" /> Add Student
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 flex-1 overflow-hidden flex flex-col gap-4">
                    <div className="space-y-2 shrink-0">
                        <label className="text-sm font-semibold text-[#181c1e] flex items-center gap-1">
                            Search Learner
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-9 pr-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 font-medium text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto border border-[#c4c6cf] rounded-xl bg-[#f8f9fa] p-2 space-y-1">
                        {filteredLearners.length > 0 ? filteredLearners.map(learner => (
                            <div 
                                key={learner.id}
                                onClick={() => setSelectedLearner(learner.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                                    selectedLearner === learner.id 
                                        ? 'bg-[#e3f2fd] border-[#0061a5] text-[#0061a5]' 
                                        : 'bg-white border-transparent hover:border-[#c4c6cf] text-[#43474e]'
                                }`}
                            >
                                <div className="font-bold text-sm">{learner.full_name || 'Unknown Learner'}</div>
                                <div className="text-xs opacity-80">{learner.email}</div>
                            </div>
                        )) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No learners found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-[#e0e3e5] bg-[#f8f9fa] flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 font-semibold text-[#43474e] border border-[#c4c6cf] rounded-xl hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!selectedLearner}
                        className={`px-5 py-2.5 font-semibold text-white rounded-xl transition-colors flex items-center gap-2 ${
                            selectedLearner ? 'bg-[#0061a5] hover:bg-[#004a80]' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </div>
        </div>
    );
};
