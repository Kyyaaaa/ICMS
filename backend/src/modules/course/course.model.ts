export interface CourseSession {
  id: string;
  course_id: string;
  session_number: number;
  title: string;
  description?: string;
  created_at?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  band: string;
  sessions: number;
  format: string;
  category: string;
  type: string;
  price: number;
  original_price: number;
  description?: string;
  next_cohort?: string;
  image_url?: string;
  status: string;
  max_size: number;
  location: string;
  language: string;
  allow_installments: boolean;
  number_of_installments: number;
  created_at?: string;
  updated_at?: string;
  sessions_list?: CourseSession[];
}
