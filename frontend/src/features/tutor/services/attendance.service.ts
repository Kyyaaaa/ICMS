import type { AttendanceClass, AttendanceSession, AttendanceStudent, AttendanceRecordMap } from '../types/attendance';

const MOCK_CLASSES: AttendanceClass[] = [
    { id: 'c1', name: 'IELTS Mastery - Advanced', students: 5 },
    { id: 'c2', name: 'TOEIC Prep - Intensive', students: 5 },
    { id: 'c3', name: 'Communication Skills', students: 5 },
];

const MOCK_SESSIONS: AttendanceSession[] = [
    { id: 's1', classId: 'c1', name: 'Session 1 - Reading Strategies', date: '2026-06-01', time: '18:00 - 20:00', status: 'submitted' },
    { id: 's2', classId: 'c1', name: 'Session 2 - Listening Practice', date: '2026-06-03', time: '18:00 - 20:00', status: 'pending' },
    { id: 's3', classId: 'c1', name: 'Session 3 - Speaking Mock Test', date: '2026-06-05', time: '18:00 - 20:00', status: 'pending' },
    { id: 's4', classId: 'c2', name: 'Session 1 - Grammar Review', date: '2026-06-02', time: '19:00 - 21:00', status: 'submitted' },
    { id: 's5', classId: 'c2', name: 'Session 2 - Reading Comp', date: '2026-06-04', time: '19:00 - 21:00', status: 'pending' },
    { id: 's6', classId: 'c3', name: 'Session 1 - Introduction', date: '2026-06-01', time: '09:00 - 11:00', status: 'submitted' },
];

const MOCK_STUDENTS: AttendanceStudent[] = [
    { id: 'stu1', code: 'STU-001', name: 'Nguyen Van A' },
    { id: 'stu2', code: 'STU-002', name: 'Tran Thi B' },
    { id: 'stu3', code: 'STU-003', name: 'Le Van C' },
    { id: 'stu4', code: 'STU-004', name: 'Pham Thi D' },
    { id: 'stu5', code: 'STU-005', name: 'Hoang Van E' },
];

const INITIAL_RECORDS: AttendanceRecordMap = {
    's1': { 'stu1': 'present', 'stu2': 'present', 'stu3': 'present', 'stu4': 'present', 'stu5': 'absent' },
    's4': { 'stu1': 'present', 'stu2': 'absent', 'stu3': 'present', 'stu4': 'present', 'stu5': 'present' },
    's6': { 'stu1': 'present', 'stu2': 'present', 'stu3': 'present', 'stu4': 'present', 'stu5': 'present' },
};

export const AttendanceService = {
    getClasses: async (): Promise<AttendanceClass[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_CLASSES), 200));
    },
    getSessions: async (): Promise<AttendanceSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_SESSIONS), 200));
    },
    getStudents: async (): Promise<AttendanceStudent[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_STUDENTS), 200));
    },
    getInitialRecords: async (): Promise<AttendanceRecordMap> => {
        return new Promise(resolve => setTimeout(() => resolve(INITIAL_RECORDS), 200));
    }
};
