import axios from 'axios';
import Cookies from 'js-cookie';
import type { Room } from '../types/classroom';

const API_URL = 'http://localhost:5000/api/classrooms';

const getHeaders = () => {
    const token = Cookies.get('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const ClassroomsService = {
    getClassrooms: async (): Promise<Room[]> => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching classrooms:', error);
            throw error;
        }
    },

    createClassroom: async (data: Partial<Room>): Promise<Room> => {
        try {
            const response = await axios.post(API_URL, data, getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error creating classroom:', error);
            throw error;
        }
    },

    updateClassroom: async (id: string, data: Partial<Room>): Promise<Room> => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data, getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error updating classroom:', error);
            throw error;
        }
    },

    deleteClassroom: async (id: string): Promise<boolean> => {
        try {
            await axios.delete(`${API_URL}/${id}`, getHeaders());
            return true;
        } catch (error) {
            console.error('Error deleting classroom:', error);
            throw error;
        }
    }
};
