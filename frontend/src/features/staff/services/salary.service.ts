import type { SalaryRecord } from '../types/salary';

const salaryRecords: SalaryRecord[] = [
    { id: 'PAY-1004', period: '10-2026', baseSalary: 12000000, bonuses: 1500000, deductions: 0, netPay: 13500000, payDate: '05-11-2026', status: 'Paid' },
    { id: 'PAY-1003', period: '09-2026', baseSalary: 12000000, bonuses: 2000000, deductions: 500000, netPay: 13500000, payDate: '05-10-2026', status: 'Paid' },
    { id: 'PAY-1002', period: '08-2026', baseSalary: 12000000, bonuses: 1000000, deductions: 0, netPay: 13000000, payDate: '05-09-2026', status: 'Paid' },
    { id: 'PAY-1001', period: '07-2026', baseSalary: 12000000, bonuses: 500000, deductions: 0, netPay: 12500000, payDate: '05-08-2026', status: 'Paid' },
    { id: 'PAY-1000', period: '06-2026', baseSalary: 12000000, bonuses: 3000000, deductions: 200000, netPay: 14800000, payDate: '05-07-2026', status: 'Paid' },
];

export const SalaryService = {
    getSalaryHistory: async (): Promise<SalaryRecord[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...salaryRecords]), 200));
    }
};
