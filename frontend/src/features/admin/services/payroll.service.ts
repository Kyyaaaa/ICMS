import type { EmployeeSalaryConfig, PayrollRecord, DeductionItem } from '../types/payroll';
import axiosClient from '@/shared/services/axiosClient';

export const PayrollService = {
    getConfigs: async (): Promise<EmployeeSalaryConfig[]> => {
        const response = await axiosClient.get<unknown, Record<string, unknown>[]>('/payrolls/configs');
        return response.map(item => ({
            staffId: item.account_id as string,
            staffName: item.full_name as string,
            accountCode: item.account_code as string,
            role: item.role as string,
            email: item.email as string,
            baseSalary: item.base_salary as number,
            overtimeRate: item.overtime_rate as number,
            ratePerSession: item.rate_per_session as number
        }));
    },

    updateConfig: async (config: EmployeeSalaryConfig): Promise<void> => {
        await axiosClient.put(`/payrolls/configs/${config.staffId}`, {
            base_salary: config.baseSalary,
            overtime_rate: config.overtimeRate,
            rate_per_session: config.ratePerSession
        });
    },

    getRecords: async (): Promise<PayrollRecord[]> => {
        const response = await axiosClient.get<unknown, Record<string, unknown>[]>('/payrolls');
        return response.map(item => ({
            id: item.id as string,
            staffId: item.account_id as string,
            staffName: item.full_name as string,
            accountCode: item.account_code as string,
            role: item.role as string,
            email: item.email as string,
            month: item.payroll_month as string,
            baseSalary: item.base_salary as number,
            overtimeHours: item.overtime_hours as number,
            overtimeRate: item.overtime_rate as number,
            teachingSessions: item.teaching_sessions as number,
            ratePerSession: item.rate_per_session as number,
            bonus: item.bonus as number,
            deductionItems: item.deductions as DeductionItem[],
            status: item.status as 'Pending' | 'Processed' | 'Paid',
            paymentDate: item.payment_date as string,
            netPay: item.net_pay as number
        }));
    },

    updateRecord: async (record: PayrollRecord): Promise<void> => {
        await axiosClient.put(`/payrolls/${record.id}`, {
            bonus: record.bonus,
            deductions: record.deductionItems,
            status: record.status,
            payment_date: record.paymentDate
        });
    },

    generatePayroll: async (month: string): Promise<void> => {
        await axiosClient.post('/payrolls/generate', { month });
    }
};
