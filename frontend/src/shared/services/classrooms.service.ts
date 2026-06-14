import axiosClient from '@/shared/services/axiosClient';

export interface Classroom {
    id: string;
    room_name: string;
    capacity: number;
    status: string;
    equipment: any;
}

export const ClassroomsService = {
    getAll: async (): Promise<Classroom[]> => {
        try {
            const res = await axiosClient.get('/classrooms');
            return (res as any).data || [];
        } catch (error) {
            console.error('Error fetching classrooms', error);
            return [];
        }
    }
};
