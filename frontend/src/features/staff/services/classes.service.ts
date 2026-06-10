import type { CourseGroup } from '../types/class';

const MOCK_COURSES: CourseGroup[] = [
    {
        id: 1,
        name: 'IELTS Masterclass (Band 7.0+)',
        startDate: '01-10-2026',
        endDate: '31-12-2026',
        classes: [
            { id: '101', name: 'IELTS-A01', tutor: 'Dr. Sarah Connor', room: 'Room 102', schedule: 'Mon/Wed/Fri 18:00 - 20:00', students: 15, maxStudents: 20 },
            { id: '102', name: 'IELTS-A02', tutor: 'Mr. James Bond', room: 'Room 205', schedule: 'Tue/Thu 18:00 - 20:30', students: 25, maxStudents: 25 },
        ]
    },
    {
        id: 2,
        name: 'TOEIC Intensive (750+)',
        startDate: '01-11-2026',
        endDate: '28-02-2027',
        classes: [
            { id: '201', name: 'TOEIC-B01', tutor: 'Ms. Emily Blunt', room: 'Room 105', schedule: 'Sat/Sun 09:00 - 11:30', students: 20, maxStudents: 30 },
        ]
    }
];

export const ClassesService = {
    getCourseGroups: async (): Promise<CourseGroup[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_COURSES), 200));
    }
};
