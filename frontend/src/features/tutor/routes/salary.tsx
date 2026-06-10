import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import type { SalaryRecord } from '../types/salary';
import { SalaryService } from '../services/salary.service';
import { SalaryCards } from '../components/SalaryCards';
import { SalaryTable } from '../components/SalaryTable';
import { PayslipModal } from '../components/PayslipModal';

const TutorSalaryHistory = () => {
    const [selectedYear] = useState('2026');
    const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            const data = await SalaryService.getMySalaryHistory();
            setSalaryRecords(data);
            setLoading(false);
        };
        fetchRecords();
    }, []);

    return (
        <div className="space-y-[24px] animate-fade-in-up pb-[40px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5] shrink-0">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-[28px] font-extrabold text-[#002045]">Salary History</h1>
                        <p className="text-[#43474e] text-[15px] mt-1">View your confirmed teaching payroll records and payslip details.</p>
                    </div>
                </div>
            </div>

            {!loading && <SalaryCards records={salaryRecords} />}

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-[12px] bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <SalaryTable 
                    records={salaryRecords} 
                    selectedYear={selectedYear} 
                    onViewRecord={setSelectedRecord} 
                />
            )}

            {selectedRecord && (
                <PayslipModal 
                    record={selectedRecord} 
                    onClose={() => setSelectedRecord(null)} 
                />
            )}
        </div>
    );
};

export default TutorSalaryHistory;
