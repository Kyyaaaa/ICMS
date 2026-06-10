export interface ChangeRequest {
    id: number;
    tutor: string;
    className: string;
    session: number;
    type: string;
    originalTime: string;
    proposedTime: string | null;
    reason: string;
    status: string;
    submittedAt: string;
    finalTime?: string;
    staffNote?: string;
}
