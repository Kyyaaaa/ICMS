export interface Assessment {
    id: string;
    title: string;
    maxScore: number;
}

export interface StudentGrade {
    score: number | null;
    feedback: string;
}

export interface StudentWithGrades {
    id: string;
    name: string;
    code: string;
    grades: Record<string, StudentGrade>;
}

const MOCK_ASSESSMENTS: Assessment[] = [
    { id: 'a1', title: 'Listening', maxScore: 9 },
    { id: 'a2', title: 'Reading', maxScore: 9 },
    { id: 'a3', title: 'Writing', maxScore: 9 },
    { id: 'a4', title: 'Speaking', maxScore: 9 }
];

const MOCK_STUDENTS: StudentWithGrades[] = [
    { 
        id: 's1', 
        name: 'Nguyễn Văn A', 
        code: 'LE000001',
        grades: { 'a1': { score: 6.5, feedback: 'Good listening skills' }, 'a2': { score: 7.0, feedback: 'Skimming needs practice' }, 'a3': { score: 6.0, feedback: '' }, 'a4': { score: 6.5, feedback: 'Good fluency' } }
    },
    { 
        id: 's2', 
        name: 'Trần Thị B', 
        code: 'LE000002',
        grades: { 'a1': { score: 5.5, feedback: 'Missed some plural nouns' }, 'a2': { score: 6.0, feedback: '' }, 'a3': { score: 5.0, feedback: 'Task achievement is low' }, 'a4': { score: 5.5, feedback: '' } }
    },
    { 
        id: 's3', 
        name: 'Lê Hoàng C', 
        code: 'LE000003',
        grades: { 'a1': { score: 8.0, feedback: 'Excellent' }, 'a2': { score: 8.5, feedback: '' }, 'a3': { score: 7.0, feedback: '' }, 'a4': { score: 7.0, feedback: 'Try more complex structures' } }
    }
];

export const GradebookService = {
    getAssessments: async (_classId: string): Promise<Assessment[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_ASSESSMENTS), 300));
    },
    getStudentsWithGrades: async (_classId: string): Promise<StudentWithGrades[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_STUDENTS), 300));
    },
    saveGrades: async (_classId: string, _gradesData: StudentWithGrades[]): Promise<boolean> => {
        return new Promise(resolve => setTimeout(() => resolve(true), 800));
    }
};
