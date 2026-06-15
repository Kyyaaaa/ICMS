import type { Class, CourseGroup, CreateClassDTO, UpdateClassDTO, UpdateClassSessionDTO, Session } from '../types/class';
import axiosClient from '@/shared/services/axiosClient';

interface GetClassesResponse {
    success: boolean;
    data: Class[];
    total: number;
}

export const ClassesService = {
    getClasses: async (filters?: { status?: string; course_id?: string; tutor_id?: string }): Promise<Class[]> => {
        try {
            const res = await axiosClient.get<GetClassesResponse>('/staff/classes', { params: filters });
            return (res as any).data || [];
        } catch (error) {
            console.error('Error fetching classes:', error);
            throw error;
        }
    },

    getClassById: async (id: string): Promise<Class> => {
        try {
            const res = await axiosClient.get<{success: boolean, data: Class}>(`/staff/classes/${id}`);
            return (res as any).data;
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
            return (res as any).data;
        } catch (error) {
            console.error('Error creating class:', error);
            throw error;
        }
    },

    updateClass: async (id: string, data: UpdateClassDTO): Promise<Class> => {
        try {
            const res = await axiosClient.patch<{success: boolean, data: Class}>(`/staff/classes/${id}`, data);
            return (res as any).data;
        } catch (error) {
            console.error('Error updating class:', error);
            throw error;
        }
    },

    updateSession: async (classId: string, sessionId: string, data: UpdateClassSessionDTO): Promise<Session> => {
        try {
            const res = await axiosClient.patch<{success: boolean, data: Session}>(`/staff/classes/${classId}/sessions/${sessionId}`, data);
            return (res as any).data;
        } catch (error) {
            console.error('Error updating class session:', error);
            throw error;
        }
    },

    getClassStudents: async (classId: string): Promise<any[]> => {
        try {
            const res = await axiosClient.get<{success: boolean, data: any[]}>(`/staff/classes/${classId}/students`);
            const data = (res as any).data || [];
            return data.map((item: any) => ({
                id: item.id,
                name: item.account?.full_name || 'Unknown',
                email: item.account?.email || 'N/A',
                joinedDate: item.enrollment_date ? new Date(item.enrollment_date).toLocaleDateString() : 'TBA',
                attendanceRate: 100 // Mock attendance rate for now
            }));
        } catch (error) {
            console.error('Error fetching class students:', error);
            return [];
        }
    }
};
