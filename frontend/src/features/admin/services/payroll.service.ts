import type { EmployeeSalaryConfig, PayrollRecord } from '../types/payroll';

const initialConfigs: EmployeeSalaryConfig[] = [
    { staffId: 'STF-001', staffName: 'Emily Watson', role: 'Staff', email: 'emily.w@example.com', baseSalary: 12000000, overtimeRate: 150000, ratePerSession: 0 },
    { staffId: 'STF-002', staffName: 'David Lee', role: 'Admin', email: 'david.l@example.com', baseSalary: 20000000, overtimeRate: 200000, ratePerSession: 0 },
    { staffId: 'TUT-001', staffName: 'Dr. Sarah Smith', role: 'Tutor', email: 'sarah.smith@example.com', baseSalary: 0, overtimeRate: 0, ratePerSession: 600000 },
    { staffId: 'TUT-002', staffName: 'Michael Chen', role: 'Tutor', email: 'michael.c@example.com', baseSalary: 0, overtimeRate: 0, ratePerSession: 450000 }
];

const initialRecords: PayrollRecord[] = [
    {
        id: 'PAY-1001', staffId: 'STF-001', staffName: 'Emily Watson', role: 'Staff', email: 'emily.w@example.com',
        month: '2026-10', baseSalary: 12000000, overtimeHours: 5, overtimeRate: 150000, bonus: 500000, 
        deductionItems: [{ id: '1', reason: 'Tax & Insurance', amount: 1275000 }], status: 'Pending'
    },
    {
        id: 'PAY-1002', staffId: 'STF-002', staffName: 'David Lee', role: 'Admin', email: 'david.l@example.com',
        month: '2026-10', baseSalary: 20000000, overtimeHours: 0, overtimeRate: 200000, bonus: 0, 
        deductionItems: [{ id: '1', reason: 'Tax & Insurance', amount: 2000000 }], status: 'Paid', paymentDate: '2026-10-30'
    },
    {
        id: 'PAY-2001', staffId: 'TUT-001', staffName: 'Dr. Sarah Smith', role: 'Tutor', email: 'sarah.smith@example.com',
        month: '2026-10', teachingSessions: 48, ratePerSession: 600000, bonus: 1000000, 
        deductionItems: [{ id: '1', reason: 'Tax', amount: 3150000 }], status: 'Processed', paymentDate: '2026-10-28'
    },
    {
        id: 'PAY-2002', staffId: 'TUT-002', staffName: 'Michael Chen', role: 'Tutor', email: 'michael.c@example.com',
        month: '2026-10', teachingSessions: 32, ratePerSession: 450000, bonus: 0, 
        deductionItems: [{ id: '1', reason: 'Tax', amount: 1550000 }], status: 'Pending'
    }
];

// For mocked memory DB
let configDb = [...initialConfigs];
let recordDb = [...initialRecords];

export const PayrollService = {
    getConfigs: async (): Promise<EmployeeSalaryConfig[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...configDb]), 200));
    },

    updateConfig: async (config: EmployeeSalaryConfig): Promise<void> => {
        return new Promise(resolve => setTimeout(() => {
            configDb = configDb.map(c => c.staffId === config.staffId ? config : c);
            resolve();
        }, 200));
    },

    getRecords: async (): Promise<PayrollRecord[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...recordDb]), 200));
    },

    updateRecord: async (record: PayrollRecord): Promise<void> => {
        return new Promise(resolve => setTimeout(() => {
            recordDb = recordDb.map(r => r.id === record.id ? record : r);
            resolve();
        }, 200));
    },

    createRecords: async (records: PayrollRecord[]): Promise<void> => {
        return new Promise(resolve => setTimeout(() => {
            recordDb = [...recordDb, ...records];
            resolve();
        }, 200));
    }
};
