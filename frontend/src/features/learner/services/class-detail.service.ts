import type { ClassDetailData } from '../types/class-detail';

const MOCK_CLASS_DETAIL: Record<string, ClassDetailData> = {
    '1': {
        id: '1',
        courseName: 'IELTS Academic - Reading',
        status: 'Ongoing',
        description: 'A rigorous program designed to push your academic English to the highest level. Focuses on complex reading passages and advanced essay structuring.',
        schedule: 'Tue, Thu',
        time: '18:00 - 20:00',
        classroom: 'Room 302',
        totalSessions: 24,
        tutor: {
            name: 'Sarah Jenkins',
            title: 'Senior IELTS Tutor',
            rating: 4.9,
            initials: 'SJ'
        },
        progress: {
            completed: 12,
            percentage: 50
        },
        curriculum: [
            { sessionNumber: 1, title: 'Introduction to IELTS Reading', description: 'Understanding test format, question types, and basic skimming techniques.', status: 'completed' },
            { sessionNumber: 2, title: 'Skimming and Scanning Mastery', description: 'Advanced techniques for quickly locating information in complex passages.', status: 'ongoing' },
            { sessionNumber: 3, title: 'True/False/Not Given', description: 'Strategies to identify the writer\'s claims and avoid common traps.', status: 'upcoming' }
        ]
    }
};

export const LearnerClassDetailService = {
    getClassDetail: async (id: string): Promise<ClassDetailData | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_CLASS_DETAIL[id] || MOCK_CLASS_DETAIL['1']), 200));
    }
};
