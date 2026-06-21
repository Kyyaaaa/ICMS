export interface AvailabilityCycle {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'OPEN' | 'SCHEDULING' | 'ACTIVE' | 'COMPLETED';
}

export interface SubmitAvailabilityDTO {
  cycle_id: string;
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
  cycle_id: string;
  status: 'draft' | 'submitted';
  slots: string[];
}
