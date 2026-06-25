import { showAlertModal, showConfirmModal } from '@/utils/modal';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Calculator, Settings, FileText } from 'lucide-react';

import { type EmployeeSalaryConfig, type PayrollRecord, calculateNetPay } from '../types/payroll';
import { PayrollService } from '../services/payroll.service';

import { PayrollConfigTable } from '../components/PayrollConfigTable';
import { PayrollRecordsTable } from '../components/PayrollRecordsTable';
import { PayrollConfigModal } from '../components/PayrollConfigModal';
import { PayrollRecordModal } from '../components/PayrollRecordModal';

const AdminPayroll = () => {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [currentMonth] = useState(() => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    
    // VIEW STATE
    const [viewMode, setViewMode] = useState<'Processing' | 'Configuration'>('Processing');

    // DATA STATE
    const [salaryConfigs, setSalaryConfigs] = useState<EmployeeSalaryConfig[]>([]);
    const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const [configs, records] = await Promise.all([
                PayrollService.getConfigs(),
                PayrollService.getRecords()
            ]);
            setSalaryConfigs(configs);
            setPayrolls(records);
        };
        loadData();
    }, []);

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
            const matchType = roleFilter === 'All' || (roleFilter === 'Staff' && p.role !== 'TUTOR') || (roleFilter === 'Tutor' && p.role === 'TUTOR');
            const matchMonth = p.month === selectedMonth;
            const matchSearch = p.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'All' || p.status === statusFilter;
            return matchType && matchMonth && matchSearch && matchStatus;
        });
        return filtered.sort((a, b) => {
            if (a.role !== 'TUTOR' && b.role === 'TUTOR') return -1;
            if (a.role === 'TUTOR' && b.role !== 'TUTOR') return 1;
            return 0;
        });
    }, [payrolls, selectedMonth, searchTerm, statusFilter, roleFilter]);

    const filteredConfigs = useMemo(() => {
        const filtered = salaryConfigs.filter(c => {
            const matchType = roleFilter === 'All' || (roleFilter === 'Staff' && c.role !== 'TUTOR') || (roleFilter === 'Tutor' && c.role === 'TUTOR');
            const matchSearch = c.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || c.staffId.toLowerCase().includes(searchTerm.toLowerCase());
            return matchType && matchSearch;
        });
        return filtered.sort((a, b) => {
            if (a.role !== 'TUTOR' && b.role === 'TUTOR') return -1;
            if (a.role === 'TUTOR' && b.role !== 'TUTOR') return 1;
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

    const handleSavePayroll = async () => {
        const isConfirmed = await showConfirmModal('Confirm Update', 'Are you sure you want to update this payroll record?', 'warning');
        if (!isConfirmed) return;

        if (selectedRecord) {
            const updated = { ...selectedRecord, ...formData } as PayrollRecord;
            await PayrollService.updateRecord(updated);
            setPayrolls(payrolls.map(p => p.id === selectedRecord.id ? updated : p));
        }
        setSelectedRecord(null);
    };

    const openConfigModal = (config: EmployeeSalaryConfig) => {
        setSelectedConfig(config);
        setConfigFormData({ ...config });
    };

    const handleSaveConfig = async () => {
        const isConfirmed = await showConfirmModal('Confirm Update', 'Are you sure you want to update this salary configuration?', 'warning');
        if (!isConfirmed) return;

        if (selectedConfig) {
            const updated = { ...selectedConfig, ...configFormData } as EmployeeSalaryConfig;
            await PayrollService.updateConfig(updated);
            setSalaryConfigs(salaryConfigs.map(c => c.staffId === selectedConfig.staffId ? updated : c));
        }
        setSelectedConfig(null);
    };

    const handleGeneratePayroll = async () => {
        const isConfirmed = await showConfirmModal('Confirm Generation', `Are you sure you want to generate payroll for ${selectedMonth}?`, 'warning');
        if (!isConfirmed) return;

        const currentDate = new Date();
        const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (selectedMonth > currentYearMonth) {
            showAlertModal('Error', `Error: Cannot finalize payroll for ${selectedMonth}!\nYou can only generate payroll for past or current months.`, 'error');
            return;
        }

        try {
            await PayrollService.generatePayroll(selectedMonth);
            // Reload all records
            const records = await PayrollService.getRecords();
            setPayrolls(records);
            showAlertModal('Success', `Success! Payroll generated for ${selectedMonth}.`, 'success');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            showAlertModal('Error', err.response?.data?.error || `Error generating payroll for ${selectedMonth}.`, 'error');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            
            {/* TOP HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Payroll & Salaries</h1>
                    <p className="text-[#74777f] text-sm mt-1">Manage employee compensation and process monthly payslips.</p>
                </div>
                {viewMode === 'Processing' && (
                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-[#e0e3e5]">
                        <div 
                            className="relative flex items-center px-3 py-1.5 min-w-35 cursor-pointer"
                            onClick={() => {
                                try { dateInputRef.current?.showPicker(); } catch (_e) { console.debug('Picker not supported'); }
                            }}
                        >
                            <span className="text-sm font-bold text-[#002045] pointer-events-none w-full text-center">
                                {selectedMonth ? new Date(selectedMonth + '-01').toLocaleString('en-US', { month: 'long', year: 'numeric' }) : ''}
                            </span>
                            <input 
                                ref={dateInputRef}
                                type="month" 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
                            />
                        </div>
                        <div className="hidden md:block w-px h-6 bg-[#e0e3e5]"></div>
                        <button 
                            onClick={handleGeneratePayroll}
                            className="flex items-center justify-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#004d80] transition-colors w-full md:w-auto"
                        >
                            <Calculator size={16} /> Generate Payroll
                        </button>
                    </div>
                )}
            </div>

            {/* MAIN NAVIGATION */}
            <div className="flex bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-1 w-full md:w-fit">
                <button 
                    onClick={() => { setViewMode('Processing'); setSearchTerm(''); }}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        viewMode === 'Processing' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f1f4f6]'
                    }`}
                >
                    <FileText size={18} /> Processing
                </button>
                <button 
                    onClick={() => { setViewMode('Configuration'); setSearchTerm(''); }}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        viewMode === 'Configuration' ? 'bg-[#e6f0fa] text-[#0061a5]' : 'text-[#43474e] hover:bg-[#f1f4f6]'
                    }`}
                >
                    <Settings size={18} /> Configuration
                </button>
            </div>

            {/* ----------------- MODE: CONFIGURATION ----------------- */}
            {viewMode === 'Configuration' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                        {/* Table Controls */}
                        <div className="p-4 border-b border-[#e0e3e5] bg-[#f7fafc] flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                                <input 
                                    className="pl-10 pr-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] w-full" 
                                    placeholder="Search configs..." 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-auto">
                                <select 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value as 'All' | 'Staff' | 'Tutor')}
                                    className="px-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-sm font-bold text-[#181c1e] focus:outline-none focus:border-[#0061a5] w-full"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Staff">Staff Only</option>
                                    <option value="Tutor">Tutors Only</option>
                                </select>
                            </div>
                        </div>
                        <PayrollConfigTable configs={filteredConfigs} onEdit={openConfigModal} />
                    </div>
                </div>
            )}

            {/* ----------------- MODE: PROCESSING ----------------- */}
            {viewMode === 'Processing' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-[#74777f] uppercase font-bold mb-1">Total Net Payroll</p>
                                <p className="text-3xl font-extrabold text-[#0061a5]">{stats.totalNetPay.toLocaleString()} đ</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#74777f] uppercase font-bold mb-1">Processed/Paid</p>
                                <p className="text-3xl font-extrabold text-[#137333]">{stats.processedCount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#74777f] uppercase font-bold mb-1">Pending Review</p>
                                <p className="text-3xl font-extrabold text-[#c9a82c]">{stats.pendingCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden mt-6">
                        {/* Table Controls */}
                        <div className="p-4 border-b border-[#e0e3e5] bg-[#f7fafc] flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative flex-1 sm:max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                                <input 
                                    className="pl-10 pr-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] w-full" 
                                    placeholder="Search payslip..." 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <select 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value as 'All' | 'Staff' | 'Tutor')}
                                    className="px-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-sm font-bold text-[#181c1e] focus:outline-none focus:border-[#0061a5] w-full sm:w-36"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Staff">Staff Only</option>
                                    <option value="Tutor">Tutor Only</option>
                                </select>
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 bg-white border border-[#c4c6cf] rounded-xl text-sm font-bold text-[#181c1e] focus:outline-none focus:border-[#0061a5] w-full sm:w-40"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processed">Processed</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>
                        </div>
                        <PayrollRecordsTable records={filteredPayrolls} onView={openPayrollModal} />
                    </div>
                </div>
            )}

            {/* ================= MODALS ================= */}

            {selectedConfig && (
                <PayrollConfigModal 
                    config={selectedConfig}
                    formData={configFormData}
                    setFormData={setConfigFormData}
                    onClose={() => setSelectedConfig(null)}
                    onSave={handleSaveConfig}
                />
            )}

            {selectedRecord && (
                <PayrollRecordModal 
                    record={selectedRecord}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={() => setSelectedRecord(null)}
                    onSave={handleSavePayroll}
                />
            )}
        </div>
    );
};

export default AdminPayroll;
