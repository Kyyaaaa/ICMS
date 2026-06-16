export interface Attendance {
  id?: string;
  session_id: string;
  learner_id: string;
  status: 'NOT_YET' | 'PRESENT' | 'ABSENT';
  notes?: string;
}

export interface UpdateAttendanceDTO {
  learner_id: string;
  status: 'NOT_YET' | 'PRESENT' | 'ABSENT';
  notes?: string;
}
