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
            const res: any = await axiosClient.get('/classrooms');
            const rooms = Array.isArray(res) ? res : (res?.data || []);
            return rooms.map((r: any) => ({
                ...r,
                room_name: r.room_name || r.name
            }));
        } catch (error) {
            console.error('Error fetching classrooms', error);
            return [];
        }
    }
};
