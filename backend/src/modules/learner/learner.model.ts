export interface Learner {
  account_id: string;
  created_at: string;
  updated_at: string;
  account?: any; // Contains the joined account data
}

export interface CreateLearnerInput {
  email: string;
  password?: string;
  full_name: string;
  phone_number?: string;
}

export interface UpdateLearnerInput {
  full_name?: string;
  phone_number?: string;
  status?: string;
}
