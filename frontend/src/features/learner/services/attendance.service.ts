import type { AttendanceSession } from '../types/attendance';

const MOCK_ATTENDANCE_SESSIONS: AttendanceSession[] = [
    { id: 1, date: '01-10-2024', time: '18:00 - 20:00', tutor: 'Sarah Jenkins', room: 'Room 302', status: 'present' },
    { id: 2, date: '03-10-2024', time: '18:00 - 20:00', tutor: 'Sarah Jenkins', room: 'Room 302', status: 'present' },
    { id: 3, date: '08-10-2024', time: '18:00 - 20:00', tutor: 'John Doe (Sub)', room: 'Room 302', status: 'absent' },
    { id: 4, date: '10-10-2024', time: '18:00 - 20:00', tutor: 'Sarah Jenkins', room: 'Room 302', status: 'absent' },
    { id: 5, date: '15-10-2024', time: '18:00 - 20:00', tutor: 'Sarah Jenkins', room: 'Room 302', status: 'upcoming' },
];

export const LearnerAttendanceService = {
    getAttendanceByClassId: async (_classId: string): Promise<AttendanceSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_ATTENDANCE_SESSIONS]), 200));
    }
};
