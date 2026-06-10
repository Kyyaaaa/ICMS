import { Activity } from 'lucide-react';
import type { AuditLog, ActionType } from '../types/audit-log';

interface AuditLogTableProps {
    logs: AuditLog[];
}

export const AuditLogTable = ({ logs }: AuditLogTableProps) => {
    const getActionBadge = (type: ActionType) => {
        switch (type) {
            case 'CREATE': return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-md border border-green-200">CREATE</span>;
            case 'UPDATE': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-md border border-blue-200">UPDATE</span>;
            case 'DELETE': return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[11px] font-bold rounded-md border border-red-200">DELETE</span>;
            case 'APPROVE': return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[11px] font-bold rounded-md border border-purple-200">APPROVE</span>;
            case 'SYSTEM': return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-md border border-gray-300">SYSTEM</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Date & Time</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Admin Account</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Action</th>
                            <th className="py-4 px-6 text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? logs.map(log => {
                            const dateObj = new Date(log.timestamp);
                            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            
                            return (
                                <tr key={log.id} className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f8f9fa] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-bold text-[#181c1e]">{dateStr}</div>
                                        <div className="text-[13px] text-[#74777f] font-medium mt-0.5">{timeStr}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] shadow-sm ${
                                                log.adminInitials === 'SY' ? 'bg-[#43474e] text-white' : 'bg-[#0061a5] text-white'
                                            }`}>
                                                {log.adminInitials}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-[#002045]">{log.adminName}</div>
                                                <div className="text-[12px] text-[#74777f] font-medium mt-0.5">{log.adminRole}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {getActionBadge(log.actionType)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] text-[#43474e] leading-relaxed block max-w-lg">{log.details}</span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={4} className="py-12 text-center">
                                    <Activity size={48} className="mx-auto mb-4 text-[#c4c6cf]" />
                                    <p className="text-[16px] font-bold text-[#181c1e]">No logs found</p>
                                    <p className="text-[14px] text-[#74777f] mt-1">Adjust your search or filter to find specific activities.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
