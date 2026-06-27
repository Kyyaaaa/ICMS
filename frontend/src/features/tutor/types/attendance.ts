export interface AttendanceClass {
    id: string;
    name: string;
    students: number;
}

export interface AttendanceSession {
    id: string;
    classId: string;
    name: string;
    date: string;
    slot?: string;
    time: string;
    status: 'pending' | 'submitted';
}

export interface AttendanceStudent {
    id: string;
    code: string;
    name: string;
}

export type AttendanceStatus = 'not_yet' | 'present' | 'absent' | null;

export type AttendanceRecordMap = Record<string, Record<string, AttendanceStatus>>;
