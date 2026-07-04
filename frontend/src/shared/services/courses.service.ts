import type { Course } from '../types/course';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api/courses';

const getAuthHeaders = () => {
    const token = Cookies.get('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const CoursesService = {
    getCourses: async (): Promise<Course[]> => {
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    },

    getCourseById: async (id: string): Promise<Course | null> => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
            return response.data.data;
        } catch (error) {
            console.error('Error fetching course:', error);
            return null;
        }
    },

    createCourse: async (courseData: Record<string, unknown>): Promise<Course | null> => {
        try {
            const response = await axios.post(API_URL, courseData, getAuthHeaders());
            return response.data.data;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    },

    updateCourse: async (id: string, courseData: Record<string, unknown>): Promise<Course | null> => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, courseData, getAuthHeaders());
            return response.data.data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    },

    deleteCourse: async (id: string): Promise<boolean> => {
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            return true;
        } catch (error: unknown) {
            console.error('Error deleting course:', error);
            const message = axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to delete course';
            throw new Error(message || 'Failed to delete course', { cause: error });
        }
    },

    uploadImage: async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'courses');

            const token = Cookies.get('access_token');
            const response = await axios.post('http://localhost:5000/api/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            
            return response.data.url || response.data.data?.publicUrl || null;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }
};
