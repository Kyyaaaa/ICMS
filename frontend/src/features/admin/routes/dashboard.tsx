import { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboard.service';
import type { DashboardStatsData, DashboardTransaction, DashboardAuditLog } from '../types/dashboard';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardTransactions } from '../components/DashboardTransactions';
import { DashboardAuditLogs } from '../components/DashboardAuditLogs';

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
    const [logs, setLogs] = useState<DashboardAuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            const [statsData, txnsData, logsData] = await Promise.all([
                DashboardService.getStats(),
                DashboardService.getRecentTransactions(),
                DashboardService.getAuditLogs()
            ]);
            setStats(statsData);
            setTransactions(txnsData);
            setLogs(logsData);
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Admin Dashboard</h1>
            
            {loading || !stats ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-[12px] bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <DashboardStats stats={stats} />
                    <div className="flex flex-col gap-6">
                        <DashboardTransactions transactions={transactions} />
                        <DashboardAuditLogs logs={logs} />
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
