import { Link } from 'react-router-dom';
import type { DashboardAuditLog } from '../types/dashboard';

interface DashboardAuditLogsProps {
    logs: DashboardAuditLog[];
}

export const DashboardAuditLogs = ({ logs }: DashboardAuditLogsProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col mt-2">
            <div className="p-6 border-b border-[#e0e3e5] flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-[#181c1e]">Audit Logs</h2>
                <Link to="/admin/audit-logs" className="text-[#0061a5] text-sm font-medium hover:underline">View All Logs</Link>
            </div>
            <div className="p-0 overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-175">
                    <thead>
                        <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Date</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Time</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Admin Account</th>
                            <th className="py-4 px-6 text-xs font-bold text-[#43474e]">Action Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f7fafc]">
                                <td className="py-4 px-6">
                                    <div className="text-sm font-bold text-[#181c1e]">{log.date}</div>
                                </td>
                                <td className="py-4 px-6 text-sm font-medium text-[#74777f]">
                                    {log.time}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs ${log.type === 'system' ? 'bg-[#43474e]' : log.adminRole === 'Super Admin' ? 'bg-[#0061a5]' : 'bg-[#fceeee] text-[#ba1a1a]'}`}>
                                            {log.adminInitials}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-[#002045]">{log.adminName}</div>
                                            <div className="text-xs text-[#74777f]">{log.adminRole}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-sm text-[#43474e]">{log.actionDetails}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
