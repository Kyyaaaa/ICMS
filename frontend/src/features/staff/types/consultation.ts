export interface ConsultationRequest {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: 'New' | 'Contacted' | 'Resolved' | string;
    message: string;
    targetScore: string;
    date: string;
    staffNote: string;
}
