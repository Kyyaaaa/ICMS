import type { LearnerClass } from '../types/class';

// Mock data
const MOCK_CLASSES: LearnerClass[] = [
    {
        id: '1',
        courseName: 'IELTS Intensive 6.5+',
        className: 'Reading Mastery',
        classCode: 'IE-R01',
        tutorName: 'Ms. Emily Clark',
        room: 'Room 302',
        schedule: 'Tue, Thu',
        time: '18:00 - 20:00',
        startDate: 'Oct 01',
        endDate: 'Dec 31',
        status: 'Ongoing'
    },
    {
        id: '2',
        courseName: 'IELTS Foundation 5.0+',
        className: 'Speaking Focus',
        classCode: 'IE-S02',
        tutorName: 'Mr. John Doe',
        room: 'Room 305',
        schedule: 'Mon, Wed',
        time: '19:00 - 21:00',
        startDate: 'Oct 01',
        endDate: 'Dec 31',
        status: 'Ongoing'
    },
    {
        id: '3',
        courseName: 'IELTS Academic',
        className: 'Grammar Bootcamp',
        classCode: 'IE-G01',
        tutorName: 'Mr. James Bond',
        room: 'Room 201',
        schedule: 'Sat, Sun',
        time: '09:00 - 11:00',
        startDate: 'Jan 15',
        endDate: 'Mar 15',
        status: 'Completed'
    }
];

export const ClassesService = {
    getMyClasses: async (): Promise<LearnerClass[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CLASSES]), 300));
    }
};
