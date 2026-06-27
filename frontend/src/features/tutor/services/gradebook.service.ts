import axiosClient from '../../../shared/services/axiosClient';

export interface Assessment {
    id: string;
    title: string;
    maxScore: number;
    order_index?: number;
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

interface ApiAssessment {
    id: string;
    name: string;
    order_index: number;
}

interface ApiStudent {
    id: string;
    name: string;
    email: string;
    grades: Record<string, StudentGrade>;
}

export const GradebookService = {
    getGradebook: async (classId: string): Promise<{ assessments: Assessment[], students: StudentWithGrades[], grading_status: string }> => {
        try {
            const res = await axiosClient.get<unknown>(`/tutor/classes/${classId}/gradebook`);
            const resData = res as { data?: { assessments: ApiAssessment[], students: ApiStudent[], grading_status: string }, assessments?: ApiAssessment[], students?: ApiStudent[], grading_status?: string };
            
            const rawAssessments = resData.data?.assessments || resData.assessments || [];
            const rawStudents = resData.data?.students || resData.students || [];
            const grading_status = resData.data?.grading_status || resData.grading_status || 'PENDING';
            
            const assessments = rawAssessments.map((a: ApiAssessment) => ({
                id: a.id,
                title: a.name,
                maxScore: 9,
                order_index: a.order_index
            }));
            
            const students = rawStudents.map((s: ApiStudent) => ({
                id: s.id,
                name: s.name || 'Unknown Learner',
                code: s.email || 'Unknown',
                grades: s.grades || {}
            }));

            return { assessments, students, grading_status };
        } catch (error) {
            console.error('Error fetching gradebook:', error);
            throw error;
        }
    },

    saveGrades: async (classId: string, payload: {
        deletedAssessmentIds: string[],
        upsertAssessments: { id: string, name: string, order_index: number }[],
        upsertGrades: { assessment_id: string, learner_id: string, score: number, feedback: string }[]
    }): Promise<boolean> => {
        try {
            await axiosClient.put(`/tutor/classes/${classId}/gradebook/save`, payload);
            return true;
        } catch (error) {
            console.error('Error saving gradebook:', error);
            throw error;
        }
    },

    publishGrades: async (classId: string): Promise<boolean> => {
        try {
            await axiosClient.post(`/tutor/classes/${classId}/publish-grades`);
            return true;
        } catch (error) {
            console.error('Error publishing grades:', error);
            throw error;
        }
    }
};
