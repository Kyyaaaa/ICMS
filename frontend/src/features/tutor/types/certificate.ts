export interface Certificate {
    id: string | number;
    name: string;
    issuer: string;
    issueDate: string;
    expDate: string;
    status: string;
    rejection_reason?: string | null;
    file: string;
    created_at: string;
}
