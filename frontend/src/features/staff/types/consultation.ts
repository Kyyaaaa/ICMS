export interface ConsultationRequest {
    id: string;
    guest_name: string;
    guest_phone: string;
    guest_email: string | null;
    status: 'Pending' | 'Contacted' | 'Converted' | 'Canceled';
    inquiry_details: string;
    call_notes: string | null;
    handled_by_staff_id: string | null;
    created_at: string;
    updated_at: string;
}
