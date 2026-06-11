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
            { sessionNumber: 1, title: 'Introduction to IELTS Reading', description: 'Test format, scoring, and essential Skimming & Scanning techniques.', status: 'completed' },
            { sessionNumber: 2, title: 'Vocabulary Building in Context', description: 'Strategies for guessing unknown words and identifying synonyms/paraphrases.', status: 'completed' },
            { sessionNumber: 3, title: 'True/False/Not Given (Part 1)', description: 'Understanding the difference between False and Not Given with factual texts.', status: 'completed' },
            { sessionNumber: 4, title: 'True/False/Not Given (Part 2)', description: 'Advanced practice with complex sentences and hidden traps.', status: 'completed' },
            { sessionNumber: 5, title: 'Yes/No/Not Given', description: 'Identifying writer\'s claims and views in discursive texts.', status: 'completed' },
            { sessionNumber: 6, title: 'Matching Headings', description: 'Techniques for finding the main idea of a paragraph efficiently.', status: 'completed' },
            { sessionNumber: 7, title: 'Matching Features & Information', description: 'Locating specific details, names, and dates across multiple paragraphs.', status: 'completed' },
            { sessionNumber: 8, title: 'Multiple Choice Questions', description: 'Eliminating distractors and tackling multiple-answer formats.', status: 'completed' },
            { sessionNumber: 9, title: 'Sentence & Summary Completion', description: 'Grammar prediction and finding precise words from the passage.', status: 'completed' },
            { sessionNumber: 10, title: 'Diagram, Table & Flow-chart', description: 'Visual data interpretation and labeling processes.', status: 'completed' },
            { sessionNumber: 11, title: 'Time Management Strategies', description: 'How to allocate 60 minutes across 3 passages effectively.', status: 'completed' },
            { sessionNumber: 12, title: 'Mid-term Mock Test', description: 'Full 1-hour Reading Test under exam conditions.', status: 'completed' },
            { sessionNumber: 13, title: 'Mid-term Review & Error Analysis', description: 'Reviewing the mock test and identifying individual weak points.', status: 'ongoing' },
            { sessionNumber: 14, title: 'Tackling Complex Sentences', description: 'Breaking down long, multi-clause sentences for exact meaning.', status: 'upcoming' },
            { sessionNumber: 15, title: 'Inference & Implication', description: 'Reading between the lines and answering indirect questions.', status: 'upcoming' },
            { sessionNumber: 16, title: 'Advanced Paraphrasing', description: 'Recognizing highly modified language in Passage 3.', status: 'upcoming' },
            { sessionNumber: 17, title: 'Mixed Practice: Passage 1 & 2', description: 'Speed drills for the first two easier passages.', status: 'upcoming' },
            { sessionNumber: 18, title: 'Mixed Practice: Passage 3', description: 'Deep-dive into academic and abstract texts.', status: 'upcoming' },
            { sessionNumber: 19, title: 'Common Traps & Distractors', description: 'Analyzing how IELTS test makers design tricky options.', status: 'upcoming' },
            { sessionNumber: 20, title: 'Full Mock Test 1', description: 'First comprehensive practice test.', status: 'upcoming' },
            { sessionNumber: 21, title: 'Mock Test 1 Review', description: 'Detailed breakdown of challenging questions.', status: 'upcoming' },
            { sessionNumber: 22, title: 'Full Mock Test 2', description: 'Second comprehensive practice test.', status: 'upcoming' },
            { sessionNumber: 23, title: 'Mock Test 2 Review', description: 'Final error analysis and personalized advice.', status: 'upcoming' },
            { sessionNumber: 24, title: 'Final Strategies & Exam Tips', description: 'Mental preparation and final checklist before test day.', status: 'upcoming' }
        ]
    }
};

export const LearnerClassDetailService = {
    getClassDetail: async (id: string): Promise<ClassDetailData | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_CLASS_DETAIL[id] || MOCK_CLASS_DETAIL['1']), 200));
    }
};
