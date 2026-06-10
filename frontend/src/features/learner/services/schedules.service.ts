import type { LearnerSession } from '../types/schedule';

const MOCK_LEARNER_SCHEDULE: LearnerSession[] = [
    { id: 1, class: 'IELTS Mastery', session: 'Session 4', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 1, startTime: '18:00', endTime: '20:00', attendance: 'present' },
    { id: 2, class: 'IELTS Mastery', session: 'Session 5', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 3, startTime: '18:00', endTime: '20:00', attendance: 'upcoming' },
    { id: 3, class: 'TOEIC Prep', session: 'Session 12', tutor: 'Mr. John Doe', room: 'Room 305', dayIndex: 0, startTime: '19:00', endTime: '21:00', attendance: 'present' },
    { id: 4, class: 'TOEIC Prep', session: 'Session 13', tutor: 'Mr. John Doe', room: 'Room 305', dayIndex: 2, startTime: '19:00', endTime: '21:00', attendance: 'absent' },
    { id: 5, class: 'Communication Skills', session: 'Session 1', tutor: 'Ms. Emily Chen', room: 'Room 201', dayIndex: 5, startTime: '09:00', endTime: '11:00', attendance: 'upcoming' },
];

export const LearnerSchedulesService = {
    getWeeklySchedule: async (_date: Date): Promise<LearnerSession[]> => {
        // simulate fetching by date
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_LEARNER_SCHEDULE]), 200));
    }
};
