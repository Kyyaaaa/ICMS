import type { TutorScheduleSession } from '../types/schedule';

const MOCK_TUTOR_SCHEDULE: TutorScheduleSession[] = [
    { id: 1, classId: 'c1', sessionId: 's1', class: 'IELTS Mastery', session: 'Session 1', room: 'Room 302', students: 15, dayIndex: 0, startTime: '18:00', endTime: '20:00', attendance: 'taken' },
    { id: 2, classId: 'c1', sessionId: 's2', class: 'IELTS Mastery', session: 'Session 2', room: 'Room 302', students: 15, dayIndex: 2, startTime: '18:00', endTime: '20:00', attendance: 'pending' },
    { id: 3, classId: 'c2', sessionId: 's4', class: 'TOEIC Prep', session: 'Session 1', room: 'Room 305', students: 20, dayIndex: 1, startTime: '19:00', endTime: '21:00', attendance: 'taken' },
    { id: 4, classId: 'c2', sessionId: 's5', class: 'TOEIC Prep', session: 'Session 2', room: 'Room 305', students: 20, dayIndex: 3, startTime: '19:00', endTime: '21:00', attendance: 'pending' },
    { id: 5, classId: 'c3', sessionId: 's6', class: 'Communication Skills', session: 'Session 1', room: 'Room 201', students: 12, dayIndex: 5, startTime: '09:00', endTime: '11:00', attendance: 'pending' },
];

export const ScheduleService = {
    getSchedule: async (): Promise<TutorScheduleSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_TUTOR_SCHEDULE), 200));
    }
};
