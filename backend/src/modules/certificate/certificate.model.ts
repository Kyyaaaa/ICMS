export interface Certificate {
  id: string;
  tutor_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiration_date: string | null;
  status: 'Pending Verification' | 'Verified' | 'Rejected';
  file_url: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateCertificateInput {
  name?: string;
  issuer?: string;
  issue_date?: string;
  expiration_date?: string | null;
  file_url?: string;
}
