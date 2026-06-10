export interface ClassSession {
    session: number;
    date: string;
    time: string;
    topic: string;
    tutor: string;
    room: string;
    status: 'Upcoming' | 'Completed' | string;
}

export interface EnrolledStudent {
    id: number | string;
    name: string;
    email: string;
    joinedDate: string;
    attendanceRate: number;
}

export interface RoomOption {
    id: string;
    name: string;
    cap: number;
    current?: boolean;
}
