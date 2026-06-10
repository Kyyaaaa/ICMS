export interface AccountResponse {
  id: string;
  email: string;
  role: string;
  full_name: string;
  phone_number: string | null;
  date_of_birth?: string | null;
  gender?: string | null; 
  avatar_url?: string | null;
  created_at: string;
  status: 'ACTIVE' | 'BANNED'; 
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
  email?: string;
  password?: string;
  role?: string;
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
}
