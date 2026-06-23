export interface TutorScheduleSession {
    id: number;
    classId: string;
    sessionId: string;
    class: string;
    session: string;
    room: string;
    students: number;
    dayIndex: number;
    startTime: string;
    endTime: string;
    attendance: 'taken' | 'pending';
}
