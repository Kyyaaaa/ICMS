import type { LearnerSession } from '../types/schedule';

const MOCK_LEARNER_SCHEDULE: LearnerSession[] = [
    { id: 1, class: 'IELTS Mastery', session: 'Session 4', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 1, startTime: '18:00', endTime: '20:00', attendance: 'present' }, // Slot 5
    { id: 2, class: 'IELTS Mastery', session: 'Session 5', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 3, startTime: '18:00', endTime: '20:00', attendance: 'upcoming' }, // Slot 5
    { id: 3, class: 'TOEIC Prep', session: 'Session 12', tutor: 'Mr. John Doe', room: 'Room 305', dayIndex: 0, startTime: '15:30', endTime: '17:30', attendance: 'present' }, // Slot 4
    { id: 6, class: 'IELTS Mastery', session: 'Session 3', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 0, startTime: '07:30', endTime: '09:30', attendance: 'present' }, // Slot 1
    { id: 7, class: 'Communication Skills', session: 'Session 2', tutor: 'Ms. Emily Chen', room: 'Room 201', dayIndex: 0, startTime: '09:30', endTime: '11:30', attendance: 'absent' }, // Slot 2
    { id: 4, class: 'TOEIC Prep', session: 'Session 13', tutor: 'Mr. John Doe', room: 'Room 305', dayIndex: 2, startTime: '15:30', endTime: '17:30', attendance: 'absent' }, // Slot 4
    { id: 8, class: 'IELTS Mastery', session: 'Session 6', tutor: 'Dr. Sarah Smith', room: 'Room 302', dayIndex: 2, startTime: '18:00', endTime: '20:00', attendance: 'upcoming' }, // Slot 5
    { id: 5, class: 'Communication Skills', session: 'Session 1', tutor: 'Ms. Emily Chen', room: 'Room 201', dayIndex: 5, startTime: '09:30', endTime: '11:30', attendance: 'upcoming' }, // Slot 2
];

export const LearnerSchedulesService = {
    getWeeklySchedule: async (_date: Date): Promise<LearnerSession[]> => {
        // simulate fetching by date
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_LEARNER_SCHEDULE]), 200));
    }
};
