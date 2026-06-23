export type Role = 'ADMIN' | 'STAFF' | 'TUTOR' | 'LEARNER';

export interface Account {
    id: string;
    full_name: string;
    email: string;
    role: Role;
    status: 'ACTIVE' | 'BANNED';
    created_at: string;
    avatar_url?: string;
}

export interface GetAccountsParams {
    page: number;
    limit: number;
    role?: Role | 'All';
    search?: string;
}
