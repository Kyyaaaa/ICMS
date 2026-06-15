import type { LearnerClass } from '../types/class';

import axiosClient from '@/shared/services/axiosClient';

export const ClassesService = {
    getMyClasses: async (): Promise<LearnerClass[]> => {
        try {
            const res: any = await axiosClient.get('/enrollments');
            const data = res.data || [];
            
            return data.map((enrollment: any) => {
                const cls = enrollment.classes || {};
                const course = cls.courses || {};
                
                return {
                    id: cls.id,
                    courseName: course.title || 'Unknown Course',
                    className: cls.name || `Class ${cls.class_code || ''}`,
                    classCode: cls.class_code || 'Unknown',
                    tutorName: cls.tutor?.full_name || 'TBA',
                    room: cls.classroom?.room_name || 'TBA',
                    schedule: 'TBD',
                    time: 'TBD',
                    startDate: cls.start_date ? new Date(cls.start_date).toLocaleDateString() : 'TBD',
                    endDate: cls.end_date ? new Date(cls.end_date).toLocaleDateString() : 'TBD',
                    status: cls.status === 'COMPLETED' ? 'Completed' : 'Ongoing'
                };
            });
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
            return [];
        }
    }
};
