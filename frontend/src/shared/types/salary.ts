export type SalaryRecord = {
    id: string;
    period: string;
    sessions?: number;
    sessionRate?: number;
    baseSalary: number;
    bonuses: number;
    deductions: number;
    netPay: number;
    payDate: string;
    status: string;
};
