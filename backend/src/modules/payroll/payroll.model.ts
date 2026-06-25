export interface DeductionItem {
    id: string;
    reason: string;
    amount: number;
}

export interface SalaryConfig {
    account_id: string;
    base_salary: number;
    overtime_rate: number;
    rate_per_session: number;
    created_at?: Date;
    updated_at?: Date;
    
    // Joined fields from account
    account_code?: string;
    full_name?: string;
    email?: string;
    role?: string;
}

export interface PayrollRecord {
    id: string;
    payroll_code: string;
    account_id: string;
    payroll_month: string;
    base_salary: number;
    overtime_hours: number;
    overtime_rate: number;
    teaching_sessions: number;
    rate_per_session: number;
    bonus: number;
    deductions: DeductionItem[];
    net_pay: number;
    status: 'Pending' | 'Processed' | 'Paid';
    payment_date: Date | null;
    created_at?: Date;
    updated_at?: Date;

    // Joined fields from account
    account_code?: string;
    full_name?: string;
    email?: string;
    role?: string;
}

export interface UpdateSalaryConfigDTO {
    account_id: string;
    base_salary?: number;
    overtime_rate?: number;
    rate_per_session?: number;
}

export interface GeneratePayrollDTO {
    month: string;
}

export interface UpdatePayrollDTO {
    bonus?: number;
    deductions?: DeductionItem[];
    status?: 'Pending' | 'Processed' | 'Paid';
    payment_date?: string | null;
}
