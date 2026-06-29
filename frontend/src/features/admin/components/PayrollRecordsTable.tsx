import { type PayrollRecord, calculateNetPay } from '../types/payroll';

interface PayrollRecordsTableProps {
    records: PayrollRecord[];
    onView: (record: PayrollRecord) => void;
}

export const PayrollRecordsTable = ({ records, onView }: PayrollRecordsTableProps) => {
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Pending': return 'bg-[#fff8e1] text-[#c9a82c]';
            case 'Processed': return 'bg-[#e6f0fa] text-[#0061a5]';
            case 'Paid': return 'bg-[#e6f4ea] text-[#137333]';
            default: return 'bg-[#f1f4f6] text-[#74777f]';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-225">
                <thead>
                    <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                        <th className="py-3 px-4 text-sm font-semibold text-[#43474e]">Employee Name</th>
                        <th className="py-3 px-4 text-sm font-semibold text-[#43474e]">Role</th>
                        <th className="py-3 px-4 text-sm font-semibold text-[#43474e]">Base / Sessions Taught</th>
                        <th className="py-3 px-4 text-sm font-semibold text-[#43474e]">Net Pay</th>
                        <th className="py-3 px-4 text-sm font-semibold text-[#43474e]">Status</th>
                        <th className="py-3 px-4 text-sm font-semibold text-[#43474e] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(p => (
                        <tr key={p.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                            <td className="py-3 px-4">
                                <div className="font-bold text-[#181c1e]">{p.staffName}</div>
                                <div className="text-xs text-[#74777f]">{p.email} • {p.accountCode}</div>
                            </td>
                            <td className="py-3 px-4 text-sm text-[#43474e]">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${p.role !== 'TUTOR' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#e6f4ea] text-[#137333]'}`}>{p.role}</span>
                            </td>
                            <td className="py-3 px-4 text-sm text-[#43474e]">
                                {p.role !== 'TUTOR' ? `${(p.baseSalary || 0).toLocaleString()}đ` : `${p.teachingSessions || 0} sessions`}
                            </td>
                            <td className="py-3 px-4 text-sm font-bold text-[#0061a5]">{calculateNetPay(p).toLocaleString()}đ</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getStatusBadge(p.status)}`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <button 
                                    onClick={() => onView(p)}
                                    className="px-4 py-2 bg-[#e6f0fa] text-[#0061a5] hover:bg-[#cce0f5] font-bold rounded-lg text-xs transition-colors"
                                >
                                    {p.status === 'Pending' ? 'Process Payroll' : 'View Payslip'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {records.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-[#74777f]">No payroll records found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
