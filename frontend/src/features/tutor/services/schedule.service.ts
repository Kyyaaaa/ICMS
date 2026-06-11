import type { TutorScheduleSession } from '../types/schedule';

const MOCK_TUTOR_SCHEDULE: TutorScheduleSession[] = [
    { id: 1, classId: 'c1', sessionId: 's1', class: 'IELTS Mastery', session: 'Session 1', room: 'Room 302', students: 15, dayIndex: 0, startTime: '18:00', endTime: '20:00', attendance: 'taken' },
    { id: 6, classId: 'c2', sessionId: 's10', class: 'TOEIC Prep', session: 'Session 3', room: 'Room 305', students: 20, dayIndex: 0, startTime: '07:30', endTime: '09:30', attendance: 'taken' },
    { id: 7, classId: 'c3', sessionId: 's11', class: 'Communication Skills', session: 'Session 2', room: 'Room 201', students: 12, dayIndex: 0, startTime: '09:30', endTime: '11:30', attendance: 'pending' },
    { id: 2, classId: 'c1', sessionId: 's2', class: 'IELTS Mastery', session: 'Session 2', room: 'Room 302', students: 15, dayIndex: 2, startTime: '18:00', endTime: '20:00', attendance: 'pending' },
    { id: 8, classId: 'c2', sessionId: 's12', class: 'TOEIC Prep', session: 'Session 4', room: 'Room 305', students: 20, dayIndex: 2, startTime: '15:30', endTime: '17:30', attendance: 'pending' },
    { id: 3, classId: 'c2', sessionId: 's4', class: 'TOEIC Prep', session: 'Session 1', room: 'Room 305', students: 20, dayIndex: 1, startTime: '15:30', endTime: '17:30', attendance: 'taken' },
    { id: 4, classId: 'c2', sessionId: 's5', class: 'TOEIC Prep', session: 'Session 2', room: 'Room 305', students: 20, dayIndex: 3, startTime: '15:30', endTime: '17:30', attendance: 'pending' },
    { id: 5, classId: 'c3', sessionId: 's6', class: 'Communication Skills', session: 'Session 1', room: 'Room 201', students: 12, dayIndex: 5, startTime: '09:30', endTime: '11:30', attendance: 'pending' },
];

export const ScheduleService = {
    getSchedule: async (): Promise<TutorScheduleSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_TUTOR_SCHEDULE), 200));
    }
};
