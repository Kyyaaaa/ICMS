import { useState, useMemo } from 'react';
import { Wallet, Search, CheckCircle2, X, DollarSign, Calculator, Settings, FileText, Edit2 } from 'lucide-react';

// Interfaces
export interface DeductionItem {
    id: string;
    reason: string;
    amount: number;
}

export interface EmployeeSalaryConfig {
    staffId: string;
    staffName: string;
    role: string;
    email: string;
    baseSalary: number;
    overtimeRate: number;
    ratePerSession: number;
}

export interface PayrollRecord {
    id: string;
    staffId: string;
    staffName: string;
    role: string;
    email: string;
    month: string;
    baseSalary?: number;
    overtimeHours?: number;
    overtimeRate?: number;
    teachingSessions?: number;
    ratePerSession?: number;
    bonus: number;
    deductionItems: DeductionItem[];
    status: 'Pending' | 'Processed' | 'Paid';
    paymentDate?: string;
}

const AdminPayroll = () => {
    const currentMonth = '2026-10';
    
    // VIEW STATE
    const [viewMode, setViewMode] = useState<'Processing' | 'Configuration'>('Processing');

    // MOCK DATA: CONFIGURATION
    const [salaryConfigs, setSalaryConfigs] = useState<EmployeeSalaryConfig[]>([
        { staffId: 'STF-001', staffName: 'Emily Watson', role: 'Staff', email: 'emily.w@example.com', baseSalary: 12000000, overtimeRate: 150000, ratePerSession: 0 },
        { staffId: 'STF-002', staffName: 'David Lee', role: 'Admin', email: 'david.l@example.com', baseSalary: 20000000, overtimeRate: 200000, ratePerSession: 0 },
        { staffId: 'TUT-001', staffName: 'Dr. Sarah Smith', role: 'Tutor', email: 'sarah.smith@example.com', baseSalary: 0, overtimeRate: 0, ratePerSession: 600000 },
        { staffId: 'TUT-002', staffName: 'Michael Chen', role: 'Tutor', email: 'michael.c@example.com', baseSalary: 0, overtimeRate: 0, ratePerSession: 450000 }
    ]);

    // MOCK DATA: PAYROLL RECORDS (Monthly)
    const [payrolls, setPayrolls] = useState<PayrollRecord[]>([
        {
            id: 'PAY-1001', staffId: 'STF-001', staffName: 'Emily Watson', role: 'Staff', email: 'emily.w@example.com',
            month: '2026-10', baseSalary: 12000000, overtimeHours: 5, overtimeRate: 150000, bonus: 500000, 
            deductionItems: [{ id: '1', reason: 'Tax & Insurance', amount: 1275000 }], status: 'Pending'
        },
        {
            id: 'PAY-1002', staffId: 'STF-002', staffName: 'David Lee', role: 'Admin', email: 'david.l@example.com',
            month: '2026-10', baseSalary: 20000000, overtimeHours: 0, overtimeRate: 200000, bonus: 0, 
            deductionItems: [{ id: '1', reason: 'Tax & Insurance', amount: 2000000 }], status: 'Paid', paymentDate: '2026-10-30'
        },
        {
            id: 'PAY-2001', staffId: 'TUT-001', staffName: 'Dr. Sarah Smith', role: 'Tutor', email: 'sarah.smith@example.com',
            month: '2026-10', teachingSessions: 48, ratePerSession: 600000, bonus: 1000000, 
            deductionItems: [{ id: '1', reason: 'Tax', amount: 3150000 }], status: 'Processed', paymentDate: '2026-10-28'
        },
        {
            id: 'PAY-2002', staffId: 'TUT-002', staffName: 'Michael Chen', role: 'Tutor', email: 'michael.c@example.com',
            month: '2026-10', teachingSessions: 32, ratePerSession: 450000, bonus: 0, 
            deductionItems: [{ id: '1', reason: 'Tax', amount: 1550000 }], status: 'Pending'
        }
    ]);

    // COMMON STATE
    const [searchTerm, setSearchTerm] = useState('');
    
    // PROCESSING STATE
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [roleFilter, setRoleFilter] = useState<'All' | 'Staff' | 'Tutor'>('All');
    const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
    const [formData, setFormData] = useState<Partial<PayrollRecord>>({});

    // CONFIG STATE
    const [selectedConfig, setSelectedConfig] = useState<EmployeeSalaryConfig | null>(null);
    const [configFormData, setConfigFormData] = useState<Partial<EmployeeSalaryConfig>>({});

    // --- COMPUTED DATA ---
    const filteredPayrolls = useMemo(() => {
        const filtered = payrolls.filter(p => {
            const matchType = roleFilter === 'All' || (roleFilter === 'Staff' && p.role !== 'Tutor') || (roleFilter === 'Tutor' && p.role === 'Tutor');
            const matchMonth = p.month === selectedMonth;
            const matchSearch = p.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'All' || p.status === statusFilter;
            return matchType && matchMonth && matchSearch && matchStatus;
        });
        return filtered.sort((a, b) => {
            if (a.role !== 'Tutor' && b.role === 'Tutor') return -1;
            if (a.role === 'Tutor' && b.role !== 'Tutor') return 1;
            return 0;
        });
    }, [payrolls, selectedMonth, searchTerm, statusFilter, roleFilter]);

    const filteredConfigs = useMemo(() => {
        const filtered = salaryConfigs.filter(c => {
            const matchType = roleFilter === 'All' || (roleFilter === 'Staff' && c.role !== 'Tutor') || (roleFilter === 'Tutor' && c.role === 'Tutor');
            const matchSearch = c.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || c.staffId.toLowerCase().includes(searchTerm.toLowerCase());
            return matchType && matchSearch;
        });
        return filtered.sort((a, b) => {
            if (a.role !== 'Tutor' && b.role === 'Tutor') return -1;
            if (a.role === 'Tutor' && b.role !== 'Tutor') return 1;
            return 0;
        });
    }, [salaryConfigs, searchTerm, roleFilter]);

    const stats = useMemo(() => {
        const monthRecords = payrolls.filter(p => p.month === selectedMonth);
        const totalNetPay = monthRecords.reduce((sum, p) => sum + calculateNetPay(p), 0);
        const processedCount = monthRecords.filter(p => p.status === 'Processed' || p.status === 'Paid').length;
        const pendingCount = monthRecords.filter(p => p.status === 'Pending').length;
        return { totalNetPay, processedCount, pendingCount };
    }, [payrolls, selectedMonth]);

    // --- ACTIONS ---
    const openPayrollModal = (record: PayrollRecord) => {
        setSelectedRecord(record);
        setFormData({ ...record });
    };

    const handleSavePayroll = () => {
        if (selectedRecord) {
            setPayrolls(payrolls.map(p => p.id === selectedRecord.id ? { ...p, ...formData } as PayrollRecord : p));
        }
        setSelectedRecord(null);
    };

    const openConfigModal = (config: EmployeeSalaryConfig) => {
        setSelectedConfig(config);
        setConfigFormData({ ...config });
    };

    const handleSaveConfig = () => {
        if (selectedConfig) {
            setSalaryConfigs(salaryConfigs.map(c => c.staffId === selectedConfig.staffId ? { ...c, ...configFormData } as EmployeeSalaryConfig : c));
        }
        setSelectedConfig(null);
    };

    const handleGeneratePayroll = () => {
        const currentDate = new Date();
        const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (selectedMonth >= currentYearMonth) {
            alert(`Lỗi: Không thể chốt lương cho tháng ${selectedMonth}!\nBạn chỉ có thể tạo bảng lương cho các tháng trong quá khứ (khi tháng đã kết thúc hoàn toàn).`);
            return;
        }

        const newRecords: PayrollRecord[] = [];
        salaryConfigs.forEach(c => {
            const exists = payrolls.some(p => p.staffId === c.staffId && p.month === selectedMonth);
            if (!exists) {
                newRecords.push({
                    id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
                    staffId: c.staffId,
                    staffName: c.staffName,
                    role: c.role,
                    email: c.email,
                    month: selectedMonth,
                    baseSalary: c.role !== 'Tutor' ? c.baseSalary : undefined,
                    overtimeRate: c.role !== 'Tutor' ? c.overtimeRate : undefined,
                    overtimeHours: c.role !== 'Tutor' ? 0 : undefined,
                    ratePerSession: c.role === 'Tutor' ? c.ratePerSession : undefined,
                    teachingSessions: c.role === 'Tutor' ? 0 : undefined,
                    bonus: 0,
                    deductionItems: [],
                    status: 'Pending'
                });
            }
        });
        
        if (newRecords.length > 0) {
            setPayrolls([...payrolls, ...newRecords]);
            alert(`Thành công! Đã tạo ${newRecords.length} phiếu lương cho tháng ${selectedMonth}.`);
        } else {
            alert(`Tất cả nhân sự đã có phiếu lương trong tháng ${selectedMonth}.`);
        }
    };

    function calculateNetPay(p: Partial<PayrollRecord>) {
        let baseEarnings = 0;
    baseEarnings = baseEarnings || 0; // Fix unused var
        if (p.role !== 'Tutor') {
            baseEarnings = (p.baseSalary || 0) + ((p.overtimeHours || 0) * (p.overtimeRate || 0));
        } else {
            baseEarnings = (p.teachingSessions || 0) * (p.ratePerSession || 0);
        }
        const totalDeductions = p.deductionItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
        return baseEarnings + (p.bonus || 0) - totalDeductions;
    }

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Pending': return 'bg-[#fff8e1] text-[#c9a82c]';
            case 'Processed': return 'bg-[#e6f0fa] text-[#0061a5]';
            case 'Paid': return 'bg-[#e6f4ea] text-[#137333]';
            default: return 'bg-[#f1f4f6] text-[#74777f]';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            
            {/* TOP HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Payroll & Salaries</h1>
                    <p className="text-[#74777f] text-[14px] mt-1">Manage employee compensation and process monthly payslips.</p>
                </div>
                {viewMode === 'Processing' && (
                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-[12px] shadow-sm border border-[#e0e3e5]">
                        <input 
                            type="month" 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-3 py-1.5 bg-transparent border-none text-[14px] font-bold text-[#002045] focus:outline-none focus:ring-0 cursor-pointer"
                        />
                        <div className="hidden md:block w-px h-6 bg-[#e0e3e5]"></div>
                        <button 
                            onClick={handleGeneratePayroll}
                            className="flex items-center justify-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-[8px] text-[14px] font-bold hover:bg-[#004d80] transition-colors w-full md:w-auto"
                        >
                            <Calculator size={16} /> Generate Payroll
                        </button>
                    </div>
                )}
            </div>

            {/* MAIN NAVIGATION */}
            <div className="flex bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-1 w-full md:w-fit">
                <button 
                    onClick={() => { setViewMode('Processing'); setSearchTerm(''); }}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-[8px] text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${
                        viewMode === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f1f4f6]'
                    }`}
                >
                    <FileText size={18} /> Processing
                </button>
                <button 
                    onClick={() => { setViewMode('Configuration'); setSearchTerm(''); }}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-[8px] text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${
                        viewMode === 'Configuration' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f1f4f6]'
                    }`}
                >
                    <Settings size={18} /> Configuration
                </button>
            </div>

            {/* ----------------- MODE: CONFIGURATION ----------------- */}
            {viewMode === 'Configuration' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                        {/* Table Controls */}
                        <div className="p-4 border-b border-[#e0e3e5] bg-[#f7fafc] flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                                <input 
                                    className="pl-10 pr-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" 
                                    placeholder="Search configs..." 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-auto">
                                <select 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value as any)}
                                    className="px-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-[14px] font-bold text-[#181c1e] focus:outline-none focus:border-[#0061a5] w-full"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Staff">Staff Only</option>
                                    <option value="Tutor">Tutors Only</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Employee</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Role</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Base / Session Rate</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">OT Rate / Hr</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredConfigs.map(c => (
                                        <tr key={c.staffId} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-[#181c1e]">{c.staffName}</div>
                                                <div className="text-[12px] text-[#74777f]">{c.staffId}</div>
                                            </td>
                                            <td className="py-4 px-6 text-[14px] text-[#43474e]">
                                                <span className={`px-2 py-1 rounded text-[12px] font-bold ${c.role !== 'Tutor' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#e6f4ea] text-[#137333]'}`}>{c.role}</span>
                                            </td>
                                            <td className="py-4 px-6 text-[14px] font-bold text-[#0061a5]">
                                                {c.role !== 'Tutor' ? `${c.baseSalary.toLocaleString()}đ (Monthly)` : `${c.ratePerSession.toLocaleString()}đ (Session)`}
                                            </td>
                                            <td className="py-4 px-6 text-[14px] text-[#43474e]">
                                                {c.role !== 'Tutor' ? `${c.overtimeRate.toLocaleString()}đ` : '-'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button 
                                                    onClick={() => openConfigModal(c)}
                                                    className="inline-flex p-2 text-[#0061a5] hover:bg-[#e6f0fa] rounded-lg transition-colors"
                                                    title="Edit Salary Details"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredConfigs.length === 0 && (
                                        <tr><td colSpan={5} className="py-8 text-center text-[#74777f]">No configurations found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}


            {/* ----------------- MODE: PROCESSING ----------------- */}
            {viewMode === 'Processing' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Stats */}
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-[14px] text-[#74777f] uppercase font-bold mb-1">Total Net Payroll</p>
                                <p className="text-[28px] font-extrabold text-[#0061a5]">{stats.totalNetPay.toLocaleString()} đ</p>
                            </div>
                            <div>
                                <p className="text-[14px] text-[#74777f] uppercase font-bold mb-1">Processed/Paid</p>
                                <p className="text-[28px] font-extrabold text-[#137333]">{stats.processedCount}</p>
                            </div>
                            <div>
                                <p className="text-[14px] text-[#74777f] uppercase font-bold mb-1">Pending Review</p>
                                <p className="text-[28px] font-extrabold text-[#c9a82c]">{stats.pendingCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden mt-6">
                        {/* Table Controls */}
                        <div className="p-4 border-b border-[#e0e3e5] bg-[#f7fafc] flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative flex-1 sm:max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                                <input 
                                    className="pl-10 pr-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-[14px] focus:outline-none focus:border-[#0061a5] w-full" 
                                    placeholder="Search payslip..." 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <select 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value as any)}
                                    className="px-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-[14px] font-bold text-[#181c1e] focus:outline-none focus:border-[#0061a5] w-full sm:w-36"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Staff">Staff Only</option>
                                    <option value="Tutor">Tutor Only</option>
                                </select>
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-[14px] font-bold text-[#181c1e] focus:outline-none focus:border-[#0061a5] w-full sm:w-40"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processed">Processed</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Employee Name</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Role</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Base / Sessions Taught</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Net Pay</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e]">Status</th>
                                        <th className="py-4 px-6 text-[14px] font-semibold text-[#43474e] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayrolls.map(p => (
                                        <tr key={p.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-[#181c1e]">{p.staffName}</div>
                                                <div className="text-[12px] text-[#74777f]">{p.email} • {p.staffId}</div>
                                            </td>
                                            <td className="py-4 px-6 text-[14px] text-[#43474e]">
                                                <span className={`px-2 py-1 rounded text-[12px] font-bold ${p.role !== 'Tutor' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'bg-[#e6f4ea] text-[#137333]'}`}>{p.role}</span>
                                            </td>
                                            <td className="py-4 px-6 text-[14px] text-[#43474e]">
                                                {p.role !== 'Tutor' ? `${(p.baseSalary || 0).toLocaleString()}đ` : `${p.teachingSessions || 0} sessions`}
                                            </td>
                                            <td className="py-4 px-6 text-[14px] font-bold text-[#0061a5]">{calculateNetPay(p).toLocaleString()}đ</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 text-[12px] font-bold rounded uppercase ${getStatusBadge(p.status)}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button 
                                                    onClick={() => openPayrollModal(p)}
                                                    className="px-4 py-2 bg-[#e6f0fa] text-[#0061a5] hover:bg-[#cce0f5] font-bold rounded-lg text-[13px] transition-colors"
                                                >
                                                    {p.status === 'Pending' ? 'Process Payroll' : 'View Payslip'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPayrolls.length === 0 && (
                                        <tr><td colSpan={6} className="py-8 text-center text-[#74777f]">No payroll records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}


            {/* ================= MODALS ================= */}

            {/* MODAL: CONFIGURATION EDIT */}
            {selectedConfig && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-slide-up my-auto">
                        <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <Settings className="text-[#0061a5]" size={24} />
                                <h2 className="text-[20px] font-bold text-[#002045]">Edit Salary Config</h2>
                            </div>
                            <button onClick={() => setSelectedConfig(null)} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6 pb-6 border-b border-[#e0e3e5]">
                                <h2 className="text-[20px] font-bold text-[#181c1e]">{selectedConfig.staffName}</h2>
                                <p className="text-[#43474e]">{selectedConfig.role} • {selectedConfig.staffId}</p>
                            </div>
                            
                            <div className="space-y-4">
                                                {configFormData.role !== 'Tutor' ? (
                                                    <>
                                                        <div>
                                                            <label className="block text-[13px] font-bold text-[#43474e] mb-1">Monthly Base Salary (đ)</label>
                                            <input 
                                                type="number" 
                                                value={configFormData.baseSalary} 
                                                onChange={e => setConfigFormData({...configFormData, baseSalary: parseInt(e.target.value) || 0})}
                                                className="w-full px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-[#43474e] mb-1">Overtime Rate per Hour (đ)</label>
                                            <input 
                                                type="number" 
                                                value={configFormData.overtimeRate} 
                                                onChange={e => setConfigFormData({...configFormData, overtimeRate: parseInt(e.target.value) || 0})}
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
                                                value={configFormData.ratePerSession} 
                                                onChange={e => setConfigFormData({...configFormData, ratePerSession: parseInt(e.target.value) || 0})}
                                                className="w-full px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]"
                                            />
                                            <p className="text-[12px] text-[#74777f] mt-1">This rate will be used as the default multiplier when generating monthly payslips for this tutor.</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#e0e3e5]">
                                <button onClick={() => setSelectedConfig(null)} className="px-6 py-2.5 font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">Cancel</button>
                                <button onClick={handleSaveConfig} className="px-6 py-2.5 font-bold text-white bg-[#0061a5] hover:bg-[#004d80] rounded-xl transition-colors">Save Configuration</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* MODAL: PAYROLL PROCESSING */}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden animate-slide-up my-auto">
                        <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                            <div className="flex items-center gap-3">
                                <Wallet className="text-[#0061a5]" size={24} />
                                <h2 className="text-[20px] font-bold text-[#002045]">Payslip Details: {selectedRecord.month}</h2>
                            </div>
                            <button onClick={() => setSelectedRecord(null)} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={24} /></button>
                        </div>
                        
                        <div className="p-6">
                            {/* Header Info */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-[#e0e3e5]">
                                <div>
                                    <h2 className="text-[24px] font-bold text-[#181c1e]">{selectedRecord.staffName}</h2>
                                    <p className="text-[#43474e]">{selectedRecord.role} • {selectedRecord.staffId}</p>
                                </div>
                                <div className="text-right mt-4 md:mt-0">
                                    <p className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 text-[14px] font-bold rounded-full uppercase ${getStatusBadge(formData.status || '')}`}>
                                        {formData.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Earnings Column */}
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#181c1e] mb-4 flex items-center gap-2"><DollarSign size={18}/> Earnings</h3>
                                    <div className="space-y-4">
                                        {formData.role !== 'Tutor' ? (
                                            <>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-[#43474e] mb-1">Base Salary (Monthly - đ)</label>
                                                    <input 
                                                        type="number" 
                                                        value={formData.baseSalary} 
                                                        onChange={e => setFormData({...formData, baseSalary: parseInt(e.target.value) || 0})}
                                                        disabled={formData.status !== 'Pending'}
                                                        className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-[12px] font-bold text-[#43474e] mb-1">OT Hours</label>
                                                        <input 
                                                            type="number" 
                                                            value={formData.overtimeHours} 
                                                            onChange={e => setFormData({...formData, overtimeHours: parseFloat(e.target.value) || 0})}
                                                            disabled={formData.status !== 'Pending'}
                                                            className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[12px] font-bold text-[#43474e] mb-1">OT Rate/Hr</label>
                                                        <input 
                                                            type="number" 
                                                            value={formData.overtimeRate} 
                                                            onChange={e => setFormData({...formData, overtimeRate: parseInt(e.target.value) || 0})}
                                                            disabled={formData.status !== 'Pending'}
                                                            className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-[12px] font-bold text-[#43474e] mb-1">Sessions Taught</label>
                                                        <input 
                                                            type="number" 
                                                            value={formData.teachingSessions} 
                                                            onChange={e => setFormData({...formData, teachingSessions: parseInt(e.target.value) || 0})}
                                                            disabled={formData.status !== 'Pending'}
                                                            className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[12px] font-bold text-[#43474e] mb-1">Rate Per Session</label>
                                                        <input 
                                                            type="number" 
                                                            value={formData.ratePerSession} 
                                                            onChange={e => setFormData({...formData, ratePerSession: parseInt(e.target.value) || 0})}
                                                            disabled={formData.status !== 'Pending'}
                                                            className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <label className="block text-[12px] font-bold text-[#43474e] mb-1">Bonus / Allowances (đ)</label>
                                            <input 
                                                type="number" 
                                                value={formData.bonus} 
                                                onChange={e => setFormData({...formData, bonus: parseInt(e.target.value) || 0})}
                                                disabled={formData.status !== 'Pending'}
                                                className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] disabled:bg-[#f1f4f6]"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-[#f8f9fa] rounded-lg border border-[#e6f0fa] flex justify-between items-center">
                                        <span className="text-[#0061a5] font-bold text-[14px]">Total Earnings</span>
                                        <span className="font-bold text-[#0061a5] text-[16px]">
                                            {(() => {
                                                if (formData.role !== 'Tutor') {
                                                    return ((formData.baseSalary || 0) + ((formData.overtimeHours || 0) * (formData.overtimeRate || 0)) + (formData.bonus || 0)).toLocaleString() + 'đ';
                                                } else {
                                                    return (((formData.teachingSessions || 0) * (formData.ratePerSession || 0)) + (formData.bonus || 0)).toLocaleString() + 'đ';
                                                }
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                {/* Deductions Column */}
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#181c1e] mb-4 flex items-center gap-2"><Calculator size={18}/> Deductions</h3>
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
                                                            setFormData({...formData, deductionItems: newItems});
                                                        }}
                                                        disabled={formData.status !== 'Pending'}
                                                        className="w-full px-3 py-2 text-[13px] border border-[#ffebed] rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#ba1a1a] disabled:bg-[#f1f4f6]"
                                                    />
                                                    <input 
                                                        type="number" 
                                                        placeholder="Amount (đ)" 
                                                        value={item.amount || ''}
                                                        onChange={(e) => {
                                                            const newItems = [...(formData.deductionItems || [])];
                                                            newItems[index].amount = parseInt(e.target.value) || 0;
                                                            setFormData({...formData, deductionItems: newItems});
                                                        }}
                                                        disabled={formData.status !== 'Pending'}
                                                        className="w-full px-3 py-2 text-[13px] font-bold border border-[#ffebed] rounded-lg focus:outline-none focus:border-[#ba1a1a] text-[#ba1a1a] disabled:bg-[#f1f4f6]"
                                                    />
                                                </div>
                                                {formData.status === 'Pending' && (
                                                    <button 
                                                        onClick={() => {
                                                            const newItems = [...(formData.deductionItems || [])];
                                                            newItems.splice(index, 1);
                                                            setFormData({...formData, deductionItems: newItems});
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
                                                    setFormData({...formData, deductionItems: newItems});
                                                }}
                                                className="text-[#0061a5] font-bold text-[13px] flex items-center gap-1 mt-2 hover:underline"
                                            >
                                                + Add Deduction
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-4 p-3 bg-[#fff0f0] rounded-lg border border-[#ffccd2] flex justify-between items-center">
                                        <span className="text-[#ba1a1a] font-bold text-[14px]">Total Deductions</span>
                                        <span className="font-bold text-[#ba1a1a] text-[16px]">
                                            {(formData.deductionItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0).toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay Result */}
                            <div className="bg-[#e6f0fa] rounded-[12px] p-6 flex justify-between items-center border border-[#0061a5] shadow-sm mb-6">
                                <div>
                                    <span className="block text-[14px] text-[#002045] uppercase font-bold tracking-wider">Final Net Pay</span>
                                    <span className="text-[12px] text-[#0061a5] mt-1">Amount to be transferred</span>
                                </div>
                                <span className="text-[32px] md:text-[40px] font-extrabold text-[#0061a5] tracking-tight">
                                    {calculateNetPay(formData).toLocaleString()}đ
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                                <button onClick={() => setSelectedRecord(null)} className="px-6 py-3 text-[14px] font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">
                                    Close
                                </button>
                                
                                {formData.status === 'Pending' && (
                                    <button 
                                        onClick={() => { setFormData({...formData, status: 'Processed'}); }}
                                        className="px-6 py-3 text-[14px] font-bold text-white bg-[#0061a5] hover:bg-[#004d80] rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle2 size={18} /> Mark Processed
                                    </button>
                                )}
                                
                                {formData.status === 'Processed' && (
                                    <button 
                                        onClick={() => { setFormData({...formData, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0]}); }}
                                        className="px-6 py-3 text-[14px] font-bold text-white bg-[#137333] hover:bg-[#0d5022] rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <DollarSign size={18} /> Confirm Paid
                                    </button>
                                )}

                                {(formData.status === 'Processed' || formData.status === 'Paid') && (
                                    <button 
                                        onClick={handleSavePayroll}
                                        className="px-6 py-3 text-[14px] font-bold text-white bg-[#181c1e] hover:bg-[#000000] rounded-xl transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                )}
                                
                                {formData.status === 'Pending' && (
                                    <button 
                                        onClick={handleSavePayroll}
                                        className="px-6 py-3 text-[14px] font-bold text-white bg-[#181c1e] hover:bg-[#000000] rounded-xl transition-colors"
                                    >
                                        Save Draft
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayroll;
