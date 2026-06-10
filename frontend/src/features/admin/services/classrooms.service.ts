import type { Room } from '../types/classroom';

// Mock data until backend is ready
let MOCK_ROOMS: Room[] = [
    { id: '1', name: 'Room 301', capacity: 30, status: 'Available' },
    { id: '2', name: 'Room 302', capacity: 30, status: 'Occupied' },
    { id: '3', name: 'Room 303', capacity: 25, status: 'Available' },
    { id: '4', name: 'Room 401', capacity: 40, status: 'Maintenance', maintenanceSchedule: { date: '2024-10-12', startTime: '14:00', endTime: '18:00', note: 'AC Repair' } },
    { id: '5', name: 'Room 402', capacity: 35, status: 'Available' },
    { id: '6', name: 'Room 501', capacity: 50, status: 'Available' },
    { id: '7', name: 'Room 502', capacity: 20, status: 'Available' },
];

export const ClassroomsService = {
    getClassrooms: async (): Promise<Room[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_ROOMS]), 300));
    },

    createClassroom: async (data: Partial<Room>): Promise<Room> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRoom = { ...data, id: Date.now().toString() } as Room;
                MOCK_ROOMS.push(newRoom);
                resolve(newRoom);
            }, 300);
        });
    },

    updateClassroom: async (id: string, data: Partial<Room>): Promise<Room> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                MOCK_ROOMS = MOCK_ROOMS.map(r => r.id === id ? { ...r, ...data } as Room : r);
                const updated = MOCK_ROOMS.find(r => r.id === id)!;
                resolve(updated);
            }, 300);
        });
    },

    deleteClassroom: async (id: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                MOCK_ROOMS = MOCK_ROOMS.filter(r => r.id !== id);
                resolve(true);
            }, 300);
        });
    }
};
