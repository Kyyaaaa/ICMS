export interface LearnerClass {
    id: string;
    courseName: string;
    className: string;
    classCode: string;
    tutorName: string;
    room: string;
    schedule: string;
    time: string;
    startDate: string;
    endDate: string;
    status: 'Ongoing' | 'Completed';
}
