export interface CreateConsultationDTO {
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  course_of_interest?: string;
  course?: string;
  inquiry_details: string;
}

export interface UpdateConsultationDTO {
  status?: 'Pending' | 'Contacted' | 'Converted' | 'Canceled';
  call_notes?: string;
}
