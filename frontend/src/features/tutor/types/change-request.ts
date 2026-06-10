export interface TutorChangeRequest {
    id: number;
    className: string;
    session: number;
    type: string;
    originalTime: string;
    proposedTime: string | null;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedAt: string;
    staffNote: string;
    finalTime: string;
}

export interface CreateChangeRequestData {
    className: string;
    session: number;
    type: string;
    proposedTime: string | null;
    reason: string;
}
