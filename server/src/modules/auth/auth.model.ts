export interface UserMetadata {
  full_name: string;
  phone_number: string | null;
  role: string;
}

export interface OtpData {
  id: string;
  email: string;
  otp: string;
  expires_at: string;
  is_used: boolean;
  reset_token: string | null;
}

export interface AccountData {
  id: string;
  email: string;
  role: string;
  status: string;
}
