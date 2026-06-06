import { useState } from 'react';
import { Search, Filter, Calendar, Activity } from 'lucide-react';

type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'SYSTEM';

type AuditLog = {
    id: string;
    timestamp: string; // ISO Date String
    adminInitials: string;
    adminName: string;
    adminRole: string;
    actionType: ActionType;
    details: string;
};

const mockLogs: AuditLog[] = [
    {
        id: 'L001',
        timestamp: '2026-10-30T14:23:01',
        adminInitials: 'DV',
        adminName: 'Do Hong Vy',
        adminRole: 'Super Admin',
        actionType: 'APPROVE',
        details: 'Approved refund REF-1002 for Learner: Alex Johnson'
    },
    {
        id: 'L002',
        timestamp: '2026-10-30T12:15:42',
        adminInitials: 'SY',
        adminName: 'System Engine',
        adminRole: 'Automated Task',
        actionType: 'SYSTEM',
        details: 'Daily automated database backup to cloud storage completed'
    },
    {
        id: 'L003',
        timestamp: '2026-10-30T09:05:11',
        adminInitials: 'NA',
        adminName: 'Nguyen Van A',
        adminRole: 'Academic Admin',
        actionType: 'CREATE',
        details: 'Created new course IELTS Intensive Mastery (IEL-INT-01)'
    },
    {
        id: 'L004',
        timestamp: '2026-10-29T16:45:22',
        adminInitials: 'DV',
        adminName: 'Do Hong Vy',
        adminRole: 'Super Admin',
        actionType: 'UPDATE',
        details: 'Updated payroll configuration for Tutor: Tran Thi B'
    },
    {
        id: 'L005',
        timestamp: '2026-10-28T10:12:05',
        adminInitials: 'NA',
        adminName: 'Nguyen Van A',
        adminRole: 'Academic Admin',
        actionType: 'DELETE',
        details: 'Deleted classroom allocation for Math 101'
    }
];

const AdminAuditLogs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<'ALL' | ActionType>('ALL');
    const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Last 7 Days'>('All');

    const filteredLogs = mockLogs.filter(log => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            log.adminName.toLowerCase().includes(query) || 
            log.details.toLowerCase().includes(query);
            
        const matchesAction = actionFilter === 'ALL' || log.actionType === actionFilter;
        
        // Simple date filter logic for demonstration
        let matchesDate = true;
        if (dateFilter === 'Today') {
            matchesDate = log.timestamp.includes('2026-10-30'); // Mocking "Today"
        } else if (dateFilter === 'Last 7 Days') {
            matchesDate = true; // All mock data is within 7 days
        }

        return matchesSearch && matchesAction && matchesDate;
    });

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
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">System Audit Logs</h1>
                    <p className="text-[#43474e] text-[15px] mt-1">Track and monitor all administrative actions across the platform.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e0e3e5] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="relative w-full lg:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input 
                        className="w-full pl-11 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#0061a5] transition-colors" 
                        placeholder="Search by action details or admin name..." 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#74777f]" />
                        <select 
                            value={actionFilter}
                            onChange={e => setActionFilter(e.target.value as 'ALL' | ActionType)}
                            className="px-4 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer"
                        >
                            <option value="ALL">All Actions</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                            <option value="APPROVE">Approve</option>
                            <option value="SYSTEM">System</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#74777f]" />
                        <select 
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value as 'All' | 'Today' | 'Last 7 Days')}
                            className="px-4 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer"
                        >
                            <option value="All">All Time</option>
                            <option value="Today">Today</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                        </select>
                    </div>
                </div>
            </div>

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
                            {filteredLogs.length > 0 ? filteredLogs.map(log => {
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
        </div>
    );
};

export default AdminAuditLogs;
