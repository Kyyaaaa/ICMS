export interface ClassSchedule {
    id: string;
    name: string;
    tutor: string;
    room: string;
    schedule: string;
    students: number;
    maxStudents: number;
}

export interface CourseGroup {
    id: number | string;
    name: string;
    startDate: string;
    endDate: string;
    classes: ClassSchedule[];
}
