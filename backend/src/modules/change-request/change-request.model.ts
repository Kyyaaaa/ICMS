export interface CreateChangeRequestDTO {
    tutor_id: string;
    class_id: string;
    session_id: string;
    type: string;
    original_time: string;
    proposed_time?: string | null;
    reason: string;
    status: string;
}

export interface UpdateChangeRequestStatusDTO {
    status: string;
    staff_note?: string;
    final_time?: string;
}

export interface ChangeRequest {
    id: string;
    tutor_id: string;
    class_id: string;
    session_id: string;
    type: string;
    original_time: string;
    proposed_time: string | null;
    reason: string;
    status: string;
    staff_note: string | null;
    final_time: string | null;
    created_at: string;
    updated_at: string;
}
