import { Edit2 } from 'lucide-react';
import type { EmployeeSalaryConfig } from '../types/payroll';

interface PayrollConfigTableProps {
    configs: EmployeeSalaryConfig[];
    onEdit: (config: EmployeeSalaryConfig) => void;
}

export const PayrollConfigTable = ({ configs, onEdit }: PayrollConfigTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
                <thead>
                    <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                        <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Employee</th>
                        <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Role</th>
                        <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Base / Session Rate</th>
                        <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">OT Rate / Hr</th>
                        <th className="py-4 px-6 text-sm font-semibold text-[#43474e] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {configs.map(c => (
                        <tr key={c.staffId} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                            <td className="py-4 px-6">
                                <div className="font-bold text-[#181c1e]">{c.staffName}</div>
                                <div className="text-xs text-[#74777f]">{c.staffId}</div>
                            </td>
                            <td className="py-4 px-6 text-sm text-[#43474e]">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${c.role !== 'Tutor' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#e6f4ea] text-[#137333]'}`}>{c.role}</span>
                            </td>
                            <td className="py-4 px-6 text-sm font-bold text-[#0061a5]">
                                {c.role !== 'Tutor' ? `${c.baseSalary.toLocaleString()}đ (Monthly)` : `${c.ratePerSession.toLocaleString()}đ (Session)`}
                            </td>
                            <td className="py-4 px-6 text-sm text-[#43474e]">
                                {c.role !== 'Tutor' ? `${c.overtimeRate.toLocaleString()}đ` : '-'}
                            </td>
                            <td className="py-4 px-6 text-right">
                                <button 
                                    onClick={() => onEdit(c)}
                                    className="inline-flex p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors"
                                    title="Edit Salary Details"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {configs.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-[#74777f]">No configurations found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
