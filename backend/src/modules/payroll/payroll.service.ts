import { payrollRepository } from './payroll.repository';
import type { UpdateSalaryConfigDTO, GeneratePayrollDTO, UpdatePayrollDTO, DeductionItem } from './payroll.model';

class PayrollService {
    async getSalaryConfigs() {
        return await payrollRepository.getSalaryConfigs();
    }

    async updateSalaryConfig(accountId: string, dto: UpdateSalaryConfigDTO) {
        await payrollRepository.upsertSalaryConfig({
            ...dto,
            account_id: accountId
        });
        return { message: 'Salary config updated successfully' };
    }

    async getPayrolls() {
        return await payrollRepository.getPayrolls();
    }
    
    async getMyHistory(accountId: string) {
        return await payrollRepository.getMyHistory(accountId);
    }

    async generatePayroll(dto: GeneratePayrollDTO) {
        const { month } = dto;
        
        // 1. Check if payrolls already exist for this month
        const exists = await payrollRepository.checkPayrollsExist(month);
        if (exists) {
            throw new Error(`Payroll for month ${month} has already been generated.`);
        }

        // 2. Fetch eligible accounts and their configs
        const [configs, tutorSessionCounts] = await Promise.all([
            payrollRepository.getSalaryConfigs(),
            payrollRepository.getTutorCompletedSessionsCount(month)
        ]);
        
        // 3. Generate raw payroll records
        const recordsToInsert = configs.map(config => {
            // Generate a simple payroll code
            const rolePrefix = config.role?.substring(0, 3).toUpperCase() || 'EMP';
            const code = `PAY-${month.replace('-', '')}-${rolePrefix}-${config.account_code || config.account_id.substring(0, 6)}`;
            
            const overtimeHours = 0;
            const isTutor = config.role === 'TUTOR';
            const teachingSessions = isTutor ? (tutorSessionCounts[config.account_id] || 0) : 0;
            const bonus = 0;
            const deductions: DeductionItem[] = [];
            
            const netPay = this.calculateNetPay(
                config.base_salary,
                overtimeHours,
                config.overtime_rate,
                teachingSessions,
                config.rate_per_session,
                bonus,
                deductions
            );

            return {
                payroll_code: code,
                account_id: config.account_id,
                payroll_month: month,
                base_salary: config.base_salary,
                overtime_hours: overtimeHours,
                overtime_rate: config.overtime_rate,
                teaching_sessions: teachingSessions,
                rate_per_session: config.rate_per_session,
                bonus: bonus,
                deductions: deductions,
                net_pay: netPay,
                status: 'Pending'
            };
        });

        // 4. Save to DB
        await payrollRepository.createPayrolls(recordsToInsert);
        
        return { message: `Successfully generated payroll for ${month}.`, count: recordsToInsert.length };
    }

    async updatePayroll(id: string, dto: UpdatePayrollDTO) {
        // Fetch current payroll to recalculate net pay if financial fields change
        const payrolls = await payrollRepository.getPayrolls();
        const currentRecord = payrolls.find(p => p.id === id);
        
        if (!currentRecord) {
            throw new Error('Payroll record not found');
        }

        const updates: any = { ...dto };
        
        // Recalculate net pay if bonus or deductions changed
        if (dto.bonus !== undefined || dto.deductions !== undefined) {
            const newBonus = dto.bonus !== undefined ? dto.bonus : currentRecord.bonus;
            const newDeductions = dto.deductions !== undefined ? dto.deductions : currentRecord.deductions;
            
            updates.net_pay = this.calculateNetPay(
                currentRecord.base_salary,
                currentRecord.overtime_hours,
                currentRecord.overtime_rate,
                currentRecord.teaching_sessions,
                currentRecord.rate_per_session,
                newBonus,
                newDeductions
            );
        }

        await payrollRepository.updatePayroll(id, updates);
        return { message: 'Payroll updated successfully' };
    }
    
    private calculateNetPay(
        base: number, 
        otHours: number, 
        otRate: number, 
        sessions: number, 
        sessionRate: number, 
        bonus: number, 
        deductions: DeductionItem[]
    ): number {
        const earnings = Number(base) + (Number(otHours) * Number(otRate)) + (Number(sessions) * Number(sessionRate)) + Number(bonus);
        const totalDeductions = deductions.reduce((sum, item) => sum + Number(item.amount), 0);
        return Math.max(0, earnings - totalDeductions);
    }
}

export const payrollService = new PayrollService();
