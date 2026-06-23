import type { Class, CourseGroup, CreateClassDTO, UpdateClassDTO, UpdateClassSessionDTO, Session } from '../types/class';
import axiosClient from '@/shared/services/axiosClient';
import { formatAccountID } from '@/shared/lib/utils';

interface GetClassesResponse {
    success: boolean;
    data: Class[];
    total: number;
}

export const ClassesService = {
    getClasses: async (filters?: { status?: string; course_id?: string; tutor_id?: string }): Promise<Class[]> => {
        try {
            const res = await axiosClient.get<GetClassesResponse>('/staff/classes', { params: filters });
            return (res as unknown as { data: Class[] }).data || [];
        } catch (error) {
            console.error('Error fetching classes:', error);
            throw error;
        }
    },

    getClassById: async (id: string): Promise<Class> => {
        try {
            const res = await axiosClient.get<{success: boolean, data: Class}>(`/staff/classes/${id}`);
            return (res as unknown as { data: Class }).data;
        } catch (error) {
            console.error('Error fetching class details:', error);
            throw error;
        }
    },

    getCourseGroups: async (filters?: { status?: string; course_id?: string; tutor_id?: string }): Promise<CourseGroup[]> => {
        const classes = await ClassesService.getClasses(filters);
        // Group by course_id
        const groupsMap = new Map<string, CourseGroup>();
        
        classes.forEach(cls => {
            const courseId = cls.course_id;
            if (!groupsMap.has(courseId)) {
                groupsMap.set(courseId, {
                    id: courseId,
                    name: cls.courses?.title || 'Unknown Course',
                    startDate: cls.start_date, // will pick first class start date roughly
                    endDate: cls.end_date,
                    classes: []
                });
            }
            groupsMap.get(courseId)?.classes.push(cls);
        });

        return Array.from(groupsMap.values());
    },

    createClass: async (data: CreateClassDTO): Promise<Class> => {
        try {
            const res = await axiosClient.post<{success: boolean, data: Class}>('/staff/classes', data);
            return (res as unknown as { data: Class }).data;
        } catch (error) {
            console.error('Error creating class:', error);
            throw error;
        }
    },

    updateClass: async (id: string, data: UpdateClassDTO): Promise<Class> => {
        try {
            const res = await axiosClient.patch<{success: boolean, data: Class}>(`/staff/classes/${id}`, data);
            return (res as unknown as { data: Class }).data;
        } catch (error) {
            console.error('Error updating class:', error);
            throw error;
        }
    },

    updateSession: async (classId: string, sessionId: string, data: UpdateClassSessionDTO): Promise<Session> => {
        try {
            const res = await axiosClient.patch<{success: boolean, data: Session}>(`/staff/classes/${classId}/sessions/${sessionId}`, data);
            return (res as unknown as { data: Session }).data;
        } catch (error) {
            console.error('Error updating class session:', error);
            throw error;
        }
    },

    getClassStudents: async (classId: string): Promise<unknown[]> => {
        try {
            const res = await axiosClient.get<{success: boolean, data: unknown[]}>(`/staff/classes/${classId}/students`);
            const data = (res as unknown as { data: unknown[] }).data || [];
            return data.map((item: unknown) => {
                const typedItem = item as { id: string, account?: { id?: string, full_name?: string, email?: string, account_code?: string }, enrollment_date?: string, learner_id?: string };
                // Using 100% attendance dynamically based on total sessions later
                return {
                    id: typedItem.account?.id || typedItem.id,
                    code: formatAccountID(typedItem.account?.account_code || typedItem.account?.id || typedItem.learner_id || typedItem.id, 'LEARNER'),
                    name: typedItem.account?.full_name || 'Unknown',
                    email: typedItem.account?.email || 'N/A',
                    joinedDate: typedItem.enrollment_date ? new Date(typedItem.enrollment_date).toLocaleDateString('en-GB') : 'TBA',
                    attendanceRate: 100 // Mock attendance rate for now
                };
            });
        } catch (error) {
            console.error('Error fetching class students:', error);
            return [];
        }
    },

    cancelEnrollment: async (enrollmentId: string): Promise<boolean> => {
        try {
            await axiosClient.patch(`/enrollments/${enrollmentId}/cancel`);
            return true;
        } catch (error) {
            console.error('Error canceling enrollment:', error);
            throw error;
        }
    },

    addStudentToClass: async (learnerId: string, classId: string): Promise<unknown> => {
        try {
            const res = await axiosClient.post('/enrollments/manual', { learner_id: learnerId, class_id: classId });
            return (res as unknown as { data: unknown }).data;
        } catch (error) {
            console.error('Error adding student to class:', error);
            throw error;
        }
    },

    getOccupiedSessions: async (filters: { tutor_id?: string; classroom_id?: string; date?: string; slot?: string; start_date?: string; exclude_class_id?: string }): Promise<Session[]> => {
        try {
            const res = await axiosClient.get<{success: boolean, data: Session[]}>('/staff/classes/sessions/occupied', { params: filters });
            return (res as unknown as { data: Session[] }).data || [];
        } catch (error) {
            console.error('Error fetching occupied sessions:', error);
            return [];
        }
    },

    deleteClass: async (id: string): Promise<boolean> => {
        try {
            await axiosClient.delete(`/staff/classes/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting class:', error);
            throw error;
        }
    }
};
