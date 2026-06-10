export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'SYSTEM';

export type AuditLog = {
    id: string;
    timestamp: string; // ISO Date String
    adminInitials: string;
    adminName: string;
    adminRole: string;
    actionType: ActionType;
    details: string;
};
