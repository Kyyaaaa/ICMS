import type { ClassSession, EnrolledStudent, RoomOption } from '../types/class-detail';

const MOCK_SESSIONS: ClassSession[] = [
    { session: 1, date: '01-10-2026', time: '18:00 - 20:00', topic: 'Introduction to IELTS Speaking Part 1', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Completed' },
    { session: 2, date: '03-10-2026', time: '18:00 - 20:00', topic: 'Listening: Form Completion', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Completed' },
    { session: 3, date: '05-10-2026', time: '18:00 - 20:00', topic: 'Reading: True/False/Not Given', tutor: 'Mr. James Bond', room: 'Room 102', status: 'Upcoming' },
    { session: 4, date: '08-10-2026', time: '18:00 - 20:00', topic: 'Writing Task 1: Bar Charts', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Upcoming' },
    { session: 5, date: '10-10-2026', time: '18:00 - 20:00', topic: 'Speaking Part 2 Practice', tutor: 'Dr. Sarah Connor', room: 'Room 102', status: 'Upcoming' },
];

const MOCK_STUDENTS: EnrolledStudent[] = [
    { id: 1, name: 'Student Name 1', email: 'student1@gmail.com', joinedDate: '01/10/2026', attendanceRate: 90 },
    { id: 2, name: 'Student Name 2', email: 'student2@gmail.com', joinedDate: '01/10/2026', attendanceRate: 85 },
    { id: 3, name: 'Student Name 3', email: 'student3@gmail.com', joinedDate: '01/10/2026', attendanceRate: 100 },
    { id: 4, name: 'Student Name 4', email: 'student4@gmail.com', joinedDate: '01/10/2026', attendanceRate: 70 },
    { id: 5, name: 'Student Name 5', email: 'student5@gmail.com', joinedDate: '01/10/2026', attendanceRate: 95 },
];

const MOCK_ROOMS: RoomOption[] = [
    { id: '102', name: 'Room 102', cap: 30, current: true },
    { id: '105', name: 'Room 105', cap: 30 },
    { id: '201', name: 'Room 201', cap: 25 },
];

export const ClassDetailService = {
    getSchedule: async (_classId: string): Promise<ClassSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_SESSIONS]), 200));
    },
    
    getStudents: async (_classId: string): Promise<EnrolledStudent[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_STUDENTS]), 200));
    },

    getAvailableRooms: async (): Promise<RoomOption[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_ROOMS]), 100));
    },

    updateSession: async (_session: ClassSession): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 200));
    }
};
