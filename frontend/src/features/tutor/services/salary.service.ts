import type { SalaryRecord } from '../types/salary';

const MOCK_SALARY_RECORDS: SalaryRecord[] = [
    { id: 'PAY-T-1004', period: '10-2026', sessions: 24, sessionRate: 625000, baseSalary: 15000000, bonuses: 2000000, deductions: 0, netPay: 17000000, payDate: '05-11-2026', status: 'Paid' },
    { id: 'PAY-T-1003', period: '09-2026', sessions: 22, sessionRate: 625000, baseSalary: 13750000, bonuses: 1500000, deductions: 500000, netPay: 14750000, payDate: '05-10-2026', status: 'Paid' },
    { id: 'PAY-T-1002', period: '08-2026', sessions: 26, sessionRate: 625000, baseSalary: 16250000, bonuses: 1000000, deductions: 0, netPay: 17250000, payDate: '05-09-2026', status: 'Paid' },
    { id: 'PAY-T-1001', period: '07-2026', sessions: 20, sessionRate: 625000, baseSalary: 12500000, bonuses: 500000, deductions: 0, netPay: 13000000, payDate: '05-08-2026', status: 'Paid' },
    { id: 'PAY-T-1000', period: '06-2026', sessions: 24, sessionRate: 625000, baseSalary: 15000000, bonuses: 2500000, deductions: 200000, netPay: 17300000, payDate: '05-07-2026', status: 'Paid' },
];

export const SalaryService = {
    getMySalaryHistory: async (): Promise<SalaryRecord[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_SALARY_RECORDS), 300));
    }
};
