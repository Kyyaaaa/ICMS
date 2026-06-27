import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin as supabase } from '../../configs/supabase';
import type { SalaryConfig, PayrollRecord } from './payroll.model';

class PayrollRepository {
    private db: SupabaseClient;

    constructor() {
        this.db = supabase;
    }

    async getSalaryConfigs(): Promise<SalaryConfig[]> {
        const { data, error } = await this.db
            .from('account')
            .select(`
                id,
                account_code,
                full_name,
                email,
                roles!inner (
                    name
                ),
                salary_configs (
                    base_salary,
                    overtime_rate,
                    rate_per_session,
                    created_at,
                    updated_at
                )
            `)
            .in('roles.name', ['STAFF', 'TUTOR']);
            
        if (error) {
            console.error('Error fetching salary configs:', error);
            throw error;
        }

        return (data || []).map((row: any) => {
            const config = Array.isArray(row.salary_configs) ? row.salary_configs[0] || {} : row.salary_configs || {};
            return {
                account_id: row.id,
                base_salary: config.base_salary || 0,
                overtime_rate: config.overtime_rate || 0,
                rate_per_session: config.rate_per_session || 0,
                created_at: config.created_at,
                updated_at: config.updated_at,
                account_code: row.account_code,
                full_name: row.full_name,
                email: row.email,
                role: row.roles?.name
            };
        });
    }

    async getLatestPayrollCode(): Promise<{ payroll_code: string } | null> {
        const { data, error } = await this.db
            .from('payrolls')
            .select('payroll_code')
            .order('payroll_code', { ascending: false })
            .limit(1)
            .single();
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching latest payroll code:', error);
        }
        return data || null;
    }

    async upsertSalaryConfig(config: Partial<SalaryConfig>): Promise<void> {
        const { error } = await this.db
            .from('salary_configs')
            .upsert({
                account_id: config.account_id,
                base_salary: config.base_salary,
                overtime_rate: config.overtime_rate,
                rate_per_session: config.rate_per_session,
                updated_at: new Date().toISOString()
            }, { onConflict: 'account_id' });

        if (error) {
            console.error('Error upserting salary config:', error);
            throw error;
        }
    }

    async getPayrolls(): Promise<PayrollRecord[]> {
        const { data, error } = await this.db
            .from('payrolls')
            .select(`
                *,
                account:account_id (
                    account_code,
                    full_name,
                    email,
                    roles:role_id (
                        name
                    )
                )
            `)
            .order('payroll_month', { ascending: false });

        if (error) {
            console.error('Error fetching payrolls:', error);
            throw error;
        }

        return (data || [])
            .filter((row: any) => row.account?.roles?.name && row.account.roles.name !== 'ADMIN')
            .map((row: any) => ({
            id: row.id,
            payroll_code: row.payroll_code,
            account_id: row.account_id,
            payroll_month: row.payroll_month,
            base_salary: row.base_salary,
            overtime_hours: row.overtime_hours,
            overtime_rate: row.overtime_rate,
            teaching_sessions: row.teaching_sessions,
            rate_per_session: row.rate_per_session,
            bonus: row.bonus,
            deductions: row.deductions || [],
            net_pay: row.net_pay,
            status: row.status,
            payment_date: row.payment_date,
            created_at: row.created_at,
            updated_at: row.updated_at,
            account_code: row.account?.account_code,
            full_name: row.account?.full_name,
            email: row.account?.email,
            role: row.account?.roles?.name
        }));
    }
    
    async getMyHistory(accountId: string): Promise<any[]> {
        const { data, error } = await this.db
            .from('payrolls')
            .select('*')
            .eq('account_id', accountId)
            .order('payroll_month', { ascending: false });

        if (error) {
            console.error('Error fetching my salary history:', error);
            throw error;
        }

        return data;
    }

    async createPayrolls(records: any[]): Promise<void> {
        if (!records.length) return;
        
        const { error } = await this.db
            .from('payrolls')
            .insert(records);

        if (error) {
            console.error('Error creating payrolls:', error);
            throw error;
        }
    }

    async updatePayroll(id: string, updates: any): Promise<void> {
        const { error } = await this.db
            .from('payrolls')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error updating payroll:', error);
            throw error;
        }
    }


    async getTutorCompletedSessionsCount(month: string): Promise<Record<string, number>> {
        // Find the last day of the month
        const [yearStr, monthStr] = month.split('-');
        const lastDay = new Date(parseInt(yearStr), parseInt(monthStr), 0).getDate();
        
        const startDate = `${month}-01`;
        const endDate = `${month}-${lastDay.toString().padStart(2, '0')}`;
        
        const { data: sessions, error } = await this.db
            .from('class_sessions')
            .select(`
                tutor_id,
                date,
                attendances (
                    status
                )
            `)
            .gte('date', startDate)
            .lte('date', endDate);
            
        if (error) {
            console.error('Error fetching class sessions for payroll:', error);
            throw error;
        }

        const counts: Record<string, number> = {};
        
        for (const session of (sessions || [])) {
            if (!session.tutor_id) continue;
            
            // A session is completed if it has at least one attendance record that is not 'NOT_YET'
            const attendances = session.attendances as any[] || [];
            const isCompleted = attendances.some(a => a.status !== 'NOT_YET');
            
            if (isCompleted) {
                counts[session.tutor_id] = (counts[session.tutor_id] || 0) + 1;
            }
        }
        
        return counts;
    }
    
    async checkPayrollsExist(month: string): Promise<boolean> {
        const { count, error } = await this.db
            .from('payrolls')
            .select('*', { count: 'exact', head: true })
            .eq('payroll_month', month);
            
        if (error) {
            console.error('Error checking existing payrolls:', error);
            throw error;
        }
        
        return (count || 0) > 0;
    }
}

export const payrollRepository = new PayrollRepository();
