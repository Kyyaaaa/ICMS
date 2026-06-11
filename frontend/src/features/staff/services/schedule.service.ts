import type { ScheduleSession } from '../types/schedule';

const MOCK_SCHEDULE: ScheduleSession[] = [
    { id: 1, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', dayIndex: 0, startTime: '07:30', endTime: '09:30', color: 'bg-blue-50 border-blue-200 border-l-blue-600' }, // Slot 1
    { id: 2, class: 'TOEIC-B12', tutor: 'Mr. John Doe', room: 'Room 202', dayIndex: 0, startTime: '13:30', endTime: '15:30', color: 'bg-emerald-50 border-emerald-200 border-l-emerald-600' }, // Slot 3
    { id: 3, class: 'COM202', tutor: 'Ms. Emily Chen', room: 'Room 205', dayIndex: 1, startTime: '09:30', endTime: '11:30', color: 'bg-purple-50 border-purple-200 border-l-purple-600' }, // Slot 2
    { id: 4, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', dayIndex: 2, startTime: '07:30', endTime: '09:30', color: 'bg-blue-50 border-blue-200 border-l-blue-600' }, // Slot 1
    { id: 5, class: 'TOEIC-B12', tutor: 'Mr. John Doe', room: 'Room 202', dayIndex: 2, startTime: '13:30', endTime: '15:30', color: 'bg-emerald-50 border-emerald-200 border-l-emerald-600' }, // Slot 3
    { id: 6, class: 'ENG401', tutor: 'Mr. Alan Wake', room: 'Room 402', dayIndex: 3, startTime: '18:00', endTime: '20:00', color: 'bg-amber-50 border-amber-200 border-l-amber-600' }, // Slot 5
    { id: 7, class: 'IE1601', tutor: 'Dr. Sarah Smith', room: 'Room 301', dayIndex: 4, startTime: '07:30', endTime: '09:30', color: 'bg-blue-50 border-blue-200 border-l-blue-600' }, // Slot 1
    { id: 8, class: 'COM202', tutor: 'Ms. Emily Chen', room: 'Room 205', dayIndex: 5, startTime: '09:30', endTime: '11:30', color: 'bg-purple-50 border-purple-200 border-l-purple-600' }, // Slot 2
];

export const ScheduleService = {
    getSchedule: async (_startDate: Date, _endDate: Date): Promise<ScheduleSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_SCHEDULE]), 200));
    },

    updateSession: async (_updatedSession: ScheduleSession): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 200));
    }
};
