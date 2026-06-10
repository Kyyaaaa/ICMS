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

export const calculateNetPay = (p: Partial<PayrollRecord>) => {
    const baseEarnings = p.role !== 'Tutor' 
        ? (p.baseSalary || 0) + ((p.overtimeHours || 0) * (p.overtimeRate || 0))
        : (p.teachingSessions || 0) * (p.ratePerSession || 0);
    const totalDeductions = p.deductionItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    return baseEarnings + (p.bonus || 0) - totalDeductions;
};
