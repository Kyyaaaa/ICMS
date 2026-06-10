import type { LearnerClass } from '../types/class';

// Mock data
const MOCK_CLASSES: LearnerClass[] = [
    {
        id: '1',
        courseName: 'IELTS Academic',
        className: 'Reading Mastery',
        classCode: 'IE-R01',
        tutorName: 'Ms. Sarah Jenkins',
        room: 'Room 302',
        schedule: 'Tue, Thu',
        time: '18:00 - 20:00',
        startDate: 'Oct 01',
        endDate: '31-12-2026',
        status: 'Ongoing'
    },
    {
        id: '2',
        courseName: 'IELTS Academic',
        className: 'Writing Intensive',
        classCode: 'IE-W02',
        tutorName: 'Mr. James Bond',
        room: 'Room 305',
        schedule: 'Mon, Wed',
        time: '19:00 - 21:00',
        startDate: 'Oct 01',
        endDate: '31-12-2026',
        status: 'Ongoing'
    }
];

export const ClassesService = {
    getMyClasses: async (): Promise<LearnerClass[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CLASSES]), 300));
    }
};
