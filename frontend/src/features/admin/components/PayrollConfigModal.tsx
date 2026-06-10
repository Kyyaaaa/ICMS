import { Settings, X } from 'lucide-react';
import type { EmployeeSalaryConfig } from '../types/payroll';

interface PayrollConfigModalProps {
    config: EmployeeSalaryConfig;
    formData: Partial<EmployeeSalaryConfig>;
    setFormData: (data: Partial<EmployeeSalaryConfig>) => void;
    onClose: () => void;
    onSave: () => void;
}

export const PayrollConfigModal = ({ config, formData, setFormData, onClose, onSave }: PayrollConfigModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-slide-up my-auto">
                <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                    <div className="flex items-center gap-3">
                        <Settings className="text-[#0061a5]" size={24} />
                        <h2 className="text-[20px] font-bold text-[#002045]">Edit Salary Config</h2>
                    </div>
                    <button onClick={onClose} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                </div>
                <div className="p-6">
                    <div className="mb-6 pb-6 border-b border-[#e0e3e5]">
                        <h2 className="text-[20px] font-bold text-[#181c1e]">{config.staffName}</h2>
                        <p className="text-[#43474e]">{config.role} • {config.staffId}</p>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.role !== 'Tutor' ? (
                            <>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#43474e] mb-1">Monthly Base Salary (đ)</label>
                                    <input 
                                        type="number" 
                                        value={formData.baseSalary} 
                                        onChange={e => setFormData({...formData, baseSalary: parseInt(e.target.value) || 0})}
                                        className="w-full px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#43474e] mb-1">Overtime Rate per Hour (đ)</label>
                                    <input 
                                        type="number" 
                                        value={formData.overtimeRate} 
                                        onChange={e => setFormData({...formData, overtimeRate: parseInt(e.target.value) || 0})}
                                        className="w-full px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#43474e] mb-1">Default Rate per Session (đ)</label>
                                    <input 
                                        type="number" 
                                        value={formData.ratePerSession} 
                                        onChange={e => setFormData({...formData, ratePerSession: parseInt(e.target.value) || 0})}
                                        className="w-full px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                    />
                                    <p className="text-[12px] text-[#74777f] mt-1">This rate will be used as the default multiplier when generating monthly payslips for this tutor.</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#e0e3e5]">
                        <button onClick={onClose} className="px-6 py-2.5 font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">Cancel</button>
                        <button onClick={onSave} className="px-6 py-2.5 font-bold text-white bg-[#0061a5] hover:bg-[#004d80] rounded-xl transition-colors">Save Configuration</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
