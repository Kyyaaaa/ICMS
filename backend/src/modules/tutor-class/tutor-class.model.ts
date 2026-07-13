export interface Assessment {
  id: string;
  class_id: string;
  name: string;
  order_index: number;
}

export interface StudentGrade {
  assessment_id: string;
  learner_id: string;
  score: number;
  feedback?: string;
}

export interface SaveGradebookPayload {
  deletedAssessmentIds?: string[];
  upsertAssessments?: Partial<Assessment>[];
  upsertGrades?: StudentGrade[];
}

export interface GradebookData {
  assessments: Assessment[];
  students: {
    id: string;
    name: string;
    email: string;
    grades: Record<string, { score: number; feedback?: string }>;
  }[];
  grading_status: string;
}
