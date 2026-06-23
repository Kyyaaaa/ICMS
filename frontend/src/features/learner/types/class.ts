export interface LearnerClass {
    id: string;
    courseName: string;
    className: string;
    classCode: string;
    tutorName: string;
    room: string;
    schedules: string[];
    startDate: string;
    endDate: string;
    status: 'Ongoing' | 'Completed';
}
