import type { Course } from '../types/course';

// Mock data until backend is ready
const MOCK_COURSES: Course[] = [
    { id: '1', title: 'IELTS Intensive Mastery', code: 'IEL-INT-01', category: 'Masterclass', status: 'Active', price: '899,000', classes: 3 },
    { id: '2', title: 'Academic 6.5+', code: 'IEL-ACA-01', category: 'Standard', status: 'Active', price: '499,000', classes: 5 }
];

export const CoursesService = {
    getCourses: async (): Promise<Course[]> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_COURSES);
            }, 300);
        });
    },

    deleteCourse: async (_id: string): Promise<boolean> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 300);
        });
    }
};
