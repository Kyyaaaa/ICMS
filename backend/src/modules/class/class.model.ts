export interface SessionConfig {
  session_number?: number;
  date: string;
  slot: string; // 'slot1', 'slot2', ...
}

export interface CreateClassDTO {
  name: string;
  course_id: string;
  tutor_id?: string | null;
  classroom_id?: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  sessions?: SessionConfig[];
}

export interface UpdateClassDTO {
  tutor_id?: string | null;
  classroom_id?: string | null;
  status?: string;
}

export interface UpdateClassSessionDTO {
  tutor_id?: string | null;
  classroom_id?: string | null;
  date?: string;
  slot?: string;
}

export const ALLOWED_SLOTS = [
  'slot1',
  'slot2',
  'slot3',
  'slot4',
  'slot5',
  'slot6'
];
