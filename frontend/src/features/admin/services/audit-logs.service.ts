import type { AuditLog } from '../types/audit-log';

const mockLogs: AuditLog[] = [
    {
        id: 'L001',
        timestamp: '2026-10-30T14:23:01',
        adminInitials: 'DV',
        adminName: 'Do Hong Vy',
        adminRole: 'Super Admin',
        actionType: 'APPROVE',
        details: 'Approved refund REF-1002 for Learner: Alex Johnson'
    },
    {
        id: 'L002',
        timestamp: '2026-10-30T12:15:42',
        adminInitials: 'SY',
        adminName: 'System Engine',
        adminRole: 'Automated Task',
        actionType: 'SYSTEM',
        details: 'Daily automated database backup to cloud storage completed'
    },
    {
        id: 'L003',
        timestamp: '2026-10-30T09:05:11',
        adminInitials: 'NA',
        adminName: 'Nguyen Van A',
        adminRole: 'Academic Admin',
        actionType: 'CREATE',
        details: 'Created new course IELTS Intensive Mastery (IEL-INT-01)'
    },
    {
        id: 'L004',
        timestamp: '2026-10-29T16:45:22',
        adminInitials: 'DV',
        adminName: 'Do Hong Vy',
        adminRole: 'Super Admin',
        actionType: 'UPDATE',
        details: 'Updated payroll configuration for Tutor: Tran Thi B'
    },
    {
        id: 'L005',
        timestamp: '2026-10-28T10:12:05',
        adminInitials: 'NA',
        adminName: 'Nguyen Van A',
        adminRole: 'Academic Admin',
        actionType: 'DELETE',
        details: 'Deleted classroom allocation for Math 101'
    }
];

export const AuditLogsService = {
    getLogs: async (): Promise<AuditLog[]> => {
        return new Promise(resolve => setTimeout(() => resolve(mockLogs), 200));
    }
};
