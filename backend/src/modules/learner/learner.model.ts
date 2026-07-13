
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
