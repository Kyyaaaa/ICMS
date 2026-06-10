export type Role = 'ADMIN' | 'STAFF' | 'TUTOR' | 'LEARNER';

export interface Account {
    id: string;
    full_name: string;
    email: string;
    role: Role;
    status: 'ACTIVE' | 'BANNED';
    created_at: string;
    avatar_url?: string;
    phone_number?: string;
    date_of_birth?: string;
    gender?: string;
}

export interface GetAccountsParams {
    page: number;
    limit: number;
    role?: Role | 'All';
    search?: string;
}
