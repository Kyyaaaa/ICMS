export interface AttendanceSession {
    id: number;
    date: string;
    time: string;
    tutor: string;
    room: string;
    status: 'present' | 'absent' | 'upcoming';
}
