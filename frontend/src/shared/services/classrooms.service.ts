import axiosClient from '@/shared/services/axiosClient';

export interface Classroom {
    id: string;
    room_name: string;
    capacity: number;
    status: string;
    equipment: Record<string, unknown> | null;
}

export const ClassroomsService = {
    getAll: async (): Promise<Classroom[]> => {
        try {
            const res = await axiosClient.get<unknown>('/classrooms');
            const rooms = Array.isArray(res) ? res : ((res as { data?: unknown[] })?.data || []);
            return rooms.map((r: unknown) => {
                const room = r as Record<string, unknown>;
                return {
                    ...room,
                    room_name: room.room_name || room.name
                } as Classroom;
            });
        } catch (error) {
            console.error('Error fetching classrooms', error);
            return [];
        }
    }
};
