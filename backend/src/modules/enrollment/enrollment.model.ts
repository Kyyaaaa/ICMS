export interface Enrollment {
  id: string;
  learner_id: string;
  class_id: string;
  enrollment_date: string;
  status: 'ACTIVE' | 'CANCELED';
}

export interface CreateEnrollmentDTO {
  class_id: string;
}
