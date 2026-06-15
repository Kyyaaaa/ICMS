export interface Attendance {
  id?: string;
  session_id: string;
  learner_id: string;
  status: 'NOT_YET' | 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED';
  notes?: string;
}

export interface UpdateAttendanceDTO {
  learner_id: string;
  status: 'NOT_YET' | 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED';
  notes?: string;
}
