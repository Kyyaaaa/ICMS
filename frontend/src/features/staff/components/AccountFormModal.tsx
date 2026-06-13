import { X, RefreshCw, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import type { Account, Role } from '../types/account';

interface AccountFormModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    modalMode: 'create' | 'edit';
    formData: Partial<Account> & { password?: string };
    setFormData: (data: Partial<Account> & { password?: string }) => void;
    isSaving: boolean;
    handleSave: (e: React.FormEvent) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    generatePassword: () => void;
}

export const AccountFormModal = ({
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formData,
    setFormData,
    isSaving,
    handleSave,
    showPassword,
    setShowPassword,
    generatePassword
}: AccountFormModalProps) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-scale-in">
                <div className="flex justify-between items-center p-6 border-b border-[#e0e3e5]">
                    <h2 className="text-xl font-bold text-[#002045]">
                        {modalMode === 'create' ? 'Create New Account' : 'Edit Account'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-[#74777f] hover:text-[#181c1e] transition-colors p-1 rounded-lg hover:bg-[#f1f4f6]">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.full_name}
                            onChange={e => setFormData({...formData, full_name: e.target.value})}
                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>

                    {modalMode === 'create' ? (
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                <select 
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value as Role})}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors cursor-pointer"
                                >
                                    <option value="LEARNER">Learner</option>
                                    <option value="TUTOR">Tutor</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Password</label>
                                    <button type="button" onClick={generatePassword} className="text-[#0061a5] text-xs font-bold hover:underline flex items-center gap-1 transition-colors">
                                        <RefreshCw size={12} /> Generate
                                    </button>
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                                        placeholder="Enter or generate"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors p-1">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Role</label>
                                    <input 
                                        type="text" 
                                        value={formData.role} 
                                        disabled 
                                        className="w-full px-4 py-2.5 bg-[#e0e3e5] border border-[#c4c6cf] rounded-xl text-sm text-[#74777f] font-bold cursor-not-allowed"
                                        title="Role cannot be changed after creation"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Status</label>
                                    <select 
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'BANNED'})}
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors cursor-pointer"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="BANNED">Banned</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">New Password <span className="text-[#74777f] font-normal normal-case">(Leave blank to keep)</span></label>
                                    <button type="button" onClick={generatePassword} className="text-[#0061a5] text-xs font-bold hover:underline flex items-center gap-1 transition-colors">
                                        <RefreshCw size={12} /> Generate
                                    </button>
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] focus:bg-white transition-colors"
                                        placeholder="Enter new password"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#002045] transition-colors p-1">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {formData.status === 'BANNED' && modalMode === 'edit' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 mt-2">
                            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700">This account is currently banned and cannot log in to the system.</p>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-[#e0e3e5]">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[#43474e] font-bold rounded-xl hover:bg-[#f1f4f6] transition-colors">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-[#0061a5] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors disabled:opacity-70 flex items-center gap-2">
                            {isSaving && <RefreshCw className="w-5 h-5 animate-spin" />}
                            {modalMode === 'create' ? 'Create Account' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
