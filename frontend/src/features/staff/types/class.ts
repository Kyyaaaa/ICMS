export interface Class {
    id: string;
    name: string;
    course_id: string;
    tutor_id: string | null;
    classroom_id: string | null;
    start_date: string;
    end_date: string;
    capacity: number;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
    created_at: string;
    updated_at: string;
    courses?: { id: string; title: string; code: string };
    tutor?: { id: string; full_name: string; email: string };
    classroom?: { id: string; room_name: string };
}

export interface Session {
    id: string;
    class_id: string;
    session_number: number;
    date: string;
    slot: string;
    tutor_id: string | null;
    classroom_id: string | null;
    created_at: string;
    updated_at: string;
    tutor?: { id: string; full_name: string; email: string };
    classroom?: { id: string; room_name: string };
}

export interface SessionConfig {
    session_number?: number;
    date: string;
    slot: string;
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
    name?: string;
    tutor_id?: string | null;
    classroom_id?: string | null;
    capacity?: number;
    status?: string;
}

export interface UpdateClassSessionDTO {
    tutor_id?: string | null;
    classroom_id?: string | null;
    date?: string;
    slot?: string;
}

export interface CourseGroup {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    classes: Class[];
}
