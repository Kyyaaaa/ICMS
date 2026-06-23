export interface LearnerSession {
    id: number;
    class: string;
    session: string;
    tutor: string;
    room: string;
    dayIndex: number;
    startTime: string;
    endTime: string;
    attendance: 'present' | 'absent' | 'upcoming';
}
