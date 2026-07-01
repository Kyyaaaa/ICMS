export interface TutorChangeRequest {
    id: string;
    className: string;
    session: number;
    type: string;
    originalTime: string;
    proposedTime: string | null;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
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
    class_id: string;
    session_id: string;
    tutor_id: string;
    originalTime: string;
    proposed_date?: string | null;
    proposed_slot?: string | null;
    proposed_room_id?: string | null;
}
