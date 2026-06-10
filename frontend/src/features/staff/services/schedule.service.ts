import type { ScheduleSession } from '../types/schedule';

const MOCK_SCHEDULE: ScheduleSession[] = [
    { id: 1, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', dayIndex: 0, startTime: '08:00', endTime: '10:00', color: 'bg-blue-100 border-blue-300' },
    { id: 2, class: 'TOEIC-B12', tutor: 'Mr. John Doe', room: 'Room 202', dayIndex: 0, startTime: '14:00', endTime: '16:00', color: 'bg-emerald-100 border-emerald-300' },
    { id: 3, class: 'COM202', tutor: 'Ms. Emily Chen', room: 'Room 205', dayIndex: 1, startTime: '09:00', endTime: '11:00', color: 'bg-purple-100 border-purple-300' },
    { id: 4, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', dayIndex: 2, startTime: '08:00', endTime: '10:00', color: 'bg-blue-100 border-blue-300' },
    { id: 5, class: 'TOEIC-B12', tutor: 'Mr. John Doe', room: 'Room 202', dayIndex: 2, startTime: '14:00', endTime: '16:00', color: 'bg-emerald-100 border-emerald-300' },
    { id: 6, class: 'ENG401', tutor: 'Mr. Alan Wake', room: 'Room 402', dayIndex: 3, startTime: '18:00', endTime: '20:00', color: 'bg-amber-100 border-amber-300' },
    { id: 7, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', dayIndex: 4, startTime: '08:00', endTime: '10:00', color: 'bg-blue-100 border-blue-300' },
    { id: 8, class: 'COM202', tutor: 'Ms. Emily Chen', room: 'Room 205', dayIndex: 5, startTime: '09:00', endTime: '11:00', color: 'bg-purple-100 border-purple-300' },
];

export const ScheduleService = {
    getSchedule: async (_startDate: Date, _endDate: Date): Promise<ScheduleSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_SCHEDULE]), 200));
    },

    updateSession: async (_updatedSession: ScheduleSession): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 200));
    }
};
