export interface SubmitAvailabilityDTO {
  slots: string[];
  status?: 'draft' | 'submitted';
}

export interface AvailabilityResponse {
  status: 'draft' | 'submitted';
  slots: string[];
}

export interface TutorAvailabilityProfile {
  id: string;
  account_code: string;
  name: string;
  avatar_url: string | null;
  status: 'draft' | 'submitted';
  slots: string[];
}

export interface StaffUpdateTutorAvailabilityDTO {
  status: 'draft' | 'submitted';
  slots: string[];
}
