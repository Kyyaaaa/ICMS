export interface GradebookEntry {
  learner_id: string;
  learner_name?: string;
  learner_code?: string;
  listening?: number | null;
  reading?: number | null;
  writing?: number | null;
  speaking?: number | null;
  overall?: number | null;
  comments?: string | null;
}

export interface GradebookData {
  entries: GradebookEntry[];
}
