import { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import type { ActionType, AuditLog } from '../types/audit-log';
import { AuditLogsService } from '../services/audit-logs.service';
import { AuditLogTable } from '../components/AuditLogTable';

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<'ALL' | ActionType>('ALL');
    const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Last 7 Days'>('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const data = await AuditLogsService.getLogs();
            setLogs(data);
            setLoading(false);
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            log.adminName.toLowerCase().includes(query) || 
            log.details.toLowerCase().includes(query);
            
        const matchesAction = actionFilter === 'ALL' || log.actionType === actionFilter;
        
        let matchesDate = true;
        if (dateFilter === 'Today') {
            matchesDate = log.timestamp.includes('2026-10-30'); // Mocking "Today"
        } else if (dateFilter === 'Last 7 Days') {
            matchesDate = true; // All mock data is within 7 days
        }

        return matchesSearch && matchesAction && matchesDate;
    });

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">System Audit Logs</h1>
                    <p className="text-[#43474e] text-sm mt-1">Track and monitor all administrative actions across the platform.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e0e3e5] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="relative w-full lg:w-100">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                    <input 
                        className="w-full pl-11 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#0061a5] transition-colors" 
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
                            className="px-4 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer"
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
                            className="px-4 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer"
                        >
                            <option value="All">All Time</option>
                            <option value="Today">Today</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <AuditLogTable logs={filteredLogs} />
            )}
        </div>
    );
};

export default AdminAuditLogs;
