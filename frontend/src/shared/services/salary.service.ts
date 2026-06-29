import axiosClient from '@/shared/services/axiosClient';
import type { SalaryRecord } from '../types/salary';
import { formatDate, formatMonthYear } from '@/shared/utils/date';

export const SalaryService = {
    getMySalaryHistory: async (): Promise<SalaryRecord[]> => {
        const response = await axiosClient.get<unknown, Record<string, unknown>[]>('/payrolls/my-history');
        // Map backend Payroll to frontend SalaryRecord
        return (response || []).map((p) => ({
            id: p.payroll_code as string,
            period: formatMonthYear(p.payroll_month as string),
            sessions: Number(p.teaching_sessions) || undefined,
            sessionRate: Number(p.rate_per_session) || undefined,
            baseSalary: Number(p.base_salary) || 0,
            bonuses: Number(p.bonus) || 0,
            deductions: Number((p.deductions as Record<string, unknown>[])?.reduce((sum, item) => sum + Number(item.amount), 0)) || 0,
            netPay: Number(p.net_pay) || 0,
            payDate: formatDate((p.payment_date as string) || (p.updated_at as string)),
            status: p.status as string
        }));
    }
};
