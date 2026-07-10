import { getLocalDateString } from '../../../utils/date';
import { Wallet, DollarSign, Calculator, X, CheckCircle2 } from 'lucide-react';
import { type PayrollRecord, calculateNetPay } from '../types/payroll';

interface PayrollRecordModalProps {
    record: PayrollRecord;
    formData: Partial<PayrollRecord>;
    setFormData: (data: Partial<PayrollRecord>) => void;
    onClose: () => void;
    onSave: () => void;
}

export const PayrollRecordModal = ({ record, formData, setFormData, onClose, onSave }: PayrollRecordModalProps) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-[#fff8e1] text-[#c9a82c]';
            case 'Processed': return 'bg-[#e6f0fa] text-[#0061a5]';
            case 'Paid': return 'bg-[#e6f4ea] text-[#137333]';
            default: return 'bg-[#f1f4f6] text-[#74777f]';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-slide-up my-auto">
                <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc] shrink-0">
                    <div className="flex items-center gap-3">
                        <Wallet className="text-[#0061a5]" size={24} />
                        <h2 className="text-xl font-bold text-[#002045]">Payslip Details: {record.month.split('-').reverse().join('/')}</h2>
                    </div>
                    <button onClick={onClose} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-[#e0e3e5]">
                        <div>
                            <h2 className="text-2xl font-bold text-[#181c1e]">{record.staffName}</h2>
                            <p className="text-[#43474e]">{record.role} • {record.email} • {record.accountCode}</p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <p className="text-xs text-[#74777f] font-bold uppercase mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full uppercase ${getStatusBadge(formData.status || '')}`}>
                                {formData.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-base font-bold text-[#181c1e] mb-4 flex items-center gap-2"><DollarSign size={18} /> Earnings</h3>
                            <div className="space-y-4">
                                {formData.role !== 'TUTOR' ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-[#43474e] mb-1">Base Salary (Monthly - VND)</label>
                                            <input
                                                type="number"
                                                value={formData.baseSalary || ''}
                                                onChange={e => setFormData({ ...formData, baseSalary: parseInt(e.target.value) || 0 })}
                                                disabled={formData.status !== 'Pending'}
                                                className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">OT Hours</label>
                                                <input
                                                    type="number"
                                                    value={formData.overtimeHours || ''}
                                                    onChange={e => setFormData({ ...formData, overtimeHours: parseFloat(e.target.value) || 0 })}
                                                    disabled={formData.status !== 'Pending'}
                                                    className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">OT Rate/Hr</label>
                                                <input
                                                    type="number"
                                                    value={formData.overtimeRate || ''}
                                                    onChange={e => setFormData({ ...formData, overtimeRate: parseInt(e.target.value) || 0 })}
                                                    disabled={formData.status !== 'Pending'}
                                                    className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">Sessions Taught</label>
                                                <input
                                                    type="number"
                                                    value={formData.teachingSessions || ''}
                                                    onChange={e => setFormData({ ...formData, teachingSessions: parseInt(e.target.value) || 0 })}
                                                    disabled={formData.status !== 'Pending'}
                                                    className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">Rate Per Session</label>
                                                <input
                                                    type="number"
                                                    value={formData.ratePerSession || ''}
                                                    onChange={e => setFormData({ ...formData, ratePerSession: parseInt(e.target.value) || 0 })}
                                                    disabled={formData.status !== 'Pending'}
                                                    className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-[#43474e] mb-1">Bonus / Allowances (đ)</label>
                                    <input
                                        type="number"
                                        value={formData.bonus || ''}
                                        onChange={e => setFormData({ ...formData, bonus: parseInt(e.target.value) || 0 })}
                                        disabled={formData.status !== 'Pending'}
                                        className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-[#f8f9fa] rounded-lg border border-[#e6f0fa] flex justify-between items-center">
                                <span className="text-[#0061a5] font-bold text-sm">Total Earnings</span>
                                <span className="font-bold text-[#0061a5] text-base">
                                    {(() => {
                                        if (formData.role !== 'TUTOR') {
                                            return ((formData.baseSalary || 0) + ((formData.overtimeHours || 0) * (formData.overtimeRate || 0)) + (formData.bonus || 0)).toLocaleString('en-US') + 'VND';
                                        } else {
                                            return (((formData.teachingSessions || 0) * (formData.ratePerSession || 0)) + (formData.bonus || 0)).toLocaleString('en-US') + 'VND';
                                        }
                                    })()}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-[#181c1e] mb-4 flex items-center gap-2"><Calculator size={18} /> Deductions</h3>
                            <div className="space-y-3">
                                {(formData.deductionItems || []).map((item, index) => (
                                    <div key={item.id} className="flex gap-2 items-start">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Reason (e.g. Tax, Late...)"
                                                value={item.reason}
                                                onChange={(e) => {
                                                    const newItems = [...(formData.deductionItems || [])];
                                                    newItems[index].reason = e.target.value;
                                                    setFormData({ ...formData, deductionItems: newItems });
                                                }}
                                                disabled={formData.status !== 'Pending'}
                                                className="w-full px-3 py-2 text-xs border border-[#ffebed] rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#ba1a1a] disabled:bg-[#f1f4f6]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Amount (đ)"
                                                value={item.amount || ''}
                                                onChange={(e) => {
                                                    const newItems = [...(formData.deductionItems || [])];
                                                    newItems[index].amount = parseInt(e.target.value) || 0;
                                                    setFormData({ ...formData, deductionItems: newItems });
                                                }}
                                                disabled={formData.status !== 'Pending'}
                                                className="w-full px-3 py-2 text-xs font-bold border border-[#ffebed] rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#ba1a1a] disabled:bg-[#f1f4f6]"
                                            />
                                        </div>
                                        {formData.status === 'Pending' && (
                                            <button
                                                onClick={() => {
                                                    const newItems = [...(formData.deductionItems || [])];
                                                    newItems.splice(index, 1);
                                                    setFormData({ ...formData, deductionItems: newItems });
                                                }}
                                                className="p-2 mt-1 text-[#ba1a1a] hover:bg-[#ffebed] rounded-lg transition-colors"
                                                title="Remove deduction"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {formData.status === 'Pending' && (
                                    <button
                                        onClick={() => {
                                            const newItems = [...(formData.deductionItems || [])];
                                            newItems.push({ id: Math.random().toString(), reason: '', amount: 0 });
                                            setFormData({ ...formData, deductionItems: newItems });
                                        }}
                                        className="text-[#0061a5] font-bold text-xs flex items-center gap-1 mt-2 hover:underline"
                                    >
                                        + Add Deduction
                                    </button>
                                )}
                            </div>
                            <div className="mt-4 p-3 bg-[#fff0f0] rounded-lg border border-[#ffccd2] flex justify-between items-center">
                                <span className="text-[#ba1a1a] font-bold text-sm">Total Deductions</span>
                                <span className="font-bold text-[#ba1a1a] text-base">
                                    {(formData.deductionItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0).toLocaleString('en-US')}đ
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#e6f0fa] rounded-xl p-6 flex justify-between items-center border border-[#0061a5] shadow-sm mb-6">
                        <div>
                            <span className="block text-sm text-[#002045] uppercase font-bold tracking-wider">Final Net Pay</span>
                            <span className="text-xs text-[#0061a5] mt-1">Amount to be transferred</span>
                        </div>
                        <span className="text-3xl md:text-4xl font-extrabold text-[#0061a5] tracking-tight">
                            {calculateNetPay(formData).toLocaleString('en-US')}đ
                        </span>
                    </div>

                    </div>

                <div className="flex justify-end gap-3 p-4 border-t border-[#e0e3e5] bg-[#f7fafc] shrink-0">
                        <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">
                            Close
                        </button>

                        {formData.status === 'Pending' && (
                            <button
                                onClick={() => { setFormData({ ...formData, status: 'Processed' }); }}
                                className="px-6 py-3 text-sm font-bold text-white bg-[#0061a5] hover:bg-[#004d80] rounded-xl transition-colors flex items-center gap-2"
                            >
                                <CheckCircle2 size={18} /> Mark Processed
                            </button>
                        )}

                        {record.status === 'Processed' && formData.status === 'Processed' && (
                            <button
                                onClick={() => { setFormData({ ...formData, status: 'Paid', paymentDate: getLocalDateString() }); }}
                                className="px-6 py-3 text-sm font-bold text-white bg-[#137333] hover:bg-[#0d5022] rounded-xl transition-colors flex items-center gap-2"
                            >
                                <DollarSign size={18} /> Confirm Paid
                            </button>
                        )}

                        {(formData.status === 'Processed' && record.status === 'Pending') && (
                            <button
                                onClick={onSave}
                                className="px-6 py-3 text-sm font-bold text-white bg-[#181c1e] hover:bg-[#000000] rounded-xl transition-colors"
                            >
                                Save Changes
                            </button>
                        )}

                        {formData.status === 'Paid' && (
                            <button
                                onClick={onSave}
                                className="px-6 py-3 text-sm font-bold text-white bg-[#181c1e] hover:bg-[#000000] rounded-xl transition-colors"
                            >
                                Save Changes
                            </button>
                        )}

                        {formData.status === 'Pending' && (
                            <button
                                onClick={onSave}
                                className="px-6 py-3 text-sm font-bold text-white bg-[#181c1e] hover:bg-[#000000] rounded-xl transition-colors"
                            >
                                Save Draft
                            </button>
                        )}
                    </div>
                </div>
            </div>
    );
};
