export interface AccountResponse {
  id: string;
  account_code: string;
  email: string;
  role: string;
  full_name: string;
  phone_number: string | null;
  date_of_birth?: string | null;
  gender?: string | null; 
  avatar_url?: string | null;
  created_at: string;
  last_sign_in_at?: string;
  is_active: boolean; // false means Banned (Soft Deleted)
}

export interface CreateAccountDTO {
  email: string;
  password?: string;
  role: string;
  full_name: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface UpdateAccountDTO {
  password?: string;
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
}
